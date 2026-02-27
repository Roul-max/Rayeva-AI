import { GoogleGenAI, Type } from "@google/genai";
import AiLog from "../models/AiLog.js";

/*
  Lazy initialization for Gemini.
  This avoids crashes if env variables aren’t loaded at import time.
*/
const getAI = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "GEMINI_API_KEY is not defined. Please check your backend .env file."
    );
  }

  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
};

// Allowed values (strict validation layer)
const ALLOWED_CATEGORIES = [
  "Eco Packaging",
  "Sustainable Office Supplies",
  "Organic Apparel",
  "Plastic-Free Personal Care",
  "Eco Gifting",
];

const ALLOWED_FILTERS = [
  "plastic-free",
  "compostable",
  "biodegradable",
  "vegan",
  "recycled",
  "reusable",
];


// =============================
// Auto Category + Tag Generator
// =============================
export const generateCategoryAndTags = async (
  productName,
  productDescription,
  model = "gemini-3-flash-preview",
  temperature = 0.7,
  retryCount = 0
) => {

  const prompt = `
    Analyze the following product and provide categorization and tags.
    
    Product Name: ${productName}
    Product Description: ${productDescription}
    
    Allowed primary_category values: ${ALLOWED_CATEGORIES.join(", ")}
    Allowed sustainability_filters values: ${ALLOWED_FILTERS.join(", ")}
    eco_score must be an integer between 0 and 100.
    
    Return strict JSON only.
  `;

  try {
    const ai = getAI();

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: parseFloat(temperature),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primary_category: { type: Type.STRING },
            sub_category: { type: Type.STRING },
            seo_tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            sustainability_filters: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            eco_score: { type: Type.INTEGER },
          },
          required: [
            "primary_category",
            "sub_category",
            "seo_tags",
            "sustainability_filters",
            "eco_score",
          ],
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    // ---- Validation Layer ----

    // Validate category
    if (!ALLOWED_CATEGORIES.includes(result.primary_category)) {
      throw new Error("AI Validation Error: Invalid primary category.");
    }

    // Validate filters
    const invalidFilters = result.sustainability_filters.filter(
      (filter) => !ALLOWED_FILTERS.includes(filter)
    );

    if (invalidFilters.length > 0) {
      throw new Error("AI Validation Error: Invalid sustainability filters.");
    }

    // Save successful AI log
    await AiLog.create({
      module: "Auto-Category & Tag Generator",
      prompt,
      response: jsonText,
      status: "success",
    });

    return result;

  } catch (error) {
    let errorMessage = error.message;

    // Handle common API cases
    if (error.status === 429) {
      errorMessage = "AI API Error: Rate limit exceeded.";
    } else if (error.status >= 500) {
      errorMessage = "AI API Error: Service unavailable.";
    } else if (error instanceof SyntaxError) {
      errorMessage = "AI Validation Error: Malformed JSON.";
    }

    // Retry logic (max 2 retries)
    if (retryCount < 2) {
      console.warn(
        `AI generation failed. Retrying (${retryCount + 1}/2)...`,
        errorMessage
      );

      return generateCategoryAndTags(
        productName,
        productDescription,
        model,
        temperature,
        retryCount + 1
      );
    }

    // Log failure after retries
    await AiLog.create({
      module: "Auto-Category & Tag Generator",
      prompt,
      response: errorMessage,
      status: "failed",
    });

    throw new Error(errorMessage);
  }
};


// =============================
// Impact Statement Generator
// =============================
export const generateImpactStatement = async (
  plasticSavedGrams,
  carbonAvoidedKg,
  model = "gemini-3-flash-preview",
  temperature = 0.7
) => {

  const prompt = `
    Write a short professional impact statement.
    
    Plastic saved: ${plasticSavedGrams} grams
    Carbon avoided: ${carbonAvoidedKg} kg
    
    Return strict JSON:
    { "impact_statement": "..." }
  `;

  try {
    const ai = getAI();

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        temperature: parseFloat(temperature),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            impact_statement: { type: Type.STRING },
          },
          required: ["impact_statement"],
        },
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    // Log success
    await AiLog.create({
      module: "Impact Reporting Generator",
      prompt,
      response: jsonText,
      status: "success",
    });

    return result;

  } catch (error) {
    // Log failure
    await AiLog.create({
      module: "Impact Reporting Generator",
      prompt,
      response: error.message,
      status: "failed",
    });

    throw new Error("AI Generation Failed");
  }
};
