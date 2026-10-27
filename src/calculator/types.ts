export type Period = 'month' | 'quarter' | 'year'

export type StepNumber = 1 | 2 | 3 | 4

export interface CalculatorInputs {
  targetClients: number
  period: Period
  averageRevenuePerClient: number
  grossMarginPercent: number
  retainedMarginPerClient: number
  closingRatePercent: number
  landingPageConversionPercent: number
  costPerClick: number
}

export interface ScenarioResults {
  projectedRevenue: number
  grossMarginPerClient: number
  maximumAcceptableCpa: number | null
  hasAcquisitionMargin: boolean
  requiredLeads: number | null
  requiredClicks: number | null
  costPerLead: number | null
  estimatedBudget: number | null
  estimatedCpa: number | null
}
