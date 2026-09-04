import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getUserTypeOption } from '../../constants/userTypes';
import { useUserType } from '../../context/UserTypeContext';

type UserTypeSwitcherProps = {
  /** 'bar' is the compact navbar pill, 'menu' is the mobile navigation row. */
  variant?: 'bar' | 'menu';
  /** Lets the mobile navigation close itself before the dialog opens. */
  onOpen?: () => void;
};

/**
 * Trigger only. This holds no selection UI of its own: it reopens the shared
 * UserTypeModal, which stays the single place a user type can be chosen.
 */
export function UserTypeSwitcher({ variant = 'bar', onOpen }: UserTypeSwitcherProps) {
  const { t } = useTranslation();
  const { userType, openUserTypeModal } = useUserType();

  if (!userType) {
    return null;
  }

  const option = getUserTypeOption(userType);
  const shortLabel = t(`userTypes.${option.id}.shortLabel`);
  const label = t('userTypeModal.usingAsA11y', { role: shortLabel });

  function handleClick() {
    onOpen?.();
    openUserTypeModal();
  }

  if (variant === 'menu') {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        className="mt-1 mb-2 flex w-full items-center gap-3 rounded-2xl border border-border bg-mint px-3 py-3 text-left transition hover:bg-soft"
      >
        <span
          className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white ${option.accent}`}
        >
          <option.Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-[11px] tracking-[0.12em] text-muted uppercase">
            {t('userTypeModal.usingAs')}
          </span>
          <span className="truncate text-sm font-semibold text-text">{shortLabel}</span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-muted" aria-hidden />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-mint px-3 py-1.5 text-sm font-medium text-text transition hover:bg-soft"
    >
      <option.Icon className={`h-4 w-4 shrink-0 ${option.accent}`} strokeWidth={1.8} aria-hidden />
      <span className="hidden text-text-secondary xl:inline">{t('userTypeModal.usingAs')}</span>
      <span>{shortLabel}</span>
      <ChevronDown className="h-4 w-4 shrink-0 text-muted" aria-hidden />
    </button>
  );
}
