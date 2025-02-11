import express, { Router, Request, Response } from "express";
import { createProduct, deleteProduct, getAllProducts, getProduct, updateProduct } from "./controllers/products.controller";
import { createCategory, deleteCategory, getAllCategories, getCategory, updateCategory } from "./controllers/category.controller";
import { single } from "./middleware/upload.middleware";
import authController from './controllers/auth.controller';
import authMiddleware from "./middleware/auth.middleware";
import aclMiddleware from "./middleware/acl.middleware";
import { createOrder, historyOrder } from "./controllers/order.controller";

const router = express.Router()

// Order Routes
router.get('/order', [authMiddleware, aclMiddleware(["user"])], historyOrder)
router.post('/order', [authMiddleware, aclMiddleware(["user"])], createOrder)

// Product Routes
router.post('/product', single, createProduct)
router.get('/product', getAllProducts)
router.get('/product/:id', getProduct)
router.put('/product:/id', updateProduct)
router.delete('/product', deleteProduct)

// Category Routes
router.post('/category', createCategory)
router.get('/category', getAllCategories)
router.get('/category/:id', getCategory)
router.put('/category/:id', updateCategory)
router.delete('/category/:id', deleteCategory)

// Authentication
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.get("/auth/me", [authMiddleware, aclMiddleware(["user"])], authController.me);
router.put("/auth/profile", authMiddleware, authController.profile);

export default router;