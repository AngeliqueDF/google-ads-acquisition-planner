import { describe, expect, it } from 'vitest'
import { calculateProjectedRevenue } from './calculations'

describe('calculateProjectedRevenue', () => {
  it('multiplies target clients by average revenue per client', () => {
    expect(calculateProjectedRevenue(10, 600)).toBe(6000)
  })

  it('returns zero when either input is zero', () => {
    expect(calculateProjectedRevenue(0, 600)).toBe(0)
    expect(calculateProjectedRevenue(10, 0)).toBe(0)
  })
})
