import type { CalculatorInputs, ScenarioResults } from '../../../lib/calculations'
import {
  formatCount,
  formatCurrency,
  formatEstimate,
  formatOutOfTen,
  formatPercent,
  periodNames,
} from '../formatters'
import { getOwnerFacingSummarySegments } from '../ownerFacingSummary'
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

function OwnerFacingText({ step, inputs, results }: InlineStepSummaryProps) {
  const segments = getOwnerFacingSummarySegments(step, inputs, results)

  return (
    <p>
      {segments.map((segment, index) =>
        segment.emphasis ? <strong key={index}>{segment.text}</strong> : segment.text,
      )}
    </p>
  )
}

export function InlineStepSummary({ step, inputs, results }: InlineStepSummaryProps) {
  const target = formatCount(inputs.targetClients)

  if (step === 1) {
    return (
      <div className="section-summary" role="group" aria-label="Résumé de l’objectif">
        <OwnerFacingText step={step} inputs={inputs} results={results} />
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
        <OwnerFacingText step={step} inputs={inputs} results={results} />
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
        <OwnerFacingText step={step} inputs={inputs} results={results} />
        <div className="summary-metrics">
          <InlineMetric
            label="Prospects qui deviennent clients"
            value={formatOutOfTen(inputs.closingRatePercent)}
          />
          <InlineMetric label="Prospects requis" value={formatEstimate(results.requiredLeads)} />
        </div>
      </div>
    )
  }

  return (
    <div className="section-summary" role="group" aria-label="Résumé du trafic et du budget">
      <OwnerFacingText step={step} inputs={inputs} results={results} />
      <div className="summary-metrics">
        <InlineMetric
          label="Conversion de la page"
          value={formatPercent(inputs.landingPageConversionPercent)}
        />
        <InlineMetric label="CPC estimé" value={formatCurrency(inputs.costPerClick)} />
        <InlineMetric label="CPL estimé" value={formatCurrency(results.costPerLead)} />
        <InlineMetric label="Clics requis" value={formatEstimate(results.requiredClicks)} />
        <InlineMetric label="Budget média estimé" value={formatCurrency(results.estimatedBudget)} />
      </div>
    </div>
  )
}
