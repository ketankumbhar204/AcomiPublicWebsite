import { useState } from 'react';
import { Check, Eye, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { sendEnquiryAgain } from '../../auth/discoverEnquiry';
import { markInquired } from '../../auth/inquiredListings';
import { useInquiryRecord } from '../../auth/useAlreadyInquired';
import { useEnquiryFeedback } from '../../context/EnquiryFeedbackContext';
import { PublicApiError } from '../../lib/apiClient';

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

function formatSentAt(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

/** Keeps the inquiry-sent line and adds the destination email, time, and a resend action. */
export function InquirySentDetails({ listingId }: { listingId: string }) {
  const { t } = useTranslation();
  const record = useInquiryRecord(listingId);
  const { showToast } = useEnquiryFeedback();
  const [busy, setBusy] = useState(false);
  const when = formatSentAt(record?.sentAt ?? null);
  const email = record?.sentToEmail?.trim() || '';

  async function sendAgain() {
    if (busy) return;
    setBusy(true);
    try {
      const created = await sendEnquiryAgain(listingId);
      const address = created.requesterEmail?.trim() || email;
      const sentAt = created.emailDeliveredAt || created.deliveredAt || created.contactEmailSentAt || created.requestedAt || new Date().toISOString();
      markInquired(listingId, 'EMAIL', { sentToEmail: address || null, sentAt });
      showToast({
        title: t('discovery.enquireEmailSentTitle'),
        body: address
          ? t('discovery.enquireEmailSentBodyTo', { email: address })
          : t('discovery.enquireEmailSentBody'),
      });
    } catch (err) {
      const body = err instanceof PublicApiError ? err.message : t('discovery.enquireSubmitError');
      showToast({ tone: 'error', title: t('discovery.enquireSubmitError'), body });
    } finally {
      setBusy(false);
    }
  }

  const appOnly = !email && (record?.sentVia === 'APP' || record?.sentVia === 'BOTH');
  const alreadySent = t('discovery.inquiryAlreadySent', { defaultValue: 'Inquiry already sent' });
  const statusLine = [
    alreadySent,
    email || (appOnly ? t('discovery.inquirySentInApp', { defaultValue: 'Sent in the ACOMI app' }) : null),
    when,
  ]
    .filter(Boolean)
    .join(' : ');

  return (
    <div className="mt-2 flex w-full flex-nowrap items-center gap-2 rounded-full border border-[#FDBA74] bg-[#FFEDD5] py-1 pr-1 pl-2.5">
      <span className="min-w-0 flex-1 truncate text-[12.5px] leading-none font-semibold text-[#C2410C]">
        {statusLine}
      </span>
      <button
        type="button"
        onClick={() => void sendAgain()}
        disabled={busy}
        className="ml-auto inline-flex h-8 shrink-0 items-center justify-center rounded-full border border-[#C2410C] bg-white px-3 text-[12.5px] leading-none font-semibold whitespace-nowrap text-[#C2410C] hover:bg-[#FFF7ED] disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : null}
        {t('discovery.sendInquiryAgain', { defaultValue: 'Resend inquiry' })}
      </button>
    </div>
  );
}

export function InquirySentButton({
  onClick,
  className = '',
}: {
  onClick?: () => void;
  className?: string;
  email?: string | null;
}) {
  const { t } = useTranslation();
  const label = t('discovery.inquirySent', { defaultValue: 'Inquiry sent' });
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-[#FDBA74] bg-[#FFEDD5] px-3 text-[13px] font-semibold whitespace-nowrap text-[#C2410C] hover:bg-[#FED7AA] ${className}`}
    >
      <Check aria-hidden className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

export function ContactViewedButton({ onClick, className = '' }: { onClick: () => void; className?: string }) {
  const { t } = useTranslation();
  const label = t('discovery.contactDetailsViewed');
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-[#8FCBAB] bg-[#E7F6EE] px-3 text-[13px] font-semibold whitespace-nowrap text-[#0F6B4C] hover:bg-[#D8F3E4] ${className}`}
    >
      <Eye aria-hidden className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}
