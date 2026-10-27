export function calculateGrossMarginPerClient(
  averageRevenuePerClient: number,
  grossMarginPercent: number,
): number {
  return averageRevenuePerClient * (grossMarginPercent / 100)
}

export function calculateMaximumAcceptableCpa(
  grossMarginPerClient: number,
  retainedMarginPerClient: number,
): number | null {
  const maximumAcceptableCpa = grossMarginPerClient - retainedMarginPerClient
  return maximumAcceptableCpa >= 0 ? maximumAcceptableCpa : null
}

export function calculateRequiredLeads(
  targetClients: number,
  closingRatePercent: number,
): number | null {
  return closingRatePercent > 0 ? Math.ceil(targetClients / (closingRatePercent / 100)) : null
}

export function calculateRequiredClicks(
  requiredLeads: number | null,
  landingPageConversionPercent: number,
): number | null {
  return requiredLeads !== null && landingPageConversionPercent > 0
    ? Math.ceil(requiredLeads / (landingPageConversionPercent / 100))
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
