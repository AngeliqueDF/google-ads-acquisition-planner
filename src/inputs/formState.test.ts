import { describe, expect, it } from 'vitest'
import { getInputs, initialFormValues, updateNumberInput, updatePeriodInput } from './formState'

describe('input state', () => {
  it('updates a numeric field while preserving other form values', () => {
    const values = updateNumberInput(initialFormValues, 'targetClients', 12)

    expect(values.targetClients).toBe('12')
    expect(values.averageRevenuePerClient).toBe(initialFormValues.averageRevenuePerClient)
  })

  it('updates the selected cadence while preserving other form values', () => {
    const values = updatePeriodInput(initialFormValues, 'quarter')

    expect(values.period).toBe('quarter')
    expect(values.targetClients).toBe(initialFormValues.targetClients)
  })

  it('converts form strings into calculation inputs and converts closing rate to a percentage', () => {
    const inputs = getInputs({
      ...initialFormValues,
      targetClients: '12',
      closingRateOutOfTen: '2.5',
    })

    expect(inputs.targetClients).toBe(12)
    expect(inputs.closingRatePercent).toBe(25)
    expect(inputs.period).toBe('month')
  })

  it('uses zero for an empty or invalid number input', () => {
    const inputs = getInputs({ ...initialFormValues, costPerClick: '' })

    expect(inputs.costPerClick).toBe(0)
  })
})
