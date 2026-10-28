import { useState } from 'react'
import type { Period } from '../calculator/types'
import { getInputs, initialFormValues, updateNumberInput, updatePeriodInput } from './formState'
import type { NumericField } from './types'

export function useCalculatorInputs() {
  const [formValues, setFormValues] = useState(initialFormValues)
  const inputs = getInputs(formValues)

  const updateNumber = (field: NumericField, value: string | number) => {
    setFormValues((currentValues) => updateNumberInput(currentValues, field, value))
  }

  const updatePeriod = (period: Period) => {
    setFormValues((currentValues) => updatePeriodInput(currentValues, period))
  }

  return { formValues, inputs, updateNumber, updatePeriod }
}
