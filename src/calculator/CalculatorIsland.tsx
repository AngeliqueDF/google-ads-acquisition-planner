import { MantineProvider } from '@mantine/core'
import { CalculatorForm } from '../inputs/components/CalculatorForm'
import { useCalculatorInputs } from '../inputs/useCalculatorInputs'
import { SidebarSpecialistCard } from '../specialist-cards/SidebarSpecialistCard'
import { calculateScenario } from './scenarioService'
import { useActiveStep } from './useActiveStep'

export function CalculatorIsland() {
  const { formValues, inputs, updateNumber, updatePeriod } = useCalculatorInputs()
  const activeStep = useActiveStep()
  const results = calculateScenario(inputs)

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
          <SidebarSpecialistCard step={activeStep} inputs={inputs} results={results} />
        </aside>
      </div>
    </MantineProvider>
  )
}
