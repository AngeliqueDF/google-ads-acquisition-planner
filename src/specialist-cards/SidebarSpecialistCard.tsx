import type { CalculatorInputs, ScenarioResults, StepNumber } from '../calculator/types'
import { formatCount, formatCurrency, formatEstimate, periodLabels } from '../utils/formatters'

type StepSummaryProps = {
  step: StepNumber
  inputs: CalculatorInputs
  results: ScenarioResults
}

function Metric({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <p className={className}>
      <strong>{value}</strong>
      <span>{label}</span>
    </p>
  )
}

function SummaryContent({ step, inputs, results }: StepSummaryProps) {
  const target = formatCount(inputs.targetClients)
  const targetClientLabel = inputs.targetClients === 1 ? 'client' : 'clients'
  const targetQualifier = inputs.targetClients === 1 ? 'visé' : 'visés'

  if (step === 1) {
    return (
      <>
        <p className="result-kicker">Étape 01 · Objectif de vente</p>
        <h2 className="result-title">Votre objectif</h2>
        <div className="result-metrics">
          <Metric
            className="result-highlight"
            label={`Chiffre d’affaires total projeté ${periodLabels[inputs.period]}`}
            value={formatCurrency(results.projectedRevenue)}
          />
          <Metric
            label={`${targetClientLabel} ${periodLabels[inputs.period]} ${targetQualifier}`}
            value={target}
          />
          <Metric
            label="Chiffre d’affaires moyen par client"
            value={formatCurrency(inputs.averageRevenuePerClient)}
          />
        </div>
      </>
    )
  }

  if (step === 2) {
    return (
      <>
        <p className="result-kicker">Étape 02 · Valeur et marge</p>
        <h2 className="result-title">Votre marge disponible</h2>
        <div className="result-metrics">
          <Metric
            className="result-highlight"
            label="Montant maximum à consacrer à chaque client"
            value={formatCurrency(results.maximumAcceptableCpa)}
          />
          <Metric
            label={`${targetClientLabel} ${periodLabels[inputs.period]} ${targetQualifier}`}
            value={target}
          />
          <Metric
            label="Marge à conserver par client"
            value={formatCurrency(inputs.retainedMarginPerClient)}
          />
        </div>
      </>
    )
  }

  if (step === 3) {
    return (
      <>
        <p className="result-kicker">Étape 03 · Conversion commerciale</p>
        <h2 className="result-title">Les prospects à convertir</h2>
        <div className="result-metrics">
          <Metric
            className="result-highlight"
            label="Prospects requis"
            value={formatEstimate(results.requiredLeads)}
          />
          <Metric
            label={`${targetClientLabel} ${periodLabels[inputs.period]} ${targetQualifier}`}
            value={target}
          />
          <Metric
            label="Montant maximum à consacrer à chaque client"
            value={formatCurrency(results.maximumAcceptableCpa)}
          />
        </div>
      </>
    )
  }

  return (
    <>
      <p className="result-kicker">Étape 04 · Acquisition Google Ads</p>
      <h2 className="result-title">Trafic et budget estimés</h2>
      <div className="result-metrics">
        <Metric
          className="result-highlight"
          label={`Budget média estimé pour ${target} ${targetClientLabel} ${periodLabels[inputs.period]}`}
          value={formatCurrency(results.estimatedBudget)}
        />
      </div>
      {results.estimatedCpa !== null && (
        <div className="result-comparison">
          <div>
            <strong>{formatCurrency(results.estimatedCpa)}</strong>
            <span>Coût estimé pour obtenir un client</span>
          </div>
          <div>
            <strong>{formatCurrency(results.maximumAcceptableCpa)}</strong>
            <span>Montant maximum à consacrer à chaque client</span>
          </div>
        </div>
      )}
    </>
  )
}

export function SidebarSpecialistCard({ step, inputs, results }: StepSummaryProps) {
  return (
    <div className="result-box" role="group" aria-label={`Résumé de l’étape ${step}`}>
      <SummaryContent step={step} inputs={inputs} results={results} />
    </div>
  )
}
