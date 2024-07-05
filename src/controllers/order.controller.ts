import { orderModel } from "../models/order.model";
import jwt from "jsonwebtoken";
import { encrypt, decrypt } from "../utils/encryption";
import { IReqUser } from "../utils/interfaces";
import { Request, Response } from "express";
import userModel from "../models/user.model";
import productsModel from "../models/products.model";
const _ = require("lodash");

export const createOrder = async (req: Request, res: Response) => {
  const userId = (req as IReqUser).user.id;
  try {
    const user = await userModel.findById(userId);

    const orderItems = [];
    const productsUpdate = [];
    let grandSum = 0;
    for (const item of req.body.orderItems) {
      const { productId, quantity } = item;
      const product = await productsModel.findById(productId);

      //   console.log("req=> ", item.quantity);
      // console.log("db=>> ", product?.id);

      if (product) {
        const calc = product.price * quantity;
        grandSum += calc;
        // console.log(grandSum)
        let substractProduct = (product.qty -= item.quantity);
        if (substractProduct < 0) {
          res.json({ msg: "Product is empty" });
        }

        productsUpdate.push({
          _id: product.id,
          qty: substractProduct,
        });

        orderItems.push({
          name: product.name,
          productId: product._id,
          price: product.price,
          quantity: substractProduct,
        });
      } else {
        console.log("Error order");
      }
    }

    for (const productUpd of orderItems) {
      if (productUpd?.quantity < 0) {
        res.json({ msg: "Product is empty bos" });
      } else {
        const updateProducts = await productsModel.findOneAndUpdate(
          { _id: productUpd.productId },
          { qty: productUpd.quantity },
          { new: true }
        );
        console.log(productUpd);
      }
    }

    const order = await orderModel.create({
      grandTotal: grandSum,
      orderItems: orderItems,
      createdBy: user?._id,
      status: "pending",
    });

    res.status(200).json({
      msg: "Order Details",
      order: order,
      product: productsUpdate,
    });
  } catch (error) {
    console.log(error);
  }
};

interface IpaginationQuery {
  page: number;
  limit: number;
  search?: string;
}

export const historyOrder = async (req: Request, res: Response) => {
  const userId = (req as IReqUser).user.id;
  try {
    const userNow = await userModel.findById(userId);
    const userNowId = userNow?._id;
    //   console.log(userNow?._id)

    const {
      limit = 10,
      page = 1,
      search = "",
    } = req.query as unknown as IpaginationQuery;

    const query = {};

    if (search) {
      Object.assign(query, {
        name: { $regex: search, $options: "i" },
      });
    }

    const result = await orderModel
      .find(query)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await orderModel.countDocuments(query);

    const validated = [];
    for (const resUser of result) {
      const validate = () => _.isEqual(resUser.createdBy, userNowId);

      const isSome = validate();
      // console.log(userNowId)

      if (isSome) {
        validated.push(resUser);
      }
    }
    res.status(200).json({
      data: validated,
      page: +page,
      limit: +limit,
      total,
      totalPages: Math.ceil(total / limit),
      msg: "Get all history orders successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
