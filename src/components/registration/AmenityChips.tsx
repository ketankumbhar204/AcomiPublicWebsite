import { useState } from 'react';
import { Plus } from 'lucide-react';
import { MORE_AMENITIES, PRIMARY_AMENITIES } from '../../constants/propertyRegistration';

type AmenityChipsProps = {
  selected: string[];
  onToggle: (code: string) => void;
};

export function AmenityChips({ selected, onToggle }: AmenityChipsProps) {
  // Keep the extra chips visible once opened, or when a draft already selected one of them.
  const [expanded, setExpanded] = useState(() =>
    MORE_AMENITIES.some((amenity) => selected.includes(amenity.code)),
  );

  const visible = expanded ? [...PRIMARY_AMENITIES, ...MORE_AMENITIES] : PRIMARY_AMENITIES;

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((amenity) => {
        const isSelected = selected.includes(amenity.code);
        return (
          <button
            key={amenity.code}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onToggle(amenity.code)}
            className={`reg-focus rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
              isSelected
                ? 'border-register bg-register-soft text-register'
                : 'border-border bg-white text-text-secondary hover:border-register/40'
            }`}
          >
            {amenity.label}
          </button>
        );
      })}
      {expanded ? null : (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="reg-focus inline-flex items-center gap-1 rounded-full border border-dashed border-border bg-white px-3 py-1.5 text-[12px] font-medium text-text-secondary transition hover:border-register/40"
        >
          <Plus aria-hidden className="h-3 w-3" />
          More
        </button>
      )}
    </div>
  );
}
