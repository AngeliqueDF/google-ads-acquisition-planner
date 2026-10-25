import type { CalculatorInputs } from '../../lib/calculations'
import type { FormValues } from './types'

export const initialFormValues: FormValues = {
  targetClients: '10',
  period: 'month',
  averageRevenuePerClient: '600',
  grossMarginPercent: '30',
  retainedMarginPerClient: '120',
  closingRateOutOfTen: '1',
  landingPageConversionPercent: '5',
  costPerClick: '2.5',
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
