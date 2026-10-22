import { useEffect, useState, type ChangeEvent } from 'react'
import {
  calculateScenario,
  type CalculatorInputs,
  type Period,
  type ScenarioResults,
} from '../../lib/calculations'

type FormValues = Record<NumericField, string> & { period: Period }
type NumericField =
  | 'targetClients'
  | 'averageRevenuePerClient'
  | 'grossMarginPercent'
  | 'retainedMarginPerClient'
  | 'closingRatePercent'
  | 'landingPageConversionPercent'
  | 'costPerClick'
type StepNumber = 1 | 2 | 3 | 4

const initialValues: FormValues = {
  targetClients: '10',
  period: 'month',
  averageRevenuePerClient: '600',
  grossMarginPercent: '30',
  retainedMarginPerClient: '120',
  closingRatePercent: '10',
  landingPageConversionPercent: '5',
  costPerClick: '2.5',
}

const periodLabels: Record<Period, string> = {
  month: 'par mois',
  quarter: 'par trimestre',
  year: 'par an',
}

const periodNames: Record<Period, string> = {
  month: 'Mois',
  quarter: 'Trimestre',
  year: 'Année',
}

const numberFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })
const decimalFormatter = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 })
const currencyFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

function toNumber(value: string): number {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function formatCount(value: number | null): string {
  return value === null ? '—' : numberFormatter.format(value)
}

function formatPercent(value: number): string {
  return `${decimalFormatter.format(value)} %`
}

function formatCurrency(value: number | null): string {
  return value === null ? '—' : currencyFormatter.format(value)
}

function getInputs(values: FormValues): CalculatorInputs {
  return {
    targetClients: toNumber(values.targetClients),
    period: values.period,
    averageRevenuePerClient: toNumber(values.averageRevenuePerClient),
    grossMarginPercent: toNumber(values.grossMarginPercent),
    retainedMarginPerClient: toNumber(values.retainedMarginPerClient),
    closingRatePercent: toNumber(values.closingRatePercent),
    landingPageConversionPercent: toNumber(values.landingPageConversionPercent),
    costPerClick: toNumber(values.costPerClick),
  }
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <p>
      <strong>{value}</strong>
      <span>{label}</span>
    </p>
  )
}

function SummaryContent({
  step,
  inputs,
  results,
}: {
  step: StepNumber
  inputs: CalculatorInputs
  results: ScenarioResults
}) {
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
          {results.hasAcquisitionMargin
            ? `Après la marge à conserver, vous pouvez consacrer jusqu’à ${formatCurrency(results.maximumAcceptableCpa)} à l’acquisition d’un client.`
            : 'Votre marge brute ne couvre pas la marge que vous souhaitez conserver. Aucune marge n’est disponible pour l’acquisition.'}
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
            label="CPA maximum acceptable"
            value={
              results.hasAcquisitionMargin
                ? formatCurrency(results.maximumAcceptableCpa)
                : 'Aucune marge'
            }
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
            ? 'Saisissez un taux de conversion supérieur à 0 % pour estimer le nombre de prospects requis.'
            : `Pour obtenir ${target} nouveaux clients ${period}, il faudrait environ ${formatCount(results.requiredLeads)} prospects.`}
        </p>
        <div className="result-metrics">
          <Metric
            label="Taux de conversion des prospects"
            value={formatPercent(inputs.closingRatePercent)}
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
            <span>CPA estimé</span>
            <strong>{formatCurrency(results.estimatedCpa)}</strong>
          </div>
          <span className="comparison-word">contre</span>
          <div>
            <span>CPA maximum acceptable</span>
            <strong>{formatCurrency(results.maximumAcceptableCpa)}</strong>
          </div>
        </div>
      )}
      {!results.hasAcquisitionMargin && (
        <p className="summary-note">Aucune marge n’est disponible pour financer l’acquisition.</p>
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

function StepSummary({
  step,
  inputs,
  results,
  className = '',
}: {
  step: StepNumber
  inputs: CalculatorInputs
  results: ScenarioResults
  className?: string
}) {
  return (
    <div
      className={`result-box ${className}`.trim()}
      role="group"
      aria-label={`Résumé de l’étape ${step}`}
    >
      <SummaryContent step={step} inputs={inputs} results={results} />
    </div>
  )
}

export function CalculatorIsland() {
  const [formValues, setFormValues] = useState(initialValues)
  const [activeStep, setActiveStep] = useState<StepNumber>(1)
  const inputs = getInputs(formValues)
  const results = calculateScenario(inputs)

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>('.calculator .step[data-step]'),
    )
    let frame = 0

    const updateActiveStep = () => {
      const header = document.querySelector<HTMLElement>('.site-header')
      const headerBottom = header?.getBoundingClientRect().bottom ?? 0
      const focusY = headerBottom + (window.innerHeight - headerBottom) * 0.35
      const focusedSection = sections.find((section) => {
        const { top, bottom } = section.getBoundingClientRect()
        return top <= focusY && bottom > focusY
      })
      const nearestSection =
        focusedSection ??
        sections.reduce<HTMLElement | null>((nearest, section) => {
          if (!nearest) return section
          const distance = (element: HTMLElement) => {
            const { top, bottom } = element.getBoundingClientRect()
            return focusY < top ? top - focusY : focusY > bottom ? focusY - bottom : 0
          }
          return distance(section) < distance(nearest) ? section : nearest
        }, null)
      const step = Number(nearestSection?.dataset.step)

      if (step >= 1 && step <= 4) setActiveStep(step as StepNumber)
    }

    const scheduleUpdate = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateActiveStep)
    }

    updateActiveStep()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  const updateNumber = (field: NumericField, event: ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value
    setFormValues((current) => ({ ...current, [field]: value }))
  }

  const mobileSummary = (step: StepNumber) => (
    <StepSummary step={step} inputs={inputs} results={results} className="mobile-step-summary" />
  )

  return (
    <div className="calculator-layout">
      <form
        className="calculator"
        aria-label="Hypothèses de votre scénario Google Ads"
        onSubmit={(event) => event.preventDefault()}
      >
        <section className="step" id="step-1" data-step="1" aria-labelledby="step-1-title">
          <span className="step-number" aria-hidden="true">
            01
          </span>
          <div className="step-content">
            <header className="step-heading">
              <h2 id="step-1-title">Votre objectif de vente</h2>
              <p>
                Commençons par préciser le volume de clients que vous visez et le rythme souhaité.
              </p>
            </header>
            <div className="fields two-columns">
              <label className="field" htmlFor="target-clients">
                <span>Nouveaux clients visés</span>
                <small>Combien de nouveaux clients souhaitez-vous obtenir ?</small>
                <span className="input-shell">
                  <input
                    id="target-clients"
                    type="number"
                    value={formValues.targetClients}
                    min="1"
                    step="1"
                    inputMode="numeric"
                    onChange={(event) => updateNumber('targetClients', event)}
                  />
                  <span className="unit">clients</span>
                </span>
              </label>
              <label className="field" htmlFor="target-period">
                <span>Période</span>
                <small>À quel rythme souhaitez-vous atteindre cet objectif ?</small>
                <select
                  id="target-period"
                  value={formValues.period}
                  onChange={(event) => {
                    const period = event.currentTarget.value as Period
                    setFormValues((current) => ({ ...current, period }))
                  }}
                >
                  <option value="month">Par mois</option>
                  <option value="quarter">Par trimestre</option>
                  <option value="year">Par an</option>
                </select>
              </label>
            </div>
            {mobileSummary(1)}
          </div>
        </section>

        <section className="step" id="step-2" data-step="2" aria-labelledby="step-2-title">
          <span className="step-number" aria-hidden="true">
            02
          </span>
          <div className="step-content">
            <header className="step-heading">
              <h2 id="step-2-title">Valeur client et marge à préserver</h2>
              <p>
                Établissons ce qu’un client rapporte à votre entreprise et la marge que vous
                souhaitez conserver après l’acquisition.
              </p>
            </header>
            <div className="fields two-columns">
              <label className="field" htmlFor="average-revenue">
                <span>Chiffre d’affaires moyen par nouveau client</span>
                <small>Montant moyen facturé ou généré lorsqu’un nouveau client achète.</small>
                <span className="input-shell">
                  <input
                    id="average-revenue"
                    type="number"
                    value={formValues.averageRevenuePerClient}
                    min="0"
                    inputMode="decimal"
                    onChange={(event) => updateNumber('averageRevenuePerClient', event)}
                  />
                  <span className="unit">€</span>
                </span>
              </label>
              <label className="field" htmlFor="gross-margin">
                <span>Marge moyenne</span>
                <small>
                  Part du chiffre d’affaires qui reste après les coûts directement liés au produit
                  ou à la prestation.
                </small>
                <span className="input-shell">
                  <input
                    id="gross-margin"
                    type="number"
                    value={formValues.grossMarginPercent}
                    min="0"
                    max="100"
                    inputMode="decimal"
                    onChange={(event) => updateNumber('grossMarginPercent', event)}
                  />
                  <span className="unit">%</span>
                </span>
              </label>
              <label className="field field-wide" htmlFor="retained-margin">
                <span>Marge minimale par client</span>
                <small>
                  Quelle marge souhaitez-vous conserver au minimum après l’acquisition d’un nouveau
                  client ?
                </small>
                <span className="input-shell">
                  <input
                    id="retained-margin"
                    type="number"
                    value={formValues.retainedMarginPerClient}
                    min="0"
                    inputMode="decimal"
                    onChange={(event) => updateNumber('retainedMarginPerClient', event)}
                  />
                  <span className="unit">€</span>
                </span>
              </label>
            </div>
            {mobileSummary(2)}
          </div>
        </section>

        <section className="step" id="step-3" data-step="3" aria-labelledby="step-3-title">
          <span className="step-number" aria-hidden="true">
            03
          </span>
          <div className="step-content">
            <header className="step-heading">
              <h2 id="step-3-title">De la demande au client</h2>
              <p>
                Toutes les personnes réellement intéressées ne deviennent pas clientes. Prenons
                cette réalité en compte.
              </p>
            </header>
            <div className="fields">
              <label className="field" htmlFor="closing-rate">
                <span>Taux de conversion des prospects en clients</span>
                <small>
                  Sur 10 personnes réellement intéressées, combien deviennent clientes ?
                </small>
                <span className="input-shell">
                  <input
                    id="closing-rate"
                    type="number"
                    value={formValues.closingRatePercent}
                    min="0"
                    max="100"
                    inputMode="decimal"
                    onChange={(event) => updateNumber('closingRatePercent', event)}
                  />
                  <span className="unit">%</span>
                </span>
              </label>
            </div>
            {mobileSummary(3)}
          </div>
        </section>

        <section className="step" id="step-4" data-step="4" aria-labelledby="step-4-title">
          <span className="step-number" aria-hidden="true">
            04
          </span>
          <div className="step-content">
            <header className="step-heading">
              <h2 id="step-4-title">Google Ads</h2>
              <p>
                Relions maintenant votre objectif commercial au trafic nécessaire pour l’atteindre.
              </p>
            </header>
            <div className="fields two-columns">
              <label className="field" htmlFor="landing-conversion">
                <span>Taux de conversion de la page</span>
                <small>Sur 100 visiteurs de votre page, combien prennent contact ?</small>
                <span className="input-shell">
                  <input
                    id="landing-conversion"
                    type="number"
                    value={formValues.landingPageConversionPercent}
                    min="0"
                    max="100"
                    inputMode="decimal"
                    onChange={(event) => updateNumber('landingPageConversionPercent', event)}
                  />
                  <span className="unit">%</span>
                </span>
              </label>
              <label className="field" htmlFor="cost-per-click">
                <span>Coût estimé par clic</span>
                <small>
                  Combien pensez-vous payer en moyenne lorsqu’une personne clique sur votre annonce
                  ?
                </small>
                <span className="input-shell">
                  <input
                    id="cost-per-click"
                    type="number"
                    value={formValues.costPerClick}
                    min="0"
                    step="0.1"
                    inputMode="decimal"
                    onChange={(event) => updateNumber('costPerClick', event)}
                  />
                  <span className="unit">€</span>
                </span>
              </label>
            </div>
            <button className="helper-link" type="button">
              <span aria-hidden="true">?</span> Je ne connais pas ce chiffre
            </button>
            {mobileSummary(4)}
          </div>
        </section>
      </form>

      <aside className="result-panel" aria-label="Résumé de votre scénario">
        <StepSummary step={activeStep} inputs={inputs} results={results} />
      </aside>
    </div>
  )
}
