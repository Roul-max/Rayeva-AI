import express from "express";
import { generateImpact } from "../controllers/impact.controller.js";

const router = express.Router();

// POST /api/impact
// Generates sustainability impact + AI statement
router.post("/", generateImpact);

export default router;