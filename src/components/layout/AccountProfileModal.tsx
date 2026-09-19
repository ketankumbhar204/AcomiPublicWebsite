import { Mail, Phone, UserRound, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/AuthProvider';
import { ActionButton } from '../common/ActionButton';
import { Modal } from '../common/Modal';

type AccountProfileModalProps = {
  open: boolean;
  onClose: () => void;
};

function formatMobile(mobile: string | undefined): string {
  const digits = (mobile ?? '').replace(/\D/g, '');
  if (digits.length === 10) return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  return mobile?.trim() || '—';
}

/**
 * On-site account details for the public website (no redirect to app.acomi.in).
 */
export function AccountProfileModal({ open, onClose }: AccountProfileModalProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const displayName = user?.fullName?.trim() || t('nav.account');
  const email = user?.email?.trim() || null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy="account-profile-title"
      describedBy="account-profile-body"
      closeOnBackdrop
      className="max-w-md p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 id="account-profile-title" className="text-xl font-semibold tracking-tight text-navy">
            {t('accountProfile.title')}
          </h2>
          <p id="account-profile-body" className="mt-1 text-[14px] text-text-secondary">
            {t('accountProfile.subtitle')}
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-secondary transition hover:bg-soft hover:text-text"
          aria-label={t('nav.closeMenu')}
          onClick={onClose}
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-border">
        <div className="flex items-center gap-3 border-b border-border bg-soft/60 px-4 py-3.5">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
            {displayName
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase() ?? '')
              .join('') || 'A'}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-navy">{displayName}</p>
            <p className="text-xs text-text-secondary">{t('nav.accountMenuHint')}</p>
          </div>
        </div>

        <dl className="divide-y divide-border">
          <div className="flex items-start gap-3 px-4 py-3">
            <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary" aria-hidden />
            <div className="min-w-0">
              <dt className="text-[11px] font-semibold tracking-wide text-muted uppercase">
                {t('accountProfile.name')}
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-navy">{displayName}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3 px-4 py-3">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary" aria-hidden />
            <div className="min-w-0">
              <dt className="text-[11px] font-semibold tracking-wide text-muted uppercase">
                {t('accountProfile.mobile')}
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-navy">
                {formatMobile(user?.mobileNumber)}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3 px-4 py-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary" aria-hidden />
            <div className="min-w-0">
              <dt className="text-[11px] font-semibold tracking-wide text-muted uppercase">
                {t('accountProfile.email')}
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-navy">
                {email || t('accountProfile.noEmail')}
              </dd>
            </div>
          </div>
        </dl>
      </div>

      <ActionButton variant="ghost" className="mt-4 w-full" onClick={onClose}>
        {t('accountProfile.close')}
      </ActionButton>
    </Modal>
  );
}
