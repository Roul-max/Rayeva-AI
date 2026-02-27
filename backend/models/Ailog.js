import mongoose from "mongoose";

// Schema to store AI request/response logs
const aiLogSchema = new mongoose.Schema(
  {
    module: String,       // Which feature/module triggered the AI call
    prompt: String,       // Prompt sent to AI
    response: String,     // AI's raw response
    status: {
      type: String,
      default: "success", // success | failed (can be updated if needed)
    },
  },
  {
    timestamps: true,     // Automatically adds createdAt & updatedAt
  }
);

// Create model from schema
const AiLog = mongoose.model("AiLog", aiLogSchema);

export default AiLog;