import {
  calculateCostPerLead,
  calculateEstimatedBudget,
  calculateEstimatedCpa,
  calculateGrossMarginPerClient,
  calculateMaximumAcceptableCpa,
  calculateProjectedRevenue,
  calculateRequiredClicks,
  calculateRequiredLeads,
} from './calculationUtils'

export type Period = 'month' | 'quarter' | 'year'

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

export function calculateScenario(inputs: CalculatorInputs): ScenarioResults {
  const projectedRevenue = calculateProjectedRevenue(
    inputs.targetClients,
    inputs.averageRevenuePerClient,
  )
  const grossMarginPerClient = calculateGrossMarginPerClient(
    inputs.averageRevenuePerClient,
    inputs.grossMarginPercent,
  )
  const maximumAcceptableCpa = calculateMaximumAcceptableCpa(
    grossMarginPerClient,
    inputs.retainedMarginPerClient,
  )
  const requiredLeads = calculateRequiredLeads(inputs.targetClients, inputs.closingRatePercent)
  const requiredClicks = calculateRequiredClicks(requiredLeads, inputs.landingPageConversionPercent)
  const costPerLead = calculateCostPerLead(inputs.costPerClick, inputs.landingPageConversionPercent)
  const estimatedBudget = calculateEstimatedBudget(requiredClicks, inputs.costPerClick)
  const estimatedCpa = calculateEstimatedCpa(estimatedBudget, inputs.targetClients)

  return {
    projectedRevenue,
    grossMarginPerClient,
    maximumAcceptableCpa,
    hasAcquisitionMargin: maximumAcceptableCpa !== null,
    requiredLeads,
    requiredClicks,
    costPerLead,
    estimatedBudget,
    estimatedCpa,
  }
}
