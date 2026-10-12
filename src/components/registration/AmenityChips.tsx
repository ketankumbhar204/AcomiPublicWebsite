import { useState } from 'react';
import { X } from 'lucide-react';
import { inputClasses } from '../form/Field';
import {
  AMENITY_ICONS,
  PRESET_AMENITY_CODES,
  PRESET_AMENITY_LABELS,
  addCustomAmenity,
  amenityKey,
  removeCustomAmenity,
  togglePresetAmenity,
  type AmenityAssignment,
  type CustomAmenityError,
} from '../../lib/amenities';

type AmenityChipsProps = {
  selected: AmenityAssignment[];
  onChange: (next: AmenityAssignment[]) => void;
};

const CUSTOM_ERRORS: Record<CustomAmenityError, string> = {
  required: 'Enter a name for the custom amenity.',
  tooLong: 'Custom amenity name is too long.',
  duplicate: 'This amenity is already added.',
  maxReached: 'Maximum number of amenities reached.',
};

export function AmenityChips({ selected, onChange }: AmenityChipsProps) {
  const [customLabel, setCustomLabel] = useState('');
  const [customError, setCustomError] = useState<CustomAmenityError | null>(null);
  const customAmenities = selected.filter((item) => item.code === 'CUSTOM');

  function addCustom() {
    const result = addCustomAmenity(selected, customLabel);
    if (result.error) {
      setCustomError(result.error);
      return;
    }
    onChange(result.amenities);
    setCustomLabel('');
    setCustomError(null);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {PRESET_AMENITY_CODES.map((code) => {
          const isSelected = selected.some((item) => item.code === code);
          const Icon = AMENITY_ICONS[code];
          return (
            <button
              key={code}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(togglePresetAmenity(selected, code))}
              className={`reg-focus inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
                isSelected
                  ? 'border-register bg-register-soft text-register'
                  : 'border-border bg-white text-text-secondary hover:border-register/40'
              }`}
            >
              <Icon aria-hidden className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{PRESET_AMENITY_LABELS[code]}</span>
            </button>
          );
        })}
        {customAmenities.map((amenity) => {
          const Icon = AMENITY_ICONS.CUSTOM;
          return (
            <span
              key={amenityKey(amenity)}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-register bg-register-soft py-1 pr-1 pl-3 text-[12px] font-medium text-register"
            >
              <Icon aria-hidden className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{amenity.label}</span>
              <button
                type="button"
                aria-label={`Remove ${amenity.label}`}
                onClick={() => onChange(removeCustomAmenity(selected, amenity.label))}
                className="reg-focus grid h-5 w-5 shrink-0 place-items-center rounded-full hover:bg-white"
              >
                <X aria-hidden className="h-3 w-3" />
              </button>
            </span>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <input
          id="customAmenity"
          value={customLabel}
          onChange={(event) => {
            setCustomLabel(event.target.value);
            if (customError) setCustomError(null);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addCustom();
            }
          }}
          placeholder="e.g. Gym access"
          aria-label="Add custom amenity"
          aria-invalid={customError ? true : undefined}
          aria-describedby={customError ? 'customAmenity-error' : undefined}
          className={`${inputClasses(Boolean(customError))} min-w-0 flex-1`}
        />
        <button
          type="button"
          onClick={addCustom}
          className="reg-focus h-[46px] shrink-0 rounded-2xl border border-register bg-register-soft px-4 text-[13px] font-semibold text-register transition hover:bg-register hover:text-white"
        >
          Add custom amenity
        </button>
      </div>
      {customError ? (
        <p id="customAmenity-error" className="text-[12px] text-danger">
          {CUSTOM_ERRORS[customError]}
        </p>
      ) : null}
    </div>
  );
}
