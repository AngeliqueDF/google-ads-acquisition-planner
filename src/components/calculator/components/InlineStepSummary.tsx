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

type InlineStepSummaryProps = {
  step: StepNumber
  inputs: CalculatorInputs
  results: ScenarioResults
}

function InlineMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  )
}

export function InlineStepSummary({ step, inputs, results }: InlineStepSummaryProps) {
  const target = formatCount(inputs.targetClients)
  const period = periodLabels[inputs.period]

  if (step === 1) {
    return (
      <div className="section-summary" role="group" aria-label="Résumé de l’objectif">
        <p>
          Vous visez{' '}
          <strong>
            {target} nouveaux clients {period}
          </strong>
          , avec un chiffre d’affaires moyen de {formatCurrency(inputs.averageRevenuePerClient)} par
          client.
        </p>
        <div className="summary-metrics">
          <InlineMetric label="Clients visés" value={target} />
          <InlineMetric label="Rythme visé" value={periodNames[inputs.period]} />
        </div>
      </div>
    )
  }

  if (step === 2) {
    return (
      <div className="section-summary" role="group" aria-label="Résumé de la marge">
        <p>
          La marge brute estimée est de{' '}
          <strong>{formatCurrency(results.grossMarginPerClient)} par client</strong>. Après
          déduction de la marge à conserver, le CAC maximum acceptable est de{' '}
          <strong>{formatCurrency(results.maximumAcceptableCpa)} par client</strong>.
        </p>
        <div className="summary-metrics">
          <InlineMetric
            label="CA moyen par client"
            value={formatCurrency(inputs.averageRevenuePerClient)}
          />
          <InlineMetric
            label="Marge brute par client"
            value={formatCurrency(results.grossMarginPerClient)}
          />
          <InlineMetric
            label="Marge à conserver"
            value={formatCurrency(inputs.retainedMarginPerClient)}
          />
          <InlineMetric
            label="CAC max acceptable"
            value={formatCurrency(results.maximumAcceptableCpa)}
          />
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="section-summary" role="group" aria-label="Résumé des prospects">
        <p>
          {results.requiredLeads === null
            ? 'Indiquez combien de prospects sur 10 deviennent clients pour estimer le nombre de prospects requis.'
            : `Pour obtenir ${target} nouveaux clients ${period}, il faudrait environ ${formatCount(results.requiredLeads)} prospects.`}
        </p>
        <div className="summary-metrics">
          <InlineMetric
            label="Prospects qui deviennent clients"
            value={formatOutOfTen(inputs.closingRatePercent)}
          />
          <InlineMetric label="Prospects requis" value={formatCount(results.requiredLeads)} />
        </div>
      </div>
    )
  }

  const trafficUnavailable = results.requiredClicks === null || results.estimatedBudget === null

  return (
    <div className="section-summary" role="group" aria-label="Résumé du trafic et du budget">
      <p>
        {trafficUnavailable
          ? 'Saisissez des taux de conversion supérieurs à 0 % pour estimer le trafic et le budget.'
          : `Avec un taux de conversion de page de ${formatPercent(inputs.landingPageConversionPercent)}, il faudrait environ ${formatCount(results.requiredClicks)} clics (soit ${formatCurrency(results.estimatedBudget)} de budget) pour générer ${formatCount(results.requiredLeads)} prospects${results.estimatedCpa !== null ? `. Après application de votre taux de closing, cela représente un CAC de ${formatCurrency(results.estimatedCpa)}.` : '.'}`}
      </p>
      <div className="summary-metrics">
        <InlineMetric
          label="Conversion de la page"
          value={formatPercent(inputs.landingPageConversionPercent)}
        />
        <InlineMetric label="CPC estimé" value={formatCurrency(inputs.costPerClick)} />
        <InlineMetric label="CPL estimé" value={formatCurrency(results.costPerLead)} />
        <InlineMetric label="Clics requis" value={formatCount(results.requiredClicks)} />
        <InlineMetric label="Budget média estimé" value={formatCurrency(results.estimatedBudget)} />
      </div>
    </div>
  )
}
