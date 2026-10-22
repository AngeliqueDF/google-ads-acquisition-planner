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
  const grossMarginPerClient = inputs.averageRevenuePerClient * (inputs.grossMarginPercent / 100)
  const maximumAcceptableCpa = grossMarginPerClient - inputs.retainedMarginPerClient
  const hasAcquisitionMargin = maximumAcceptableCpa >= 0
  const requiredLeads =
    inputs.closingRatePercent > 0
      ? Math.ceil(inputs.targetClients / (inputs.closingRatePercent / 100))
      : null
  const requiredClicks =
    requiredLeads !== null && inputs.landingPageConversionPercent > 0
      ? Math.ceil(requiredLeads / (inputs.landingPageConversionPercent / 100))
      : null
  const costPerLead =
    inputs.landingPageConversionPercent > 0
      ? inputs.costPerClick / (inputs.landingPageConversionPercent / 100)
      : null
  const estimatedBudget = requiredClicks === null ? null : requiredClicks * inputs.costPerClick
  const estimatedCpa =
    estimatedBudget !== null && inputs.targetClients > 0
      ? estimatedBudget / inputs.targetClients
      : null

  return {
    grossMarginPerClient,
    maximumAcceptableCpa: hasAcquisitionMargin ? maximumAcceptableCpa : null,
    hasAcquisitionMargin,
    requiredLeads,
    requiredClicks,
    costPerLead,
    estimatedBudget,
    estimatedCpa,
  }
}
