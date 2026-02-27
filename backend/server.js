import dns from "node:dns";
dns.setServers(["1.1.1.1"]); // Force Cloudflare DNS

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import productRoutes from "./routes/product.routes.js";
import impactRoutes from "./routes/impact.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

/* =============================
   Load Environment Variables
============================= */
dotenv.config();

/* =============================
   Validate Required ENV Vars
============================= */
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing");
  process.exit(1);
}

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "⚠️ GEMINI_API_KEY not set. AI routes may not work properly."
  );
}

/* =============================
   Connect Database
============================= */
connectDB();

/* =============================
   Initialize Express
============================= */
const app = express();
const PORT = process.env.PORT || 5000;

/* =============================
   CORS Configuration
============================= */
const allowedOrigins = [
  "http://localhost:5173",       // Local development
  process.env.CLIENT_URL         // Production frontend (Vercel)
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("Incoming Origin:", origin);

      // Allow server-to-server or Postman requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("Blocked by CORS:", origin);
      return callback(null, false); // Block safely (no crash)
    },
    credentials: true,
  })
);

/* =============================
   Middlewares
============================= */
app.use(express.json());

/* =============================
   Health Check Route
============================= */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running 🚀",
  });
});

/* =============================
   API Routes
============================= */
app.use("/api/products", productRoutes);
app.use("/api/impact", impactRoutes);

/* =============================
   Global Error Handler
============================= */
app.use(errorHandler);

/* =============================
   Start Server
============================= */
app.listen(PORT, () => {
  console.log("=====================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(
    `🌍 Environment: ${process.env.NODE_ENV || "development"}`
  );
  console.log("=====================================");
});