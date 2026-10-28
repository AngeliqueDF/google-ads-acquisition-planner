import type { CalculatorInputs, ScenarioResults, StepNumber } from '../calculator/types'
import {
  formatCount,
  formatCurrency,
  formatEstimate,
  formatOutOfTen,
  formatPercent,
  periodNames,
} from '../utils/formatters'

type InlineSpecialistMetricsProps = {
  step: StepNumber
  inputs: CalculatorInputs
  results: ScenarioResults
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  )
}

export function InlineSpecialistMetrics({ step, inputs, results }: InlineSpecialistMetricsProps) {
  const target = formatCount(inputs.targetClients)

  if (step === 1) {
    return (
      <div
        className="summary-metrics"
        role="group"
        aria-label="Indicateurs spécialistes de l’objectif"
      >
        <Metric label="Clients visés" value={target} />
        <Metric label="Rythme visé" value={periodNames[inputs.period]} />
      </div>
    )
  }

  if (step === 2) {
    return (
      <div
        className="summary-metrics"
        role="group"
        aria-label="Indicateurs spécialistes de la marge"
      >
        <Metric
          label="CA moyen par client"
          value={formatCurrency(inputs.averageRevenuePerClient)}
        />
        <Metric
          label="Marge brute par client"
          value={formatCurrency(results.grossMarginPerClient)}
        />
        <Metric label="Marge à conserver" value={formatCurrency(inputs.retainedMarginPerClient)} />
        <Metric label="CAC max acceptable" value={formatCurrency(results.maximumAcceptableCpa)} />
      </div>
    )
  }

  if (step === 3) {
    return (
      <div
        className="summary-metrics"
        role="group"
        aria-label="Indicateurs spécialistes des prospects"
      >
        <Metric
          label="Prospects qui deviennent clients"
          value={formatOutOfTen(inputs.closingRatePercent)}
        />
        <Metric label="Prospects requis" value={formatEstimate(results.requiredLeads)} />
      </div>
    )
  }

  return (
    <div
      className="summary-metrics"
      role="group"
      aria-label="Indicateurs spécialistes du trafic et du budget"
    >
      <Metric
        label="Conversion de la page"
        value={formatPercent(inputs.landingPageConversionPercent)}
      />
      <Metric label="CPC estimé" value={formatCurrency(inputs.costPerClick)} />
      <Metric label="CPL estimé" value={formatCurrency(results.costPerLead)} />
      <Metric label="Clics requis" value={formatEstimate(results.requiredClicks)} />
      <Metric label="Budget média estimé" value={formatCurrency(results.estimatedBudget)} />
    </div>
  )
}
