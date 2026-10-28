import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { calculateScenario } from '../calculator/scenarioService'
import type { CalculatorInputs, StepNumber } from '../calculator/types'
import { formatCurrency, formatEstimate, formatPercent } from '../utils/formatters'
import { OwnerFacingSummary } from './OwnerFacingSummary'

const htmlTagPattern = /<[^>]+>/g

const baseInputs: CalculatorInputs = {
  targetClients: 10,
  period: 'month',
  averageRevenuePerClient: 600,
  grossMarginPercent: 30,
  retainedMarginPerClient: 120,
  closingRatePercent: 20,
  landingPageConversionPercent: 10,
  costPerClick: 2,
}

function renderSummary(step: StepNumber, inputs = baseInputs): string {
  const results = calculateScenario(inputs)
  return renderToStaticMarkup(<OwnerFacingSummary step={step} inputs={inputs} results={results} />)
}

function getSummaryText(markup: string): string {
  return markup.replaceAll(htmlTagPattern, '')
}

describe('owner-facing summary', () => {
  it.each([
    ['month', 'par mois'],
    ['quarter', 'par trimestre'],
    ['year', 'par an'],
  ] as const)('explains the goal with the selected cadence: %s', (period, frequency) => {
    const inputs = { ...baseInputs, period }
    const text = getSummaryText(renderSummary(1, inputs))

    expect(text).toBe(
      `Vous visez 10 nouveaux clients ${frequency}. Le chiffre d’affaires moyen est de ${formatCurrency(600)} par client.`,
    )
    expect(text).not.toContain('budget média')
  })

  it('explains how gross margin and retained margin relate without a verdict', () => {
    const text = getSummaryText(renderSummary(2))

    expect(text).toContain(formatCurrency(600))
    expect(text).toContain(formatCurrency(180))
    expect(text).toContain(formatCurrency(120))
    expect(text).toContain(formatCurrency(60))
    expect(text).toContain(
      'représente le montant maximal disponible pour le budget média par nouveau client, selon ces hypothèses',
    )
    expect(text).not.toContain('peut être consacrée aux annonces')
    expect(text).not.toContain('CAC')
  })

  it('explains gross and retained margins when acquisition cost is unavailable', () => {
    const inputs = { ...baseInputs, retainedMarginPerClient: 200 }
    const text = getSummaryText(renderSummary(2, inputs))

    expect(text).toContain(formatCurrency(180))
    expect(text).toContain(formatCurrency(200))
    expect(text).not.toContain('peut être consacrée aux annonces')
    expect(text).not.toContain('viable')
  })

  it('explains required prospects from the closing assumption and sales goal', () => {
    const text = getSummaryText(renderSummary(3))

    expect(text).toContain(`${formatPercent(20)} des prospects deviennent clients`)
    expect(text).toContain('10 nouveaux clients par mois')
    expect(text).toContain(`${formatEstimate(50)} prospects`)
    expect(text).not.toContain('CAC')
  })

  it('asks for the closing assumption when prospects cannot be estimated', () => {
    const inputs = { ...baseInputs, closingRatePercent: 0 }
    const text = getSummaryText(renderSummary(3, inputs))

    expect(text).toContain('prospects sur 10 deviennent clients')
    expect(text).not.toContain('— prospects')
  })

  it('explains the traffic estimate and media budget', () => {
    const text = getSummaryText(renderSummary(4))

    expect(text).toContain('10 % des visiteurs prennent contact')
    expect(text).toContain(`${formatEstimate(50)} prospects`)
    expect(text).toContain(`${formatEstimate(500)} clics`)
    expect(text).toContain(formatCurrency(2))
    expect(text).toContain(formatCurrency(1000))
    expect(text).toContain('10 nouveaux clients par mois')
    expect(text).not.toContain('CAC')
    expect(text).not.toContain('CPL')
  })

  it('asks for the closing assumption before estimating traffic and budget', () => {
    const inputs = { ...baseInputs, closingRatePercent: 0 }
    const text = getSummaryText(renderSummary(4, inputs))

    expect(text).toContain('indiquez combien de prospects deviennent clients')
    expect(text).not.toContain(formatCurrency(0))
    expect(text).not.toContain('budget média estimé est de')
  })

  it('asks for the page conversion assumption before estimating clicks and budget', () => {
    const inputs = { ...baseInputs, landingPageConversionPercent: 0 }
    const text = getSummaryText(renderSummary(4, inputs))

    expect(text).toContain('Indiquez quelle part des visiteurs prend contact')
    expect(text).not.toContain(formatCurrency(0))
    expect(text).not.toContain('budget média estimé est de')
  })

  it.each([
    [1, formatCurrency(600)],
    [2, formatCurrency(60)],
    [3, formatEstimate(50)],
    [4, formatCurrency(1000)],
  ] as const)('emphasizes key information for step %s in JSX', (step, keyInfo) => {
    const markup = renderSummary(step)

    expect(markup).toContain(`<strong>${keyInfo}</strong>`)
  })

  it.each([
    [2, { retainedMarginPerClient: 200 }, [formatCurrency(180), formatCurrency(200)]],
    [3, { closingRatePercent: 0 }, ['combien de prospects sur 10 deviennent clients']],
    [4, { closingRatePercent: 0 }, ['combien de prospects deviennent clients']],
    [4, { landingPageConversionPercent: 0 }, ['quelle part des visiteurs prend contact']],
  ] as const)('emphasizes key information in the step %s fallback', (step, changes, phrases) => {
    const inputs = { ...baseInputs, ...changes }
    const markup = renderSummary(step, inputs)

    for (const phrase of phrases) {
      expect(markup).toContain(`<strong>${phrase}</strong>`)
    }
  })
})
