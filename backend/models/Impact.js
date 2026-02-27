import mongoose from "mongoose";

// Schema for storing sustainability impact data
const impactSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true, // Number of items
    },

    locally_sourced: {
      type: Boolean,
      required: true, // Whether the product was locally sourced
    },

    plastic_saved_grams: {
      type: Number, // Calculated plastic saved
    },

    carbon_avoided_kg: {
      type: Number, // Calculated carbon reduction
    },

    impact_statement: {
      type: String, // AI-generated summary
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const Impact = mongoose.model("Impact", impactSchema);

export default Impact;