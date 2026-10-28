import { describe, expect, it } from 'vitest'
import { calculateRequiredLeads } from './calculations'

describe('calculateRequiredLeads', () => {
  it('returns a fractional prospect estimate without rounding up', () => {
    expect(calculateRequiredLeads(3, 40)).toBe(7.5)
  })

  it('returns null when the closing rate is zero', () => {
    expect(calculateRequiredLeads(10, 0)).toBeNull()
  })
})
