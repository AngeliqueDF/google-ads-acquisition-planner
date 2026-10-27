export function calculateRequiredClicks(
  requiredLeads: number | null,
  landingPageConversionPercent: number,
): number | null {
  return requiredLeads !== null && landingPageConversionPercent > 0
    ? requiredLeads / (landingPageConversionPercent / 100)
    : null
}

export function calculateCostPerLead(
  costPerClick: number,
  landingPageConversionPercent: number,
): number | null {
  return landingPageConversionPercent > 0
    ? costPerClick / (landingPageConversionPercent / 100)
    : null
}

export function calculateEstimatedBudget(
  requiredClicks: number | null,
  costPerClick: number,
): number | null {
  return requiredClicks === null ? null : requiredClicks * costPerClick
}

export function calculateEstimatedCpa(
  estimatedBudget: number | null,
  targetClients: number,
): number | null {
  return estimatedBudget !== null && targetClients > 0 ? estimatedBudget / targetClients : null
}
