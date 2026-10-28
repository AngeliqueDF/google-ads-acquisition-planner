import type { Period } from '../calculator/types'

export type FormValues = Record<NumericField, string> & { period: Period }

export type NumericField =
  | 'targetClients'
  | 'averageRevenuePerClient'
  | 'grossMarginPercent'
  | 'retainedMarginPerClient'
  | 'closingRateOutOfTen'
  | 'landingPageConversionPercent'
  | 'costPerClick'
