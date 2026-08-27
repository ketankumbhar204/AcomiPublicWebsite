import type { ListingCopy } from '../../constants/listing';
import { TextAreaField, TextField } from '../form/TextField';
import { PropertyTypeSelect } from './PropertyTypeSelect';
import { DESCRIPTION_MAX } from './registrationForm';
import type { FieldErrors, RegistrationForm } from './registrationForm';

type StepPropertyProps = {
  form: RegistrationForm;
  errors: FieldErrors;
  copy: ListingCopy;
  showTypeSelect: boolean;
  onChange: <K extends keyof RegistrationForm>(key: K, value: RegistrationForm[K]) => void;
};

export function StepProperty({ form, errors, copy, showTypeSelect, onChange }: StepPropertyProps) {
  return (
    <div className="space-y-5">
      {showTypeSelect ? (
        <PropertyTypeSelect
          value={form.propertyType}
          onChange={(value) => onChange('propertyType', value)}
          error={errors.propertyType}
        />
      ) : null}

      <TextField
        id="propertyName"
        label={copy.nameLabel}
        required
        value={form.propertyName}
        onChange={(value) => onChange('propertyName', value)}
        error={errors.propertyName}
        placeholder={copy.namePlaceholder}
        maxLength={150}
        autoComplete="organization"
      />

      <TextField
        id="ownerName"
        label="Owner name"
        required
        value={form.ownerName}
        onChange={(value) => onChange('ownerName', value)}
        error={errors.ownerName}
        placeholder="e.g. Ketan Kumbhar"
        maxLength={120}
        autoComplete="name"
      />

      <TextAreaField
        id="description"
        label="Short description (optional)"
        value={form.description}
        onChange={(value) => onChange('description', value)}
        placeholder={copy.descriptionPlaceholder}
        maxLength={DESCRIPTION_MAX}
      />
    </div>
  );
}
