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

function renderForm(activeStep: StepNumber): string {
  const results = calculateScenario(inputs)
  return renderToStaticMarkup(
    <MantineProvider>
      <CalculatorForm
        formValues={initialFormValues}
        inputs={inputs}
        results={results}
        activeStep={activeStep}
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
  it.each([1, 2, 3, 4] as const)(
    'renders the sidebar card only inside active step %s',
    (activeStep: StepNumber) => {
      const formMarkup = renderForm(activeStep)
      const activeSection = getStepSectionMarkup(formMarkup, activeStep)

      expect(formMarkup.match(mobileResultPanelPattern)).toHaveLength(1)
      expect(activeSection).toContain('mobile-result-panel')
      expect(activeSection).toContain(`aria-label="Résumé de l’étape ${activeStep}"`)
    },
  )
})
