import express from "express";
import {
  createProduct,
  getProducts,
} from "../controllers/product.controller.js";

const router = express.Router();

// GET /api/products
// Fetch products (with optional filters/search)
router.get("/", getProducts);

// POST /api/products
// Create a new product (AI metadata included)
router.post("/", createProduct);

export default router;