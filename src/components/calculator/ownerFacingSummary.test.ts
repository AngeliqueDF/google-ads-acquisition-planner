import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { calculateScenario, type CalculatorInputs } from '../../lib/calculations'
import { formatCurrency, formatPercent } from './formatters'
import { InlineStepSummary } from './components/InlineStepSummary'
import { StepSummary } from './components/StepSummary'
import { getOwnerFacingSummaryText } from './ownerFacingSummary'

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

describe('owner-facing step summary', () => {
  it.each([
    ['month', 'par mois'],
    ['quarter', 'par trimestre'],
    ['year', 'par an'],
  ] as const)('explains the goal with the selected frequency: %s', (period, frequency) => {
    const inputs = { ...baseInputs, period }
    const text = getOwnerFacingSummaryText(1, inputs, calculateScenario(inputs))

    expect(text).toBe(
      `Vous visez 10 nouveaux clients ${frequency}. Le chiffre d’affaires moyen est de ${formatCurrency(600)} par client.`,
    )
    expect(text).not.toContain('budget média')
  })

  it('explains how gross margin and retained margin relate without using specialist acronyms', () => {
    const text = getOwnerFacingSummaryText(2, baseInputs, calculateScenario(baseInputs))

    expect(text).toContain(formatCurrency(600))
    expect(text).toContain(formatCurrency(180))
    expect(text).toContain(formatCurrency(120))
    expect(text).toContain(formatCurrency(60))
    expect(text).toContain('peut être consacrée aux annonces')
    expect(text).not.toContain('CAC')
  })

  it('states the gross and retained margins without a verdict when there is no positive amount for ads', () => {
    const inputs = { ...baseInputs, retainedMarginPerClient: 200 }
    const text = getOwnerFacingSummaryText(2, inputs, calculateScenario(inputs))

    expect(text).toContain(formatCurrency(180))
    expect(text).toContain(formatCurrency(200))
    expect(text).not.toContain('peut être consacrée aux annonces')
    expect(text).not.toContain('viable')
  })

  it('explains prospects required from the closing assumption and sales goal', () => {
    const text = getOwnerFacingSummaryText(3, baseInputs, calculateScenario(baseInputs))

    expect(text).toContain(`${formatPercent(20)} des prospects deviennent clients`)
    expect(text).toContain('10 nouveaux clients par mois')
    expect(text).toContain('50 prospects')
    expect(text).not.toContain('CAC')
  })

  it('asks for the closing assumption when required prospects cannot be estimated', () => {
    const inputs = { ...baseInputs, closingRatePercent: 0 }
    const text = getOwnerFacingSummaryText(3, inputs, calculateScenario(inputs))

    expect(text).toContain('prospects sur 10 deviennent clients')
    expect(text).not.toContain('— prospects')
  })

  it('explains the traffic estimate and total media budget for the selected target frequency', () => {
    const text = getOwnerFacingSummaryText(4, baseInputs, calculateScenario(baseInputs))

    expect(text).toContain('10 % des visiteurs prennent contact')
    expect(text).toContain('50 prospects')
    expect(text).toContain('500 clics')
    expect(text).toContain(formatCurrency(2))
    expect(text).toContain(formatCurrency(1000))
    expect(text).toContain('10 nouveaux clients par mois')
    expect(text).not.toContain('CAC')
    expect(text).not.toContain('CPL')
  })

  it('explains that the closing assumption is needed before estimating traffic and budget', () => {
    const inputs = { ...baseInputs, closingRatePercent: 0 }
    const text = getOwnerFacingSummaryText(4, inputs, calculateScenario(inputs))

    expect(text).toContain('indiquez combien de prospects deviennent clients')
    expect(text).not.toContain(formatCurrency(0))
    expect(text).not.toContain('budget média estimé est de')
  })

  it('explains that visitor contacts are needed before estimating clicks and budget', () => {
    const inputs = { ...baseInputs, landingPageConversionPercent: 0 }
    const text = getOwnerFacingSummaryText(4, inputs, calculateScenario(inputs))

    expect(text).toContain('Indiquez quelle part des visiteurs prend contact')
    expect(text).not.toContain(formatCurrency(0))
    expect(text).not.toContain('budget média estimé est de')
  })

  it.each([1, 2, 3, 4] as const)(
    'renders step %s owner-facing text inline but not in the sidebar',
    (step) => {
      const results = calculateScenario(baseInputs)
      const text = getOwnerFacingSummaryText(step, baseInputs, results)
      const props = { step, inputs: baseInputs, results }
      const inlineMarkup = renderToStaticMarkup(createElement(InlineStepSummary, props))
      const sidebarMarkup = renderToStaticMarkup(createElement(StepSummary, props))
      const inlineText = inlineMarkup.replaceAll(/<\/?strong>/g, '')

      expect(inlineText).toContain(text)
      expect(sidebarMarkup).not.toContain(text)
      expect(sidebarMarkup).toContain('result-title')
      expect(sidebarMarkup).toContain('result-metrics')
      expect(sidebarMarkup).toContain(
        ['Clients visés', 'Marge brute par client', 'Prospects requis', 'Budget média estimé'][
          step - 1
        ],
      )
    },
  )

  it.each([
    [1, formatCurrency(600)],
    [2, formatCurrency(60)],
    [3, '50'],
    [4, formatCurrency(1000)],
  ] as const)('emphasizes key step %s information in the inline summary', (step, keyInfo) => {
    const results = calculateScenario(baseInputs)
    const markup = renderToStaticMarkup(
      createElement(InlineStepSummary, { step, inputs: baseInputs, results }),
    )
    const proseMarkup = markup.match(/<p>(.*?)<\/p>/)?.[1] ?? ''

    expect(proseMarkup).toContain(`<strong>${keyInfo}</strong>`)
  })

  it.each([
    [2, { retainedMarginPerClient: 200 }, [formatCurrency(180), formatCurrency(200)]],
    [3, { closingRatePercent: 0 }, ['combien de prospects sur 10 deviennent clients']],
    [4, { closingRatePercent: 0 }, ['combien de prospects deviennent clients']],
    [4, { landingPageConversionPercent: 0 }, ['quelle part des visiteurs prend contact']],
  ] as const)('emphasizes the key information for a step %s fallback', (step, changes, keyInfo) => {
    const inputs = { ...baseInputs, ...changes }
    const results = calculateScenario(inputs)
    const markup = renderToStaticMarkup(createElement(InlineStepSummary, { step, inputs, results }))
    const proseMarkup = markup.match(/<p>(.*?)<\/p>/)?.[1] ?? ''

    for (const phrase of keyInfo) {
      expect(proseMarkup).toContain(`<strong>${phrase}</strong>`)
    }
  })
})
