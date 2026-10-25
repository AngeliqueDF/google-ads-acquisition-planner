import type { CalculatorInputs, ScenarioResults } from '../../../lib/calculations'
import {
  formatCount,
  formatCurrency,
  formatOutOfTen,
  formatPercent,
  periodLabels,
  periodNames,
} from '../formatters'
import type { StepNumber } from '../types'

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
  const period = periodLabels[inputs.period]

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
        <p className="result-reason">
          Après déduction de la marge à conserver, le CAC maximum acceptable est de{' '}
          {formatCurrency(results.maximumAcceptableCpa)} par client.
        </p>
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
        <p className="result-reason">
          {results.requiredLeads === null
            ? 'Indiquez combien de prospects sur 10 deviennent clients pour estimer le nombre de prospects requis.'
            : `Pour obtenir ${target} nouveaux clients ${period}, il faudrait environ ${formatCount(results.requiredLeads)} prospects.`}
        </p>
        <div className="result-metrics">
          <Metric
            label="Prospects qui deviennent clients"
            value={formatOutOfTen(inputs.closingRatePercent)}
          />
          <Metric label="Prospects requis" value={formatCount(results.requiredLeads)} />
        </div>
      </>
    )
  }

  const trafficUnavailable = results.requiredClicks === null || results.estimatedBudget === null

  return (
    <>
      <p className="result-kicker">Étape 04 · Acquisition Google Ads</p>
      <h2 className="result-title">Trafic et budget estimés</h2>
      <p className="result-reason">
        {trafficUnavailable
          ? 'Saisissez des taux de conversion supérieurs à 0 % pour estimer le trafic et le budget.'
          : `Le budget estimé pour ${target} nouveaux clients ${period} est de ${formatCurrency(results.estimatedBudget)}.`}
      </p>
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
        <Metric label="Clics requis" value={formatCount(results.requiredClicks)} />
        <Metric label="Budget média estimé" value={formatCurrency(results.estimatedBudget)} />
      </div>
    </>
  )
}

export function StepSummary({ step, inputs, results }: StepSummaryProps) {
  return (
    <div className="result-box" role="group" aria-label={`Résumé de l’étape ${step}`}>
      <SummaryContent step={step} inputs={inputs} results={results} />
    </div>
  )
}
