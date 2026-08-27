import type { ReactNode } from 'react';
import { Field, inputClasses } from '../form/Field';
import { TextField } from '../form/TextField';
import type { ListingKind } from '../../constants/listing';
import { getPropertyTypeOption } from '../../constants/propertyRegistration';
import { digitsOnly } from '../../lib/indianMobile';
import { AmenityChips } from './AmenityChips';
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
  error,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  suffix: string;
  error?: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <Field htmlFor={id} label={label} required error={error}>
      <div className="flex items-stretch gap-2">
        <div className="relative flex-1">
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
        <span
          id={`${id}-basis`}
          className="flex items-center rounded-lg bg-background px-3 text-[12px] font-medium whitespace-nowrap text-text-secondary"
        >
          {suffix}
        </span>
      </div>
    </Field>
  );
}

export function StepDetails({ form, errors, kind, onChange }: StepDetailsProps) {
  // Step 1 guarantees a type before this step can be reached.
  const option = form.propertyType ? getPropertyTypeOption(form.propertyType) : null;

  function toggleAmenity(code: string) {
    const next = form.amenities.includes(code)
      ? form.amenities.filter((item) => item !== code)
      : [...form.amenities, code];
    onChange('amenities', next);
  }

  return (
    <div className="space-y-6">
      <Section title="Location">
        <TextField
          id="addressLine"
          label="Address"
          required
          value={form.addressLine}
          onChange={(value) => onChange('addressLine', value)}
          error={errors.addressLine}
          placeholder="e.g. Flat No. 101, ABC Building, Baner Road"
          maxLength={255}
          autoComplete="street-address"
        />
        <div className="grid grid-cols-2 gap-3">
          <TextField
            id="city"
            label="City"
            required
            value={form.city}
            onChange={(value) => onChange('city', value)}
            error={errors.city}
            placeholder="e.g. Pune"
            maxLength={80}
            autoComplete="address-level2"
          />
          <TextField
            id="state"
            label="State"
            required
            value={form.state}
            onChange={(value) => onChange('state', value)}
            error={errors.state}
            placeholder="e.g. Maharashtra"
            maxLength={80}
            autoComplete="address-level1"
          />
        </div>
        <TextField
          id="pincode"
          label="Pincode"
          required
          value={form.pincode}
          onChange={(value) => onChange('pincode', digitsOnly(value, 6))}
          error={errors.pincode}
          placeholder="e.g. 411045"
          inputMode="numeric"
          autoComplete="postal-code"
        />
        <TextField
          id="mapUrl"
          label="Google Maps link (optional)"
          value={form.mapUrl}
          onChange={(value) => onChange('mapUrl', value)}
          error={errors.mapUrl}
          placeholder="Paste a Google Maps link"
          inputMode="url"
        />
      </Section>

      <Section title="Pricing">
        <RupeeField
          id="startingPrice"
          label={kind === 'mess' ? 'Monthly price' : 'Starting price'}
          value={form.startingPrice}
          suffix={kind === 'mess' ? 'per month' : (option?.priceSuffix ?? 'per month')}
          error={errors.startingPrice}
          placeholder={kind === 'mess' ? '3500' : '6000'}
          onChange={(value) => onChange('startingPrice', value)}
        />
        {kind === 'mess' ? (
          <RupeeField
            id="mealPrice"
            label="Per meal / tiffin"
            value={form.mealPrice}
            suffix="per meal / tiffin"
            error={errors.mealPrice}
            placeholder="80"
            onChange={(value) => onChange('mealPrice', value)}
          />
        ) : null}
      </Section>

      <Section title="Capacity">
        <TextField
          id="capacityEstimate"
          label={`${option?.capacityLabel ?? 'Capacity'} (optional)`}
          value={form.capacityEstimate}
          onChange={(value) => onChange('capacityEstimate', digitsOnly(value, 6))}
          error={errors.capacityEstimate}
          placeholder={option?.capacityPlaceholder ?? 'e.g. 24'}
          inputMode="numeric"
        />
      </Section>

      {option?.supportsAmenities ? (
        <Section title="Amenities">
          <AmenityChips selected={form.amenities} onToggle={toggleAmenity} />
        </Section>
      ) : null}
    </div>
  );
}
