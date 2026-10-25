import { MantineProvider, NumberInput, Select } from '@mantine/core'
import { useEffect, useState, type ReactNode } from 'react'
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
  | 'closingRateOutOfTen'
  | 'landingPageConversionPercent'
  | 'costPerClick'
type StepNumber = 1 | 2 | 3 | 4

const initialValues: FormValues = {
  targetClients: '10',
  period: 'month',
  averageRevenuePerClient: '600',
  grossMarginPercent: '30',
  retainedMarginPerClient: '120',
  closingRateOutOfTen: '1',
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

function formatOutOfTen(value: number): string {
  return `${decimalFormatter.format(value / 10)} sur 10`
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
    closingRatePercent: toNumber(values.closingRateOutOfTen) * 10,
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

function Field({
  id,
  label,
  description,
  children,
}: {
  id: string
  label: string
  description: string
  children: ReactNode
}) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <small id={`${id}-description`}>{description}</small>
      {children}
    </div>
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

function InlineMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <strong>{value}</strong>
      <small>{label}</small>
    </div>
  )
}

function InlineStepSummary({
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
      <div className="section-summary" role="group" aria-label="Résumé de l’objectif">
        <p>
          Vous visez l’acquisition de{' '}
          <strong>
            {target} nouveaux clients {period}
          </strong>
          .
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
          : `Avec un taux de conversion de page de ${formatPercent(inputs.landingPageConversionPercent)}, il faudrait environ ${formatCount(results.requiredClicks)} clics. Le budget estimé est de ${formatCurrency(results.estimatedBudget)}${results.estimatedCpa !== null ? `, soit un CAC estimé de ${formatCurrency(results.estimatedCpa)}.` : '.'}`}
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

  const updateNumber = (field: NumericField, value: string | number) => {
    setFormValues((current) => ({ ...current, [field]: String(value) }))
  }

  const mobileSummary = (step: StepNumber) => (
    <InlineStepSummary step={step} inputs={inputs} results={results} />
  )

  return (
    <MantineProvider>
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
                  Commençons par préciser le nombre de clients visé, la période souhaitée et le
                  chiffre d’affaires moyen par client.
                </p>
              </header>
              <div className="fields two-columns">
                <Field
                  id="target-clients"
                  label="Nouveaux clients visés"
                  description="Combien de nouveaux clients souhaitez-vous obtenir ?"
                >
                  <NumberInput
                    id="target-clients"
                    className="field-control"
                    aria-describedby="target-clients-description"
                    size="xl"
                    hideControls
                    clampBehavior="none"
                    value={formValues.targetClients}
                    min={1}
                    step={1}
                    inputMode="numeric"
                    onChange={(value) => updateNumber('targetClients', value)}
                    rightSection={<span className="unit">clients</span>}
                    rightSectionWidth={72}
                    rightSectionPointerEvents="none"
                  />
                </Field>
                <Field
                  id="target-period"
                  label="Période"
                  description="À quel rythme souhaitez-vous atteindre cet objectif ?"
                >
                  <Select
                    id="target-period"
                    className="field-control"
                    aria-describedby="target-period-description"
                    size="xl"
                    allowDeselect={false}
                    value={formValues.period}
                    data={[
                      { value: 'month', label: 'Par mois' },
                      { value: 'quarter', label: 'Par trimestre' },
                      { value: 'year', label: 'Par an' },
                    ]}
                    onChange={(value) => {
                      if (!value) return
                      setFormValues((current) => ({ ...current, period: value as Period }))
                    }}
                  />
                </Field>
                <Field
                  id="average-revenue"
                  label="Chiffre d’affaires moyen par nouveau client"
                  description="Montant moyen facturé ou généré lorsqu’un nouveau client achète."
                >
                  <NumberInput
                    id="average-revenue"
                    className="field-control"
                    aria-describedby="average-revenue-description"
                    size="xl"
                    hideControls
                    clampBehavior="none"
                    value={formValues.averageRevenuePerClient}
                    min={0}
                    inputMode="decimal"
                    onChange={(value) => updateNumber('averageRevenuePerClient', value)}
                    rightSection={<span className="unit">€</span>}
                    rightSectionWidth={48}
                    rightSectionPointerEvents="none"
                  />
                </Field>
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
                <h2 id="step-2-title">Marge à préserver</h2>
                <p>
                  Précisons la marge brute et celle que vous souhaitez conserver après
                  l’acquisition.
                </p>
              </header>
              <div className="fields two-columns">
                <Field
                  id="gross-margin"
                  label="Marge brute"
                  description="Part du chiffre d’affaires qui reste après les coûts directement liés au produit ou à la prestation."
                >
                  <NumberInput
                    id="gross-margin"
                    className="field-control"
                    aria-describedby="gross-margin-description"
                    size="xl"
                    hideControls
                    clampBehavior="none"
                    value={formValues.grossMarginPercent}
                    min={0}
                    max={100}
                    inputMode="decimal"
                    onChange={(value) => updateNumber('grossMarginPercent', value)}
                    rightSection={<span className="unit">%</span>}
                    rightSectionWidth={48}
                    rightSectionPointerEvents="none"
                  />
                </Field>
                <Field
                  id="retained-margin"
                  label="Marge minimale par client"
                  description="Quelle marge souhaitez-vous conserver au minimum après l’acquisition d’un nouveau client ?"
                >
                  <NumberInput
                    id="retained-margin"
                    className="field-control"
                    aria-describedby="retained-margin-description"
                    size="xl"
                    hideControls
                    clampBehavior="none"
                    value={formValues.retainedMarginPerClient}
                    min={0}
                    inputMode="decimal"
                    onChange={(value) => updateNumber('retainedMarginPerClient', value)}
                    rightSection={<span className="unit">€</span>}
                    rightSectionWidth={48}
                    rightSectionPointerEvents="none"
                  />
                </Field>
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
                <p>Parlons de la part de vos prospects qui deviennent des clients.</p>
              </header>
              <div className="fields two-columns">
                <Field
                  id="closing-rate"
                  label="Prospects convertis en clients"
                  description="En moyenne, sur 10 prospects, combien deviennent des clients ?"
                >
                  <NumberInput
                    id="closing-rate"
                    className="field-control"
                    aria-describedby="closing-rate-description"
                    size="xl"
                    hideControls
                    clampBehavior="strict"
                    value={formValues.closingRateOutOfTen}
                    min={0}
                    max={10}
                    step={0.1}
                    inputMode="decimal"
                    onChange={(value) => updateNumber('closingRateOutOfTen', value)}
                    rightSection={<span className="unit">sur 10</span>}
                    rightSectionWidth={64}
                    rightSectionPointerEvents="none"
                  />
                </Field>
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
                  Relions maintenant votre objectif commercial au trafic nécessaire pour
                  l’atteindre.
                </p>
              </header>
              <div className="fields two-columns">
                <Field
                  id="landing-conversion"
                  label="Taux de conversion de la page"
                  description="Sur 100 visiteurs de votre page, combien prennent contact ?"
                >
                  <NumberInput
                    id="landing-conversion"
                    className="field-control"
                    aria-describedby="landing-conversion-description"
                    size="xl"
                    hideControls
                    clampBehavior="none"
                    value={formValues.landingPageConversionPercent}
                    min={0}
                    max={100}
                    inputMode="decimal"
                    onChange={(value) => updateNumber('landingPageConversionPercent', value)}
                    rightSection={<span className="unit">%</span>}
                    rightSectionWidth={48}
                    rightSectionPointerEvents="none"
                  />
                </Field>
                <Field
                  id="cost-per-click"
                  label="Coût estimé par clic"
                  description="Combien pensez-vous payer en moyenne lorsqu’une personne clique sur votre annonce ?"
                >
                  <NumberInput
                    id="cost-per-click"
                    className="field-control"
                    aria-describedby="cost-per-click-description"
                    size="xl"
                    hideControls
                    clampBehavior="none"
                    value={formValues.costPerClick}
                    min={0}
                    step={0.1}
                    inputMode="decimal"
                    onChange={(value) => updateNumber('costPerClick', value)}
                    rightSection={<span className="unit">€</span>}
                    rightSectionWidth={48}
                    rightSectionPointerEvents="none"
                  />
                </Field>
              </div>
              {mobileSummary(4)}
            </div>
          </section>
        </form>

        <aside className="result-panel" aria-label="Résumé de votre scénario">
          <StepSummary step={activeStep} inputs={inputs} results={results} />
        </aside>
      </div>
    </MantineProvider>
  )
}
