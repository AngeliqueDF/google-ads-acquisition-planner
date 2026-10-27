import type { CalculatorInputs, ScenarioResults, StepNumber } from '../calculator/types'
import {
  formatCount,
  formatCurrency,
  formatEstimate,
  formatOutOfTen,
  formatPercent,
  periodNames,
} from '../utils/formatters'

type StepSummaryProps = {
  step: StepNumber
  inputs: CalculatorInputs
  results: ScenarioResults
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <strong>{value}</strong>
      <span>{label}</span>
    </p>
  )
}

function SummaryContent({ step, inputs, results }: StepSummaryProps) {
  const target = formatCount(inputs.targetClients)

  if (step === 1) {
    return (
      <>
        <p className="result-kicker">Étape 01 · Objectif de vente</p>
        <h2 className="result-title">Votre objectif</h2>
        <div className="result-metrics">
          <Metric label="Clients visés" value={target} />
          <Metric label="Période" value={periodNames[inputs.period]} />
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
            label="Chiffre d’affaires moyen par client"
            value={formatCurrency(inputs.averageRevenuePerClient)}
          />
          <Metric
            label="Marge brute par client"
            value={formatCurrency(results.grossMarginPerClient)}
          />
          <Metric
            label="Marge à conserver par client"
            value={formatCurrency(inputs.retainedMarginPerClient)}
          />
          <Metric
            label="CAC maximum acceptable"
            value={formatCurrency(results.maximumAcceptableCpa)}
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
            label="Prospects qui deviennent clients"
            value={formatOutOfTen(inputs.closingRatePercent)}
          />
          <Metric label="Prospects requis" value={formatEstimate(results.requiredLeads)} />
        </div>
      </>
    )
  }

  return (
    <>
      <p className="result-kicker">Étape 04 · Acquisition Google Ads</p>
      <h2 className="result-title">Trafic et budget estimés</h2>
      {results.estimatedCpa !== null && (
        <div className="result-comparison">
          <div>
            <span>CAC estimé</span>
            <strong>{formatCurrency(results.estimatedCpa)}</strong>
          </div>
          <span className="comparison-word">contre</span>
          <div>
            <span>CAC maximum acceptable</span>
            <strong>{formatCurrency(results.maximumAcceptableCpa)}</strong>
          </div>
        </div>
      )}
      <div className="result-metrics">
        <Metric
          label="Taux de conversion de la page"
          value={formatPercent(inputs.landingPageConversionPercent)}
        />
        <Metric label="Coût estimé par clic" value={formatCurrency(inputs.costPerClick)} />
        <Metric label="CPL estimé" value={formatCurrency(results.costPerLead)} />
        <Metric label="Clics requis" value={formatEstimate(results.requiredClicks)} />
        <Metric label="Budget média estimé" value={formatCurrency(results.estimatedBudget)} />
      </div>
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
