import { MantineProvider } from '@mantine/core'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { calculateScenario, type CalculatorInputs } from '../../../lib/calculations'
import { initialFormValues } from '../formState'
import type { StepNumber } from '../types'
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

describe('mobile specialist summary placement', () => {
  it.each([1, 2, 3, 4] as const)(
    'renders the sidebar card only inside active step %s',
    (activeStep: StepNumber) => {
      const results = calculateScenario(inputs)
      const formMarkup = renderToStaticMarkup(
        createElement(
          MantineProvider,
          null,
          createElement(CalculatorForm, {
            formValues: initialFormValues,
            inputs,
            results,
            activeStep,
            onNumberChange: () => {},
            onPeriodChange: () => {},
          }),
        ),
      )
      const activeSection = formMarkup.match(
        new RegExp(`<section class="step" id="step-${activeStep}"[\\s\\S]*?<\\/section>`),
      )?.[0]

      expect(formMarkup.match(/class="mobile-result-panel"/g)).toHaveLength(1)
      expect(activeSection).toContain('mobile-result-panel')
      expect(activeSection).toContain(`aria-label="Résumé de l’étape ${activeStep}"`)
    },
  )
})
