import type { CalculatorInputs, ScenarioResults } from '../../lib/calculations'
import { formatCount, formatCurrency, formatPercent, periodLabels } from './formatters'
import type { StepNumber } from './types'

export type OwnerFacingSummarySegment = {
  text: string
  emphasis?: boolean
}

const plain = (text: string): OwnerFacingSummarySegment => ({ text })
const emphasized = (text: string): OwnerFacingSummarySegment => ({ text, emphasis: true })

export function getOwnerFacingSummarySegments(
  step: StepNumber,
  inputs: CalculatorInputs,
  results: ScenarioResults,
): OwnerFacingSummarySegment[] {
  const target = formatCount(inputs.targetClients)
  const frequency = periodLabels[inputs.period]

  if (step === 1) {
    return [
      plain('Vous visez '),
      emphasized(`${target} nouveaux clients ${frequency}`),
      plain('. Le chiffre d’affaires moyen est de '),
      emphasized(formatCurrency(inputs.averageRevenuePerClient)),
      plain(' par client.'),
    ]
  }

  if (step === 2) {
    const grossMargin = formatCurrency(results.grossMarginPerClient)
    const retainedMargin = formatCurrency(inputs.retainedMarginPerClient)

    if (results.maximumAcceptableCpa === null) {
      return [
        plain('La marge brute estimée est de '),
        emphasized(grossMargin),
        plain(' par client. Vous souhaitez conserver '),
        emphasized(retainedMargin),
        plain(' par client.'),
      ]
    }

    return [
      plain('Sur un chiffre d’affaires moyen de '),
      emphasized(formatCurrency(inputs.averageRevenuePerClient)),
      plain(' par client, environ '),
      emphasized(grossMargin),
      plain(' restent après les coûts directement liés à votre offre. Vous souhaitez conserver '),
      emphasized(retainedMargin),
      plain(' par client ; la différence, '),
      emphasized(formatCurrency(results.maximumAcceptableCpa)),
      plain(' par client, peut être consacrée aux annonces.'),
    ]
  }

  if (step === 3) {
    if (results.requiredLeads === null) {
      return [
        plain('Indiquez '),
        emphasized('combien de prospects sur 10 deviennent clients'),
        plain(' pour estimer le nombre de prospects nécessaires.'),
      ]
    }

    return [
      plain('Vous estimez que '),
      emphasized(formatPercent(inputs.closingRatePercent)),
      plain(' des prospects deviennent clients. Pour obtenir '),
      emphasized(`${target} nouveaux clients ${frequency}`),
      plain(', il faudrait environ '),
      emphasized(formatCount(results.requiredLeads)),
      plain(' prospects.'),
    ]
  }

  if (results.requiredLeads === null) {
    return [
      plain('Pour estimer les clics et le budget média, indiquez '),
      emphasized('combien de prospects deviennent clients'),
      plain('.'),
    ]
  }

  if (results.requiredClicks === null || results.estimatedBudget === null) {
    return [
      plain('Indiquez '),
      emphasized('quelle part des visiteurs prend contact'),
      plain(' pour estimer les clics et le budget média.'),
    ]
  }

  return [
    plain('Environ '),
    emphasized(formatPercent(inputs.landingPageConversionPercent)),
    plain(' des visiteurs prennent contact. Pour obtenir '),
    emphasized(formatCount(results.requiredLeads)),
    plain(' prospects et atteindre votre objectif de '),
    emphasized(`${target} nouveaux clients ${frequency}`),
    plain(', il faudrait environ '),
    emphasized(formatCount(results.requiredClicks)),
    plain(' clics. Avec un coût moyen de '),
    emphasized(formatCurrency(inputs.costPerClick)),
    plain(' par clic, le budget média estimé est de '),
    emphasized(formatCurrency(results.estimatedBudget)),
    plain('.'),
  ]
}

export function getOwnerFacingSummaryText(
  step: StepNumber,
  inputs: CalculatorInputs,
  results: ScenarioResults,
): string {
  return getOwnerFacingSummarySegments(step, inputs, results)
    .map((segment) => segment.text)
    .join('')
}
