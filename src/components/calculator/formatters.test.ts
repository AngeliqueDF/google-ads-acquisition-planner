import { describe, expect, it } from 'vitest'
import { formatCount, formatCurrency, formatEstimate } from './formatters'

describe('calculator formatters', () => {
  it('keeps target client counts as whole numbers', () => {
    expect(formatCount(10)).toBe('10')
  })

  it('displays fractional estimates with two decimal places', () => {
    expect(formatEstimate(7.5)).toBe('7,50')
    expect(formatEstimate(7.456)).toBe('7,46')
    expect(formatEstimate(null)).toBe('—')
  })

  it('displays euro amounts with two decimal places', () => {
    expect(formatCurrency(600)).toBe('600,00 €')
    expect(formatCurrency(600.456)).toBe('600,46 €')
  })
})
