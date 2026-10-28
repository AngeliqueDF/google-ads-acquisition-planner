import type { CalculatorInputs, Period } from '../calculator/types'
import type { FormValues, NumericField } from './types'

export const initialFormValues: FormValues = {
  targetClients: '10',
  period: 'month',
  averageRevenuePerClient: '600',
  grossMarginPercent: '50',
  retainedMarginPerClient: '120',
  closingRateOutOfTen: '2',
  landingPageConversionPercent: '4',
  costPerClick: '2',
}

function toNumber(value: string): number {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

export function getInputs(values: FormValues): CalculatorInputs {
  return {
    targetClients: toNumber(values.targetClients),
    period: values.period,
    averageRevenuePerClient: toNumber(values.averageRevenuePerClient),
    grossMarginPercent: toNumber(values.grossMarginPercent),
    retainedMarginPerClient: toNumber(values.retainedMarginPerClient),
    closingRatePercent: toNumber(values.closingRateOutOfTen) * 10,
    landingPageConversionPercent: toNumber(values.landingPageConversionPercent),
    costPerClick: toNumber(values.costPerClick),
  }
}

export function updateNumberInput(
  values: FormValues,
  field: NumericField,
  value: string | number,
): FormValues {
  return { ...values, [field]: String(value) }
}

export function updatePeriodInput(values: FormValues, period: Period): FormValues {
  return { ...values, period }
}
