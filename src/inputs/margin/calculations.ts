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
