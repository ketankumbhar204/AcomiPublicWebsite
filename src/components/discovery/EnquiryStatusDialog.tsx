import { CalendarDays, Clock, Hourglass, Mail, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { SpaceEnquiryResponse } from '../../auth/types';
import { contactWasEmailed } from '../../auth/enquiryContactDelivery';
import { ActionButton } from '../common/ActionButton';
import { Modal } from '../common/Modal';

type EnquiryStatusDialogProps = {
  enquiry: SpaceEnquiryResponse | null;
  onClose: () => void;
  onEnquireAgain: (enquiry: SpaceEnquiryResponse) => void;
};

function statusKey(status: string): 'SHARED' | 'EXPIRED' | 'PENDING' | 'REJECTED' {
  if (status === 'SHARED' || status === 'EXPIRED' || status === 'PENDING') return status;
  return 'REJECTED';
}

function formatDateTime(value: string | null | undefined, locale: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function EnquiryStatusDialog({ enquiry, onClose, onEnquireAgain }: EnquiryStatusDialogProps) {
  const { t, i18n } = useTranslation();
  const status = statusKey(enquiry?.status || 'PENDING');
  const name = enquiry?.spaceName ?? '';
  const canEnquireAgain = status === 'EXPIRED';
  const respondedOn = formatDateTime(enquiry?.sharedAt, i18n.language);
  const sentTo = enquiry?.requesterEmail?.trim() || null;
  const emailed = contactWasEmailed(enquiry);

  return (
    <Modal
      open={enquiry != null}
      onClose={onClose}
      labelledBy="enquiry-status-title"
      describedBy="enquiry-status-body"
      closeOnBackdrop
      className="max-w-md p-6"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t('common.close')}
        className="absolute top-3.5 right-3.5 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-soft hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <X className="h-5 w-5" aria-hidden />
      </button>

      <div
        className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${
          status === 'SHARED'
            ? 'bg-[#E7F6EE] text-primary'
            : status === 'PENDING'
              ? 'bg-amber-50 text-amber-700'
              : 'bg-red-50 text-coral'
        }`}
      >
        {status === 'SHARED' ? (
          <Mail aria-hidden className="h-6 w-6" />
        ) : status === 'EXPIRED' ? (
          <Hourglass aria-hidden className="h-6 w-6" />
        ) : (
          <Clock aria-hidden className="h-6 w-6" />
        )}
      </div>

      <h2 id="enquiry-status-title" className="mt-4 text-xl font-semibold tracking-tight text-navy">
        {status === 'SHARED' && !emailed
          ? t('enquiries.detail.SHARED.inAppTitle')
          : t(`enquiries.detail.${status}.title`)}
      </h2>
      <p id="enquiry-status-body" className="mt-2 text-[15px] leading-relaxed text-text-secondary">
        {status === 'SHARED' && !emailed
          ? t('enquiries.detail.SHARED.inAppBody', { name })
          : t(`enquiries.detail.${status}.body`, { name })}
      </p>

      {name ? (
        <p className="mt-4 rounded-xl bg-soft px-3 py-2 text-[13px] font-medium text-navy">{name}</p>
      ) : null}

      {status === 'SHARED' && emailed && respondedOn ? (
        <div className="mt-3 rounded-xl border border-primary/15 bg-[#E7F6EE] px-3 py-3">
          <p className="flex items-center gap-2 text-[13px] text-navy">
            <CalendarDays aria-hidden className="h-4 w-4 shrink-0 text-primary" />
            <span>
              {t('enquiries.respondedOnLabel')}
              <span className="ml-1 font-semibold">{respondedOn}</span>
            </span>
          </p>
          {sentTo ? (
            <p className="mt-2 flex items-center gap-2 text-[13px] text-navy">
              <Mail aria-hidden className="h-4 w-4 shrink-0 text-primary" />
              <span>
                {t('enquiries.sentToLabel')}
                <span className="ml-1 font-semibold break-all">{sentTo}</span>
              </span>
            </p>
          ) : null}
          <p className="mt-2 text-[12px] leading-relaxed text-text-secondary">{t('enquiries.respondedOnHint')}</p>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3">
        {canEnquireAgain && enquiry ? (
          <ActionButton
            className="w-full"
            onClick={() => {
              onEnquireAgain(enquiry);
            }}
          >
            {t('enquiries.detail.enquireAgain')}
          </ActionButton>
        ) : null}
        <ActionButton variant={canEnquireAgain ? 'ghost' : 'primary'} className="w-full" onClick={onClose}>
          {t('common.close')}
        </ActionButton>
      </div>
    </Modal>
  );
}
