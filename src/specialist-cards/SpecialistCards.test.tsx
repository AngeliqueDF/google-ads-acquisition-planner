import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { calculateScenario } from '../calculator/scenarioService'
import type { CalculatorInputs, StepNumber } from '../calculator/types'
import { formatCurrency, formatEstimate } from '../utils/formatters'
import { InlineSpecialistMetrics } from './InlineSpecialistMetrics'
import { SidebarSpecialistCard } from './SidebarSpecialistCard'

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

function renderSidebarCard(step: StepNumber, inputs = baseInputs): string {
  const results = calculateScenario(inputs)
  return renderToStaticMarkup(
    <SidebarSpecialistCard step={step} inputs={inputs} results={results} />,
  )
}

function renderInlineMetrics(step: StepNumber): string {
  const results = calculateScenario(baseInputs)
  return renderToStaticMarkup(
    <InlineSpecialistMetrics step={step} inputs={baseInputs} results={results} />,
  )
}

describe('specialist cards', () => {
  it.each([
    [1, 'Votre objectif', 'clients par mois visés'],
    [2, 'Votre marge disponible', 'Montant maximum à consacrer'],
    [3, 'Les prospects à convertir', 'Prospects requis'],
    [4, 'Trafic et budget estimés', 'Budget média estimé'],
  ] as const)('renders the sidebar figures for step %s', (step, title, metric) => {
    const markup = renderSidebarCard(step)

    expect(markup).toContain(title)
    expect(markup).toContain('result-metrics')
    expect(markup).toContain(metric)
  })

  it.each([
    ['month', 'par mois'],
    ['quarter', 'par trimestre'],
    ['year', 'par an'],
  ] as const)(
    'highlights projected revenue and keeps goal details for the %s period',
    (period, periodLabel) => {
      const markup = renderSidebarCard(1, { ...baseInputs, period })
      const featuredValuePosition = markup.indexOf('result-highlight')
      const targetPosition = markup.indexOf(`clients ${periodLabel} visés`)

      expect(featuredValuePosition).toBeGreaterThan(-1)
      expect(featuredValuePosition).toBeLessThan(targetPosition)
      expect(markup).toContain(formatCurrency(6000))
      expect(markup).toContain(`Chiffre d’affaires total projeté ${periodLabel}`)
      expect(markup).toContain(`clients ${periodLabel} visés`)
      expect(markup).toContain('10')
      expect(markup).toContain('Chiffre d’affaires moyen par client')
      expect(markup).toContain(formatCurrency(600))
      expect(markup).not.toContain('Période')
    },
  )

  it('highlights the maximum amount per client and keeps the goal and margin context in step 2', () => {
    const markup = renderSidebarCard(2)

    expect(markup).toContain('result-highlight')
    expect(markup.indexOf('result-highlight')).toBeLessThan(
      markup.indexOf('clients par mois visés'),
    )
    expect(markup).toContain('Montant maximum à consacrer à chaque client')
    expect(markup).toContain(formatCurrency(60))
    expect(markup).toContain('clients par mois visés')
    expect(markup).toContain('Marge à conserver par client')
    expect(markup).toContain(formatCurrency(120))
    expect(markup).not.toContain('Chiffre d’affaires moyen par client')
    expect(markup).not.toContain('Marge brute par client')
  })

  it('uses singular wording when the target is one client', () => {
    const inputs = { ...baseInputs, targetClients: 1 }

    expect(renderSidebarCard(1, inputs)).toContain('client par mois visé')
    expect(renderSidebarCard(3, inputs)).toContain('client par mois visé')
    expect(renderSidebarCard(4, inputs)).toContain('pour 1 client par mois')
  })

  it('connects the required prospects to the client target in step 3', () => {
    const markup = renderSidebarCard(3)
    const prospectsPosition = markup.indexOf('Prospects requis')
    const targetPosition = markup.indexOf('clients par mois visés')
    const maximumPosition = markup.indexOf('Montant maximum à consacrer')

    expect(markup).toContain('result-highlight')
    expect(prospectsPosition).toBeGreaterThan(-1)
    expect(prospectsPosition).toBeLessThan(targetPosition)
    expect(targetPosition).toBeLessThan(maximumPosition)
    expect(markup).toContain(formatEstimate(50))
    expect(markup).toContain('clients par mois visés')
    expect(markup).toContain('10')
    expect(markup).toContain('Montant maximum à consacrer à chaque client')
    expect(markup).toContain(formatCurrency(60))
    expect(markup).not.toContain('Prospects qui deviennent clients')
  })

  it('emphasizes the budget and compares per-client costs in plain language in step 4', () => {
    const markup = renderSidebarCard(4)

    expect(markup).toContain('result-highlight')
    expect(markup).toContain('Budget média estimé pour 10 clients par mois')
    expect(markup).toContain(formatCurrency(1000))
    expect(markup).toContain('Coût estimé pour obtenir un client')
    expect(markup).toContain(formatCurrency(100))
    expect(markup).toContain('Montant maximum à consacrer à chaque client')
    expect(markup).toContain(formatCurrency(60))
    expect(markup).not.toContain('CPC estimé')
    expect(markup).not.toContain('CPL estimé')
    expect(markup).not.toContain('Clics requis')
  })

  it.each([
    [1, 'Clients visés', 'Rythme visé'],
    [2, 'CA moyen par client', 'CAC max acceptable'],
    [3, 'Prospects qui deviennent clients', 'Prospects requis'],
    [4, 'CPL estimé', 'Clics requis'],
  ] as const)(
    'renders inline specialist figures for step %s',
    (step, firstMetric, secondMetric) => {
      const markup = renderInlineMetrics(step)

      expect(markup).toContain(firstMetric)
      expect(markup).toContain(secondMetric)
    },
  )

  it('uses previous-step margin information in the traffic comparison', () => {
    const markup = renderSidebarCard(4)

    expect(markup).toContain('Montant maximum à consacrer à chaque client')
    expect(markup).toContain('60,00')
  })

  it.each([1, 2, 3, 4] as const)('keeps owner-facing narrative out of step %s cards', (step) => {
    const narrative = 'Vous visez 10 nouveaux clients par mois'

    expect(renderSidebarCard(step)).not.toContain(narrative)
    expect(renderInlineMetrics(step)).not.toContain(narrative)
  })
})
