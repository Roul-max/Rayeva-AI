import dns from "node:dns";
dns.setServers(["1.1.1.1"]); // Force Cloudflare DNS (helps avoid some DNS issues)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import productRoutes from "./routes/product.routes.js";
import impactRoutes from "./routes/impact.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

/* -----------------------------
   Load environment variables
------------------------------ */
dotenv.config();

/* -----------------------------
   Check required ENV variables
------------------------------ */
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing in .env file");
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "GEMINI_API_KEY is not set. AI-related routes may not work properly."
  );
}

/* -----------------------------
   Connect to MongoDB
------------------------------ */
connectDB();

/* -----------------------------
   Initialize Express app
------------------------------ */
const app = express();
const PORT = process.env.PORT || 5000;

/* -----------------------------
   CORS setup
------------------------------ */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

/* -----------------------------
   Middlewares
------------------------------ */
app.use(express.json());

/* -----------------------------
   Health check route
   (Used by Render or similar services)
------------------------------ */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running 🚀",
  });
});

/* -----------------------------
   API routes
------------------------------ */
app.use("/api/products", productRoutes);
app.use("/api/impact", impactRoutes);

/* -----------------------------
   Global error handler
------------------------------ */
app.use(errorHandler);

/* -----------------------------
   Start server
------------------------------ */
app.listen(PORT, () => {
  console.log("=====================================");
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Environment: ${process.env.NODE_ENV || "development"}`
  );
  console.log("=====================================");
});