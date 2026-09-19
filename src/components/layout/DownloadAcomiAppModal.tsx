import { ExternalLink, Smartphone, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { openAcomiAndroidApp } from '../../lib/openAcomiAndroidApp';
import { ActionButton } from '../common/ActionButton';
import { Modal } from '../common/Modal';

type DownloadAcomiAppModalProps = {
  open: boolean;
  onClose: () => void;
  /** Optional enquiry deep-link for Android intent / Play fallback. */
  enquiryId?: string | null;
  title?: string;
  body?: string;
};

/**
 * Same “open / get ACOMI Android app” prompt used after enquiry submission.
 * Used for My Enquiries and notification → enquiry actions on the public site.
 */
export function DownloadAcomiAppModal({
  open,
  onClose,
  enquiryId,
  title,
  body,
}: DownloadAcomiAppModalProps) {
  const { t } = useTranslation();
  const heading = title ?? t('enquiries.appOnlyTitle');
  const description = body ?? t('enquiries.appOnlyBody');

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy="download-acomi-app-title"
      describedBy="download-acomi-app-body"
      closeOnBackdrop
      className="max-w-md p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 text-center sm:text-left">
          <h2
            id="download-acomi-app-title"
            className="text-xl font-semibold tracking-tight text-navy"
          >
            {heading}
          </h2>
          <p id="download-acomi-app-body" className="mt-1.5 text-[14px] text-text-secondary">
            {description}
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

      <div className="mt-5 space-y-3">
        <button
          type="button"
          onClick={() => openAcomiAndroidApp({ enquiryId })}
          className="flex w-full items-center gap-3 rounded-2xl border border-primary/25 bg-[#E7F6EE] px-3.5 py-3 text-left transition hover:border-primary/50"
        >
          <span className="shrink-0 text-primary">
            <Smartphone className="h-5 w-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[14px] font-semibold text-navy">
              {t('discovery.enquireOpenApp')}
            </span>
            <span className="block text-[12px] text-text-secondary">
              {t('discovery.enquireAppHint')}
            </span>
          </span>
          <ExternalLink className="h-4 w-4 shrink-0 text-primary/70" aria-hidden />
        </button>

        <div className="rounded-2xl border border-primary/20 bg-[#E7F6EE] px-4 py-3.5 text-center">
          <p className="text-[15px] font-bold leading-snug tracking-tight text-navy">
            {t('discovery.enquireAppPromoTitle')}
          </p>
          <p className="mt-1.5 text-[12px] leading-snug text-text-secondary">
            {t('discovery.enquireAppPromoBody')}
          </p>
        </div>
      </div>

      <ActionButton variant="ghost" className="mt-4 w-full" onClick={onClose}>
        {t('discovery.enquireDone', { defaultValue: 'Done' })}
      </ActionButton>
    </Modal>
  );
}
