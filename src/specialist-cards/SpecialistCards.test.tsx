import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { calculateScenario } from '../calculator/scenarioService'
import type { CalculatorInputs, StepNumber } from '../calculator/types'
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

function renderSidebarCard(step: StepNumber): string {
  const results = calculateScenario(baseInputs)
  return renderToStaticMarkup(
    <SidebarSpecialistCard step={step} inputs={baseInputs} results={results} />,
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
    [1, 'Votre objectif', 'Clients visés'],
    [2, 'Votre marge disponible', 'Marge brute par client'],
    [3, 'Les prospects à convertir', 'Prospects requis'],
    [4, 'Trafic et budget estimés', 'Budget média estimé'],
  ] as const)('renders the sidebar figures for step %s', (step, title, metric) => {
    const markup = renderSidebarCard(step)

    expect(markup).toContain(title)
    expect(markup).toContain('result-metrics')
    expect(markup).toContain(metric)
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

    expect(markup).toContain('CAC maximum acceptable')
    expect(markup).toContain('60,00')
  })

  it.each([1, 2, 3, 4] as const)('keeps owner-facing narrative out of step %s cards', (step) => {
    const narrative = 'Vous visez 10 nouveaux clients par mois'

    expect(renderSidebarCard(step)).not.toContain(narrative)
    expect(renderInlineMetrics(step)).not.toContain(narrative)
  })
})
