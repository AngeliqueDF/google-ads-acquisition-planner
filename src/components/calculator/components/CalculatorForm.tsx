import { NumberInput, Select } from '@mantine/core'
import type { CalculatorInputs, Period, ScenarioResults } from '../../../lib/calculations'
import { InlineStepSummary } from './InlineStepSummary'
import { Field } from './Field'
import type { FormValues, NumericField, StepNumber } from '../types'

type CalculatorFormProps = {
  formValues: FormValues
  inputs: CalculatorInputs
  results: ScenarioResults
  onNumberChange: (field: NumericField, value: string | number) => void
  onPeriodChange: (period: Period) => void
}

export function CalculatorForm({
  formValues,
  inputs,
  results,
  onNumberChange,
  onPeriodChange,
}: CalculatorFormProps) {
  const mobileSummary = (step: StepNumber) => (
    <InlineStepSummary step={step} inputs={inputs} results={results} />
  )

  return (
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
              Commençons par préciser le nombre de clients visé, la période souhaitée et le chiffre
              d’affaires moyen par client.
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
                onChange={(value) => onNumberChange('targetClients', value)}
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
                  onPeriodChange(value as Period)
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
                onChange={(value) => onNumberChange('averageRevenuePerClient', value)}
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
            <h2 id="step-2-title">Valeur & rentabilité</h2>
            <p>
              Précisons la marge brute et celle que vous souhaitez conserver après l’acquisition.
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
                onChange={(value) => onNumberChange('grossMarginPercent', value)}
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
                onChange={(value) => onNumberChange('retainedMarginPerClient', value)}
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
            <h2 id="step-3-title">Conversion commerciale</h2>
            <p>Parlons de la part de vos prospects qui deviennent des clients.</p>
          </header>
          <div className="fields two-columns">
            <Field
              id="closing-rate"
              label="Taux de closing"
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
                onChange={(value) => onNumberChange('closingRateOutOfTen', value)}
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
            <h2 id="step-4-title">Acquisition Google Ads</h2>
            <p>
              Relions maintenant votre objectif commercial au trafic nécessaire pour l’atteindre.
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
                onChange={(value) => onNumberChange('landingPageConversionPercent', value)}
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
                onChange={(value) => onNumberChange('costPerClick', value)}
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
  )
}
