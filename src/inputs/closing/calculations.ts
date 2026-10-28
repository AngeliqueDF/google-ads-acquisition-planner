export function calculateRequiredLeads(
  targetClients: number,
  closingRatePercent: number,
): number | null {
  return closingRatePercent > 0 ? targetClients / (closingRatePercent / 100) : null
}
