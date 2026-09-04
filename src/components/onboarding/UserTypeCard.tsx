import { ArrowRight, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { UserType, UserTypeOption } from '../../constants/userTypes';

type UserTypeCardProps = {
  option: UserTypeOption;
  selected: boolean;
  onSelect: (id: UserType) => void;
};

export function UserTypeCard({ option, selected, onSelect }: UserTypeCardProps) {
  const { t } = useTranslation();
  const title = t(`userTypes.${option.id}.title`);
  const description = t(`userTypes.${option.id}.description`);

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(option.id)}
      className={`ui-lift flex w-full items-center gap-3 rounded-2xl border-2 px-3 py-2.5 text-left shadow-[var(--shadow-sm)] sm:px-3.5 sm:py-3 ${option.surface} ${option.ring} ${selected ? option.border : 'border-black/5'}`}
    >
      <span
        className={`ui-pop inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[var(--shadow-sm)] ${option.accent}`}
      >
        <option.Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden />
      </span>

      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className={`text-[13px] leading-snug font-semibold sm:text-sm ${option.accent}`}>
          {title}
        </span>
        <span className="text-[11px] leading-snug text-text-secondary sm:text-xs">
          {description}
        </span>
        {selected ? (
          <span className={`text-[11px] font-semibold tracking-wide ${option.accent}`}>
            {t('userTypeModal.currentSelection')}
          </span>
        ) : null}
      </span>

      <span
        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white ${selected ? '' : 'ui-nudge'} ${option.action}`}
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
