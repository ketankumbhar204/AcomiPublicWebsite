import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type InquirySentVia = 'EMAIL' | 'APP' | 'BOTH';

type InquirySentBadgeProps = {
  variant?: 'chip' | 'inline';
  sentVia?: InquirySentVia | null;
};

export function InquirySentBadge({ variant = 'chip', sentVia = null }: InquirySentBadgeProps) {
  const { t } = useTranslation();
  const label = t('discovery.inquirySent', { defaultValue: 'Inquiry sent' });
  const where = sentVia === 'APP'
    ? t('discovery.inquirySentInApp', { defaultValue: 'Sent in the ACOMI app' })
    : sentVia === 'BOTH'
      ? t('discovery.inquirySentEmailAndApp', { defaultValue: 'Sent to your email and the ACOMI app' })
      : sentVia === 'EMAIL'
        ? t('discovery.inquirySentByEmail', { defaultValue: 'Sent to your email' })
        : null;
  if (variant === 'inline') {
    const line = where ? `${label} · ${where}` : label;
    return (
      <span className="inline-flex max-w-full items-center gap-1 text-[11px] leading-4 font-semibold whitespace-nowrap text-[#C2410C]">
        <Check aria-hidden className="h-3 w-3 shrink-0" />
        <span className="truncate">{line}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-md border border-[#FDBA74] bg-[#FFEDD5] px-2 py-1 text-[11px] font-semibold whitespace-nowrap text-[#C2410C]">
      <Check aria-hidden className="h-3 w-3 shrink-0" />
      {label}
    </span>
  );
}

export function InquirySentButton({ className = '' }: { className?: string }) {
  const { t } = useTranslation();
  const label = t('discovery.inquirySent', { defaultValue: 'Inquiry sent' });
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      className={`inline-flex h-10 w-full cursor-default items-center justify-center gap-1 rounded-lg border border-[#FDBA74] bg-[#FFEDD5] px-3 text-[13px] font-semibold whitespace-nowrap text-[#C2410C] ${className}`}
    >
      <Check aria-hidden className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
