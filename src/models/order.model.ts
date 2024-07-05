import mongoose from "mongoose";
import { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        grandTotal: {
            type: Number,
            required: true
        },
        orderItems: [
            {
                name: {
                    type: String,
                    required: true,
                },
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Products',
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                    max: 5
                }
            }
        ],
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "completed", "cancelled"],
            required: true
        }
    },
    {timestamps: true}
);

export const orderModel = mongoose.model('Order', orderSchema);