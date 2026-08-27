import { Check } from 'lucide-react';
import type { PropertyType } from '../../api/types';
import { PROPERTY_TYPE_OPTIONS } from '../../constants/propertyRegistration';

type PropertyTypeSelectProps = {
  value: PropertyType | null;
  onChange: (value: PropertyType) => void;
  error?: string;
};

const CARD_TONE: Record<
  Exclude<PropertyType, 'MESS'>,
  { idle: string; hover: string; selected: string; iconWrap: string; icon: string }
> = {
  PG: {
    idle: 'border-[#C9EBD4] bg-[#E8F8EE]',
    hover: 'hover:border-[#25D366]/55 hover:bg-[#DFF6E8]',
    selected: 'border-register bg-[#D4F5E0] shadow-[0_0_0_1px_#25D366]',
    iconWrap: 'bg-white/80 text-[#1B9A4A]',
    icon: 'text-[#1B9A4A]',
  },
  HOSTEL: {
    idle: 'border-[#DDD2F5] bg-[#F4F0FF]',
    hover: 'hover:border-[#8B6CC9]/45 hover:bg-[#EDE6FF]',
    selected: 'border-[#7C5CBF] bg-[#E8E0FF] shadow-[0_0_0_1px_#7C5CBF]',
    iconWrap: 'bg-white/80 text-[#6B4CB0]',
    icon: 'text-[#6B4CB0]',
  },
  RENTAL: {
    idle: 'border-[#C9D9F5] bg-[#EEF4FF]',
    hover: 'hover:border-[#4A7FD4]/45 hover:bg-[#E3EEFF]',
    selected: 'border-[#3B6FCB] bg-[#DCE8FF] shadow-[0_0_0_1px_#3B6FCB]',
    iconWrap: 'bg-white/80 text-[#2F62B8]',
    icon: 'text-[#2F62B8]',
  },
  CO_LIVING: {
    idle: 'border-[#F5D9B8] bg-[#FFF4EA]',
    hover: 'hover:border-[#E09A4A]/50 hover:bg-[#FFEDD9]',
    selected: 'border-[#D97706] bg-[#FFE8CC] shadow-[0_0_0_1px_#D97706]',
    iconWrap: 'bg-white/80 text-[#C2410C]',
    icon: 'text-[#C2410C]',
  },
};

/**
 * Native radios inside labels: arrow-key navigation, grouping and the required state all
 * come from the platform rather than hand-rolled key handling.
 */
export function PropertyTypeSelect({ value, onChange, error }: PropertyTypeSelectProps) {
  return (
    <fieldset>
      <legend className="text-[15px] font-semibold text-text">
        What type of property do you manage?
      </legend>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {PROPERTY_TYPE_OPTIONS.map((option) => {
          const selected = value === option.id;
          const tone = CARD_TONE[option.id as Exclude<PropertyType, 'MESS'>];
          return (
            <label
              key={option.id}
              className={`relative flex cursor-pointer items-center gap-2.5 rounded-2xl border px-3 py-3 transition has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-register ${
                selected ? tone.selected : `${tone.idle} ${tone.hover}`
              }`}
            >
              <input
                type="radio"
                name="propertyType"
                value={option.id}
                checked={selected}
                onChange={() => onChange(option.id)}
                aria-describedby={error ? 'propertyType-error' : undefined}
                className="sr-only"
              />
              <span
                aria-hidden
                className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tone.iconWrap}`}
              >
                <option.Icon className={`h-5 w-5 ${tone.icon}`} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col pr-4">
                <span className="text-[13px] leading-tight font-semibold text-text">{option.title}</span>
                <span className="text-[11px] leading-tight text-muted">{option.subtitle}</span>
              </span>
              <span
                aria-hidden
                className={`absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-register text-white ${
                  selected ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Check className="h-2.5 w-2.5" />
              </span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p id="propertyType-error" className="mt-2 text-[12px] text-danger">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
