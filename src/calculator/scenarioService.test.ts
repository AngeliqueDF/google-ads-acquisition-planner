import { describe, expect, it } from 'vitest'
import type { CalculatorInputs } from './types'
import { calculateScenario } from './scenarioService'

const baseInputs: CalculatorInputs = {
  targetClients: 10,
  period: 'month',
  averageRevenuePerClient: 600,
  grossMarginPercent: 50,
  retainedMarginPerClient: 120,
  closingRatePercent: 20,
  landingPageConversionPercent: 4,
  costPerClick: 2,
}

describe('calculateScenario', () => {
  it('combines estimates for a complete scenario', () => {
    expect(calculateScenario(baseInputs)).toEqual({
      projectedRevenue: 6000,
      grossMarginPerClient: 300,
      maximumAcceptableCpa: 180,
      hasAcquisitionMargin: true,
      requiredLeads: 50,
      requiredClicks: 1250,
      costPerLead: 50,
      estimatedBudget: 2500,
      estimatedCpa: 250,
    })
  })

  it('reports no acquisition margin when the amount to retain exceeds gross margin', () => {
    const inputs = { ...baseInputs, retainedMarginPerClient: 301 }
    const results = calculateScenario(inputs)

    expect(results.maximumAcceptableCpa).toBeNull()
    expect(results.hasAcquisitionMargin).toBe(false)
  })

  it('reports acquisition margin when no margin remains for acquisition', () => {
    const inputs = { ...baseInputs, retainedMarginPerClient: 300 }
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
