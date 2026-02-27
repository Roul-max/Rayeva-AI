export const calculateImpact = (quantity, locallySourced) => {
  const qty = Number(quantity);

  // Basic validation
  if (isNaN(qty) || qty < 0) {
    throw new Error("Invalid quantity provided");
  }

  // Base calculations
  let plasticSavedGrams = qty * 18;     // 18g plastic saved per unit
  let carbonAvoidedKg = qty * 0.12;     // 0.12kg carbon avoided per unit

  // Extra carbon benefit if product is locally sourced
  if (locallySourced) {
    carbonAvoidedKg += qty * 0.05;
  }

  return {
    plasticSavedGrams: Number(plasticSavedGrams.toFixed(2)),
    carbonAvoidedKg: Number(carbonAvoidedKg.toFixed(2)),
  };
};