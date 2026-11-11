import { ArrowRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { UserType, UserTypeOption } from '../../constants/userTypes';

type HeroIntentCardProps = {
  option: UserTypeOption;
  onSelect: (id: UserType) => void;
};

/**
 * Hero intent card styled to match the landing-page mock:
 * white surface, soft square icon well, accent title, top-right arrow.
 */
export function HeroIntentCard({ option, onSelect }: HeroIntentCardProps) {
  const { t } = useTranslation();
  const title = t(`userTypes.${option.id}.title`);
  const description = t(`userTypes.${option.id}.description`);

  return (
    <button
      type="button"
      onClick={() => onSelect(option.id)}
      className={`ui-lift group relative flex w-full items-start gap-3 rounded-[18px] border border-black/[0.06] bg-white px-3.5 py-3.5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_20px_rgba(15,23,42,0.05)] sm:gap-3.5 sm:px-4 sm:py-4 ${option.ring}`}
    >
      <span
        className={`ui-pop inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] ${option.iconWell} ${option.accent}`}
      >
        <option.Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden />
      </span>

      <span className="min-w-0 flex-1 pr-9">
        <span
          className={`block text-[15px] leading-[1.3] font-semibold tracking-tight sm:text-[16px] ${option.accent}`}
        >
          {title}
        </span>
        <span className="mt-1 block text-[12px] leading-[1.4] text-text-secondary">
          {description}
        </span>
      </span>

      <span
        className={`absolute top-3.5 right-3.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white shadow-[0_1px_2px_rgba(15,23,42,0.12)] transition group-hover:translate-x-0.5 sm:top-4 sm:right-4 ${option.action}`}
      >
        <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden />
      </span>
    </button>
  );
}

/** Compact selected-state card for the user-type modal (unchanged behavior). */
export function UserTypeCard({
  option,
  selected,
  onSelect,
}: {
  option: UserTypeOption;
  selected: boolean;
  onSelect: (id: UserType) => void;
}) {
  const { t } = useTranslation();
  const title = t(`userTypes.${option.id}.title`);
  const description = t(`userTypes.${option.id}.description`);

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(option.id)}
      className={`ui-lift flex w-full items-start gap-3 rounded-[18px] border-2 bg-white px-3.5 py-3.5 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_20px_rgba(15,23,42,0.05)] sm:px-4 sm:py-4 ${option.ring} ${selected ? option.border : 'border-black/[0.06]'}`}
    >
      <span
        className={`ui-pop inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] ${option.iconWell} ${option.accent}`}
      >
        <option.Icon className="h-5 w-5" strokeWidth={1.9} aria-hidden />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-1 pr-1">
        <span
          className={`text-[15px] leading-[1.3] font-semibold tracking-tight sm:text-[16px] ${option.accent}`}
        >
          {title}
        </span>
        <span className="text-[12px] leading-[1.4] text-text-secondary">{description}</span>
        {selected ? (
          <span className={`text-[11px] font-semibold tracking-wide ${option.accent}`}>
            {t('userTypeModal.currentSelection')}
          </span>
        ) : null}
      </span>

      <span
        className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${selected ? '' : 'ui-nudge'} ${option.action}`}
      >
        {selected ? (
          <Check className="h-4 w-4" strokeWidth={2.6} aria-hidden />
        ) : (
          <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden />
        )}
      </span>
    </button>
  );
}
