import { useTranslation } from 'react-i18next';
import type { ListingKind } from '../../constants/listing';
import { TextAreaField, TextField } from '../form/TextField';
import { PropertyTypeSelect } from './PropertyTypeSelect';
import { DESCRIPTION_MAX } from './registrationForm';
import type { FieldErrors, RegistrationForm } from './registrationForm';

type StepPropertyProps = {
  form: RegistrationForm;
  errors: FieldErrors;
  kind: ListingKind;
  showTypeSelect: boolean;
  ownerRequired?: boolean;
  typeLocked?: boolean;
  onChange: <K extends keyof RegistrationForm>(key: K, value: RegistrationForm[K]) => void;
};

export function StepProperty({
  form,
  errors,
  kind,
  showTypeSelect,
  ownerRequired = true,
  typeLocked = false,
  onChange,
}: StepPropertyProps) {
  const { t } = useTranslation();
  return (
    <div className="space-y-5">
      {showTypeSelect ? (
        <PropertyTypeSelect
          value={form.propertyType}
          onChange={(value) => onChange('propertyType', value)}
          error={errors.propertyType}
          locked={typeLocked}
        />
      ) : null}

      <TextField
        id="propertyName"
        label={t(`registration.${kind}.nameLabel`)}
        required
        value={form.propertyName}
        onChange={(value) => onChange('propertyName', value)}
        error={errors.propertyName}
        placeholder={t(`registration.${kind}.namePlaceholder`)}
        maxLength={150}
        autoComplete="organization"
      />

      <TextField
        id="ownerName"
        label={t('registration.fields.ownerName')}
        required={ownerRequired}
        value={form.ownerName}
        onChange={(value) => onChange('ownerName', value)}
        error={errors.ownerName}
        placeholder={t('registration.fields.ownerNamePlaceholder')}
        maxLength={120}
        autoComplete="name"
      />

      <TextAreaField
        id="description"
        label={t('registration.fields.shortDescription')}
        value={form.description}
        onChange={(value) => onChange('description', value)}
        placeholder={t(`registration.${kind}.descriptionPlaceholder`)}
        maxLength={DESCRIPTION_MAX}
      />
    </div>
  );
}
