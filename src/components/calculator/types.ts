import type { Period } from '../../lib/calculations'

export type FormValues = Record<NumericField, string> & { period: Period }

export type NumericField =
  | 'targetClients'
  | 'averageRevenuePerClient'
  | 'grossMarginPercent'
  | 'retainedMarginPerClient'
  | 'closingRateOutOfTen'
  | 'landingPageConversionPercent'
  | 'costPerClick'

export type StepNumber = 1 | 2 | 3 | 4
