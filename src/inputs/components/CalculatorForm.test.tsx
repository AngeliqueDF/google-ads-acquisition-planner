import { MantineProvider } from '@mantine/core'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { calculateScenario } from '../../calculator/scenarioService'
import type { CalculatorInputs, StepNumber } from '../../calculator/types'
import { initialFormValues } from '../formState'
import { CalculatorForm } from './CalculatorForm'

const inputs: CalculatorInputs = {
  targetClients: 10,
  period: 'month',
  averageRevenuePerClient: 600,
  grossMarginPercent: 30,
  retainedMarginPerClient: 120,
  closingRatePercent: 10,
  landingPageConversionPercent: 5,
  costPerClick: 2.5,
}

const mobileResultPanelPattern = /class="mobile-result-panel"/g

function renderForm(): string {
  const results = calculateScenario(inputs)
  return renderToStaticMarkup(
    <MantineProvider>
      <CalculatorForm
        formValues={initialFormValues}
        inputs={inputs}
        results={results}
        onNumberChange={() => {}}
        onPeriodChange={() => {}}
      />
    </MantineProvider>,
  )
}

function getStepSectionMarkup(formMarkup: string, step: StepNumber): string | undefined {
  const stepSectionPattern = new RegExp(
    `<section class="step" id="step-${step}"[\\s\\S]*?<\\/section>`,
  )
  return formMarkup.match(stepSectionPattern)?.[0]
}

describe('mobile specialist summary placement', () => {
  it.each([1, 2, 3, 4] as const)('renders the card inline in step %s', (step: StepNumber) => {
    const formMarkup = renderForm()
    const stepSection = getStepSectionMarkup(formMarkup, step)

    expect(formMarkup.match(mobileResultPanelPattern)).toHaveLength(4)
    expect(stepSection).toContain('mobile-result-panel')
    expect(stepSection).toContain(`aria-label="Résumé de l’étape ${step}"`)
  })
})
