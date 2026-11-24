import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, inputClasses } from '../form/Field';
import { TextField } from '../form/TextField';
import type { ListingKind } from '../../constants/listing';
import { getPropertyTypeOption } from '../../constants/propertyRegistration';
import { PRICE_BASIS_OPTIONS, defaultPriceBasis } from '../../lib/priceBasis';
import type { PriceBasis } from '../../api/types';
import { digitsOnly } from '../../lib/indianMobile';
import { AddressLocationField } from './AddressLocationField';
import { AmenityChips } from './AmenityChips';
import type { AmenityAssignment } from '../../lib/amenities';
import type { FieldErrors, RegistrationForm } from './registrationForm';

type StepDetailsProps = {
  form: RegistrationForm;
  errors: FieldErrors;
  kind: ListingKind;
  onChange: <K extends keyof RegistrationForm>(key: K, value: RegistrationForm[K]) => void;
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3.5">
      <h3 className="text-[13px] font-semibold tracking-[0.08em] text-muted uppercase">{title}</h3>
      {children}
    </section>
  );
}

function RupeeField({
  id,
  label,
  value,
  suffix,
  basis,
  onBasisChange,
  error,
  placeholder,
  onChange,
  pricingUnitLabel,
  chooseUnitLabel,
  basisLabel,
}: {
  id: string;
  label: string;
  value: string;
  suffix?: string;
  basis?: PriceBasis;
  onBasisChange?: (value: PriceBasis) => void;
  error?: string;
  placeholder: string;
  onChange: (value: string) => void;
  pricingUnitLabel: string;
  chooseUnitLabel: string;
  basisLabel: (id: PriceBasis, fallback: string) => string;
}) {
  return (
    <Field htmlFor={id} label={label} required error={error}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <div className="relative min-w-0 flex-1">
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[14px] text-muted"
          >
            ₹
          </span>
          <input
            id={id}
            value={value}
            onChange={(event) => onChange(digitsOnly(event.target.value, 10))}
            inputMode="numeric"
            placeholder={placeholder}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : `${id}-basis`}
            className={`${inputClasses(Boolean(error))} pl-7`}
          />
        </div>
        {onBasisChange ? (
          <select
            id={`${id}-basis`}
            aria-label={pricingUnitLabel}
            value={basis ?? ''}
            onChange={(event) => onBasisChange(event.target.value as PriceBasis)}
            className="h-11 shrink-0 rounded-lg border border-border bg-background px-3 text-[12px] font-medium text-text-secondary sm:w-[170px]"
          >
            {!basis ? <option value="">{chooseUnitLabel}</option> : null}
            {PRICE_BASIS_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {basisLabel(option.id, option.label)}
              </option>
            ))}
          </select>
        ) : (
          <span
            id={`${id}-basis`}
            className="flex h-11 items-center rounded-lg bg-background px-3 text-[12px] font-medium whitespace-nowrap text-text-secondary"
          >
            {suffix}
          </span>
        )}
      </div>
    </Field>
  );
}

export function StepDetails({ form, errors, kind, onChange }: StepDetailsProps) {
  const { t } = useTranslation();
  // Step 1 guarantees a type before this step can be reached.
  const option = form.propertyType ? getPropertyTypeOption(form.propertyType) : null;
  const typeKey = form.propertyType ?? 'PG';
  const capacityLabel = option
    ? t(`registration.propertyTypes.${typeKey}.capacityLabel`, { defaultValue: option.capacityLabel })
    : t('registration.fields.capacityFallback');
  const capacityPlaceholder = option
    ? t(`registration.propertyTypes.${typeKey}.capacityPlaceholder`, {
        defaultValue: option.capacityPlaceholder,
      })
    : t('registration.propertyTypes.PG.capacityPlaceholder');
  const basisLabel = (id: PriceBasis, fallback: string) =>
    t(`registration.priceBasis.${id}`, { defaultValue: fallback });

  return (
    <div className="space-y-6">
      <Section title={t('registration.sections.location')}>
        <AddressLocationField form={form} errors={errors} kind={kind} onChange={onChange} />
      </Section>

      <Section title={t('registration.sections.pricing')}>
        <RupeeField
          id="startingPrice"
          label={
            kind === 'mess'
              ? t('registration.fields.monthlyPrice')
              : t('registration.fields.startingPrice')
          }
          value={form.startingPrice}
          basis={form.priceBasis ?? defaultPriceBasis(form.propertyType) ?? undefined}
          onBasisChange={(value) => onChange('priceBasis', value)}
          error={errors.startingPrice}
          placeholder={kind === 'mess' ? '3500' : '6000'}
          onChange={(value) => onChange('startingPrice', value)}
          pricingUnitLabel={t('registration.fields.pricingUnit')}
          chooseUnitLabel={t('registration.fields.chooseUnit')}
          basisLabel={basisLabel}
        />
        {kind === 'mess' ? (
          <RupeeField
            id="mealPrice"
            label={t('registration.fields.perMealTiffin')}
            value={form.mealPrice}
            suffix={t('registration.fields.perMealTiffinSuffix')}
            error={errors.mealPrice}
            placeholder="80"
            onChange={(value) => onChange('mealPrice', value)}
            pricingUnitLabel={t('registration.fields.pricingUnit')}
            chooseUnitLabel={t('registration.fields.chooseUnit')}
            basisLabel={basisLabel}
          />
        ) : null}
      </Section>

      <Section title={t('registration.sections.capacity')}>
        <TextField
          id="capacityEstimate"
          label={`${capacityLabel} ${t('registration.optional')}`}
          value={form.capacityEstimate}
          onChange={(value) => onChange('capacityEstimate', digitsOnly(value, 6))}
          error={errors.capacityEstimate}
          placeholder={capacityPlaceholder}
          inputMode="numeric"
        />
      </Section>

      {option?.supportsAmenities ? (
        <Section title={t('registration.sections.amenities')}>
          <AmenityChips
            selected={form.amenities}
            onChange={(amenities: AmenityAssignment[]) => onChange('amenities', amenities)}
          />
        </Section>
      ) : null}
    </div>
  );
}
