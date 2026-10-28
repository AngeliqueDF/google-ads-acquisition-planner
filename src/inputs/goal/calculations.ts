export function calculateProjectedRevenue(
  targetClients: number,
  averageRevenuePerClient: number,
): number {
  return targetClients * averageRevenuePerClient
}
