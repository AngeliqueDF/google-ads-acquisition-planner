import type { Period } from '../calculator/types'

export const periodLabels: Record<Period, string> = {
  month: 'par mois',
  quarter: 'par trimestre',
  year: 'par an',
}

export const periodNames: Record<Period, string> = {
  month: 'Mois',
  quarter: 'Trimestre',
  year: 'Année',
}

const numberFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })
const decimalFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 })
const estimateFormatter = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
const currencyFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatCount(value: number | null): string {
  return value === null ? '—' : numberFormatter.format(value)
}

export function formatPercent(value: number): string {
  return `${decimalFormatter.format(value)} %`
}

export function formatEstimate(value: number | null): string {
  return value === null ? '—' : estimateFormatter.format(value)
}

export function formatOutOfTen(value: number): string {
  const formattedRate = decimalFormatter.format(value / 10)
  return `${formattedRate} sur 10`
}

export function formatCurrency(value: number | null): string {
  return value === null ? '—' : currencyFormatter.format(value)
}
