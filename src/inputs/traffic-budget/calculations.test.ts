import { describe, expect, it } from 'vitest'
import {
  calculateCostPerLead,
  calculateEstimatedBudget,
  calculateEstimatedCpa,
  calculateRequiredClicks,
} from './calculations'

describe('calculateRequiredClicks', () => {
  it('returns a fractional click estimate without rounding up', () => {
    expect(calculateRequiredClicks(8, 30)).toBeCloseTo(26.6667)
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

  it('returns zero when click cost is zero', () => {
    expect(calculateCostPerLead(0, 10)).toBe(0)
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

  it('returns zero when click cost is zero', () => {
    expect(calculateEstimatedBudget(500, 0)).toBe(0)
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
