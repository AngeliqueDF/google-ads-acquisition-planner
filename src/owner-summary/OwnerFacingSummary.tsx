import type { CalculatorInputs, ScenarioResults, StepNumber } from '../calculator/types'
import {
  formatCount,
  formatCurrency,
  formatEstimate,
  formatPercent,
  periodLabels,
} from '../utils/formatters'

type OwnerFacingSummaryProps = {
  step: StepNumber
  inputs: CalculatorInputs
  results: ScenarioResults
}

export function OwnerFacingSummary({ step, inputs, results }: OwnerFacingSummaryProps) {
  const target = formatCount(inputs.targetClients)
  const frequency = periodLabels[inputs.period]

  if (step === 1) {
    return (
      <div className="section-summary" role="group" aria-label="Résumé de l’objectif">
        <p>
          Vous visez{' '}
          <strong>
            {target} nouveaux clients {frequency}
          </strong>
          . Le chiffre d’affaires moyen est de{' '}
          <strong>{formatCurrency(inputs.averageRevenuePerClient)}</strong> par client.
        </p>
      </div>
    )
  }

  if (step === 2) {
    const grossMargin = formatCurrency(results.grossMarginPerClient)
    const retainedMargin = formatCurrency(inputs.retainedMarginPerClient)

    if (results.maximumAcceptableCpa === null) {
      return (
        <div className="section-summary" role="group" aria-label="Résumé de la marge">
          <p>
            La marge brute estimée est de <strong>{grossMargin}</strong> par client. Vous souhaitez
            conserver <strong>{retainedMargin}</strong> par client.
          </p>
        </div>
      )
    }

    return (
      <div className="section-summary" role="group" aria-label="Résumé de la marge">
        <p>
          Sur un chiffre d’affaires moyen de{' '}
          <strong>{formatCurrency(inputs.averageRevenuePerClient)}</strong> par client, environ{' '}
          <strong>{grossMargin}</strong> restent après les coûts directement liés à votre offre.
          Vous souhaitez conserver <strong>{retainedMargin}</strong> par client ; la différence,{' '}
          <strong>{formatCurrency(results.maximumAcceptableCpa)}</strong> par client, représente le
          montant maximal disponible pour le budget média par nouveau client, selon ces hypothèses.
        </p>
      </div>
    )
  }

  if (step === 3) {
    if (results.requiredLeads === null) {
      return (
        <div className="section-summary" role="group" aria-label="Résumé des prospects">
          <p>
            Indiquez <strong>combien de prospects sur 10 deviennent clients</strong> pour estimer le
            nombre de prospects nécessaires.
          </p>
        </div>
      )
    }

    return (
      <div className="section-summary" role="group" aria-label="Résumé des prospects">
        <p>
          Vous estimez que <strong>{formatPercent(inputs.closingRatePercent)}</strong> des prospects
          deviennent clients. Pour obtenir{' '}
          <strong>
            {target} nouveaux clients {frequency}
          </strong>
          , il faudrait environ <strong>{formatEstimate(results.requiredLeads)}</strong> prospects.
        </p>
      </div>
    )
  }

  if (results.requiredLeads === null) {
    return (
      <div className="section-summary" role="group" aria-label="Résumé du trafic et du budget">
        <p>
          Pour estimer les clics et le budget média, indiquez{' '}
          <strong>combien de prospects deviennent clients</strong>.
        </p>
      </div>
    )
  }

  if (results.requiredClicks === null || results.estimatedBudget === null) {
    return (
      <div className="section-summary" role="group" aria-label="Résumé du trafic et du budget">
        <p>
          Indiquez <strong>quelle part des visiteurs prend contact</strong> pour estimer les clics
          et le budget média.
        </p>
      </div>
    )
  }

  return (
    <div className="section-summary" role="group" aria-label="Résumé du trafic et du budget">
      <p>
        Environ <strong>{formatPercent(inputs.landingPageConversionPercent)}</strong> des visiteurs
        prennent contact. Pour obtenir <strong>{formatEstimate(results.requiredLeads)}</strong>{' '}
        prospects et atteindre votre objectif de{' '}
        <strong>
          {target} nouveaux clients {frequency}
        </strong>
        , il faudrait environ <strong>{formatEstimate(results.requiredClicks)}</strong> clics. Avec
        un coût moyen de <strong>{formatCurrency(inputs.costPerClick)}</strong> par clic, le budget
        média estimé est de <strong>{formatCurrency(results.estimatedBudget)}</strong>.
      </p>
    </div>
  )
}
