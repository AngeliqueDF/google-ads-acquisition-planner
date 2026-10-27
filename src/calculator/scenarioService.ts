import { calculateRequiredLeads } from '../inputs/closing/calculations'
import {
  calculateGrossMarginPerClient,
  calculateMaximumAcceptableCpa,
} from '../inputs/margin/calculations'
import { calculateProjectedRevenue } from '../inputs/goal/calculations'
import {
  calculateCostPerLead,
  calculateEstimatedBudget,
  calculateEstimatedCpa,
  calculateRequiredClicks,
} from '../inputs/traffic-budget/calculations'
import type { CalculatorInputs, ScenarioResults } from './types'

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
