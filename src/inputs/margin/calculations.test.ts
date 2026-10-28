import { describe, expect, it } from 'vitest'
import { calculateGrossMarginPerClient, calculateMaximumAcceptableCpa } from './calculations'

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
