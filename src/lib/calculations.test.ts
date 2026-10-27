import { describe, expect, it } from 'vitest'
import {
  calculateCostPerLead,
  calculateEstimatedBudget,
  calculateEstimatedCpa,
  calculateGrossMarginPerClient,
  calculateMaximumAcceptableCpa,
  calculateRequiredClicks,
  calculateRequiredLeads,
} from './calculationUtils'
import { calculateScenario, type CalculatorInputs } from './calculations'

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

describe('calculateGrossMarginPerClient', () => {
  it('multiplies average revenue by the gross margin percentage', () => {
    expect(calculateGrossMarginPerClient(600, 30)).toBe(180)
  })
})

describe('calculateMaximumAcceptableCpa', () => {
  it('subtracts the amount to retain from gross margin', () => {
    expect(calculateMaximumAcceptableCpa(180, 120)).toBe(60)
  })

  it('returns zero when all gross margin is retained', () => {
    expect(calculateMaximumAcceptableCpa(180, 180)).toBe(0)
  })

  it('returns null when retained margin exceeds gross margin', () => {
    expect(calculateMaximumAcceptableCpa(180, 181)).toBeNull()
  })
})

describe('calculateRequiredLeads', () => {
  it('divides target clients by the closing rate and rounds up to a whole prospect', () => {
    expect(calculateRequiredLeads(3, 40)).toBe(8)
  })

  it('returns null when the closing rate is zero', () => {
    expect(calculateRequiredLeads(10, 0)).toBeNull()
  })
})

describe('calculateRequiredClicks', () => {
  it('divides required prospects by page conversion and rounds up to a whole click', () => {
    expect(calculateRequiredClicks(8, 30)).toBe(27)
  })

  it('returns null when required prospects are unavailable', () => {
    expect(calculateRequiredClicks(null, 30)).toBeNull()
  })

  it('returns null when page conversion is zero', () => {
    expect(calculateRequiredClicks(50, 0)).toBeNull()
  })
})

describe('calculateCostPerLead', () => {
  it('divides click cost by the page conversion rate', () => {
    expect(calculateCostPerLead(2, 10)).toBe(20)
  })

  it('returns null when page conversion is zero', () => {
    expect(calculateCostPerLead(2, 0)).toBeNull()
  })
})

describe('calculateEstimatedBudget', () => {
  it('multiplies required clicks by click cost', () => {
    expect(calculateEstimatedBudget(500, 2)).toBe(1000)
  })

  it('returns null when required clicks are unavailable', () => {
    expect(calculateEstimatedBudget(null, 2)).toBeNull()
  })
})

describe('calculateEstimatedCpa', () => {
  it('divides estimated budget by the target client count', () => {
    expect(calculateEstimatedCpa(1000, 10)).toBe(100)
  })

  it('returns null when the target client count is zero', () => {
    expect(calculateEstimatedCpa(1000, 0)).toBeNull()
  })

  it('returns null when the estimated budget is unavailable', () => {
    expect(calculateEstimatedCpa(null, 10)).toBeNull()
  })
})

describe('calculateScenario', () => {
  it('assembles all calculation results for a complete monthly scenario', () => {
    expect(calculateScenario(baseInputs)).toEqual({
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

  it('reports no acquisition margin when the retained amount exceeds gross margin', () => {
    const inputs = { ...baseInputs, retainedMarginPerClient: 181 }
    const results = calculateScenario(inputs)

    expect(results.maximumAcceptableCpa).toBeNull()
    expect(results.hasAcquisitionMargin).toBe(false)
  })

  it('reports acquisition margin when the maximum acceptable cost is zero', () => {
    const inputs = { ...baseInputs, retainedMarginPerClient: 180 }
    const results = calculateScenario(inputs)

    expect(results.maximumAcceptableCpa).toBe(0)
    expect(results.hasAcquisitionMargin).toBe(true)
  })
})
