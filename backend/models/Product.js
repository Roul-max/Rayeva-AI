import mongoose from "mongoose";

// Schema for products
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    primary_category: {
      type: String,
    },

    sub_category: {
      type: String, // ADD THIS
    },

    sustainability_filters: [
      String,
    ],

    seo_tags: [
      String, // ADD THIS
    ],

    eco_score: {
      type: Number, // ADD THIS
    },
  },
  {
    timestamps: true,
  }
);

// Enable text search on name + description
productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);

export default Product;