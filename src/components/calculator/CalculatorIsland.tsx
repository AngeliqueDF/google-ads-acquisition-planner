import { MantineProvider } from '@mantine/core'
import { useState } from 'react'
import { calculateScenario, type Period } from '../../lib/calculations'
import { CalculatorForm } from './components/CalculatorForm'
import { StepSummary } from './components/StepSummary'
import { initialFormValues, getInputs } from './formState'
import { useActiveStep } from './hooks/useActiveStep'
import type { FormValues, NumericField } from './types'

export function CalculatorIsland() {
  const [formValues, setFormValues] = useState(initialFormValues)
  const activeStep = useActiveStep()
  const inputs = getInputs(formValues)
  const results = calculateScenario(inputs)

  const updateNumber = (field: NumericField, value: string | number) => {
    setFormValues((current) => ({ ...current, [field]: String(value) }))
  }

  const updatePeriod = (period: Period) => {
    setFormValues((current) => ({ ...current, period }))
  }

  return (
    <MantineProvider>
      <div className="calculator-layout">
        <CalculatorForm
          formValues={formValues}
          inputs={inputs}
          results={results}
          activeStep={activeStep}
          onNumberChange={updateNumber}
          onPeriodChange={updatePeriod}
        />
        <aside className="result-panel" aria-label="Résumé de votre scénario">
          <StepSummary step={activeStep} inputs={inputs} results={results} />
        </aside>
      </div>
    </MantineProvider>
  )
}
