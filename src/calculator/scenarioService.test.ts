import { describe, expect, it } from 'vitest'
import type { CalculatorInputs } from './types'
import { calculateScenario } from './scenarioService'

const baseInputs: CalculatorInputs = {
  targetClients: 10,
  period: 'month',
  averageRevenuePerClient: 600,
  grossMarginPercent: 30,
  retainedMarginPerClient: 120,
  closingRatePercent: 20,
  landingPageConversionPercent: 10,
  costPerClick: 2,
}

describe('calculateScenario', () => {
  it('combines estimates for a complete scenario', () => {
    expect(calculateScenario(baseInputs)).toEqual({
      projectedRevenue: 6000,
      grossMarginPerClient: 180,
      maximumAcceptableCpa: 60,
      hasAcquisitionMargin: true,
      requiredLeads: 50,
      requiredClicks: 500,
      costPerLead: 20,
      estimatedBudget: 1000,
      estimatedCpa: 100,
    })
  })

  it('reports no acquisition margin when the amount to retain exceeds gross margin', () => {
    const inputs = { ...baseInputs, retainedMarginPerClient: 181 }
    const results = calculateScenario(inputs)

    expect(results.maximumAcceptableCpa).toBeNull()
    expect(results.hasAcquisitionMargin).toBe(false)
  })

  it('reports acquisition margin when no margin remains for acquisition', () => {
    const inputs = { ...baseInputs, retainedMarginPerClient: 180 }
    const results = calculateScenario(inputs)

    expect(results.maximumAcceptableCpa).toBe(0)
    expect(results.hasAcquisitionMargin).toBe(true)
  })

  it('uses the prospect estimate to calculate clicks, budget, and acquisition cost', () => {
    const inputs = {
      ...baseInputs,
      targetClients: 1,
      closingRatePercent: 40,
      landingPageConversionPercent: 30,
    }
    const results = calculateScenario(inputs)

    expect(results.requiredLeads).toBe(2.5)
    expect(results.requiredClicks).toBeCloseTo(8.3333)
    expect(results.estimatedBudget).toBeCloseTo(16.6667)
    expect(results.estimatedCpa).toBeCloseTo(16.6667)
  })

  it('keeps projected revenue unchanged when the selected cadence changes', () => {
    const results = calculateScenario({ ...baseInputs, period: 'quarter' })

    expect(results.projectedRevenue).toBe(6000)
  })
})
