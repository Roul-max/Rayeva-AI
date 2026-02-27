import Impact from "../models/Impact.js";
import { calculateImpact } from "../services/impact.service.js";
import { generateImpactStatement } from "../services/ai.service.js";

export const generateImpact = async (req, res, next) => {
  try {
    const { quantity, locally_sourced, model, temperature } = req.body;

    // Basic validation
    if (quantity === undefined || locally_sourced === undefined) {
      return res.status(400).json({
        error: "Quantity and locally_sourced are required",
      });
    }

    // 1️⃣ Calculate sustainability impact
    const impactResult = calculateImpact(quantity, locally_sourced);
    const plasticSavedGrams = impactResult.plasticSavedGrams;
    const carbonAvoidedKg = impactResult.carbonAvoidedKg;

    // 2️⃣ Generate AI impact statement
    const aiResponse = await generateImpactStatement(
      plasticSavedGrams,
      carbonAvoidedKg,
      model,
      temperature
    );

    // 3️⃣ Store everything in database
    const impact = await Impact.create({
      quantity,
      locally_sourced,
      plastic_saved_grams: plasticSavedGrams,
      carbon_avoided_kg: carbonAvoidedKg,
      impact_statement: aiResponse.impact_statement,
    });

    // Send response back to client
    return res.status(201).json({
      success: true,
      message: "Impact generated successfully",
      data: impact,
    });

  } catch (error) {
    // Let global error handler deal with it
    next(error);
  }
};