import Product from "../models/Product.js";
import { generateCategoryAndTags } from "../services/ai.service.js";

// Get all products (with optional filters)
export const getProducts = async (req, res, next) => {
  try {
    const { category, filter, search } = req.query;

    const query = {};

    // Apply category filter if provided
    if (category) {
      query.primary_category = category;
    }

    // Apply sustainability filter
    if (filter) {
      query.sustainability_filters = filter;
    }

    // Text search (if user searches something)
    if (search) {
      query.$text = { $search: search };
    }

    // Fetch products sorted by latest first
    const products = await Product.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {
    next(error);
  }
};


// Create new product
export const createProduct = async (req, res, next) => {
  try {
    const { name, description, model, temperature } = req.body;

    // Basic validation
    if (!name || !description) {
      return res.status(400).json({
        error: "Name and description are required",
      });
    }

    // Call AI service to auto-generate category + tags
    const aiResponse = await generateCategoryAndTags(
      name,
      description,
      model,
      temperature
    );

    // Save product with AI-generated metadata
    const product = await Product.create({
      name,
      description,
      ...aiResponse,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully with AI metadata",
      data: product,
    });

  } catch (error) {
    // Forward error to global handler
    next(error);
  }
};