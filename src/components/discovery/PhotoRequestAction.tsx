import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../common/Modal';
import {
  buildPhotoRequestMessage,
  firstWhatsAppPhone,
  hasActualListingPhotos,
  photoRequestActionLabel,
  photoRequestTitle,
  whatsAppChatUrl,
  type PhotoRequestKind,
} from '../../lib/photoRequest';

type PhotoRequestActionProps = {
  kind: PhotoRequestKind;
  name: string;
  spaceType?: string | null;
  location?: string | null;
  photoUrls?: ReadonlyArray<string | null | undefined> | null;
  phones?: ReadonlyArray<string | null | undefined> | null;
  /** True only after the existing contact-reveal flow has authorized this viewer. */
  contactAuthorized: boolean;
  onNeedContact?: () => void;
};

export function PhotoRequestAction({
  kind,
  name,
  spaceType,
  location,
  photoUrls,
  phones,
  contactAuthorized,
  onNeedContact,
}: PhotoRequestActionProps) {
  const { t } = useTranslation();
  const hasPhotos = hasActualListingPhotos(photoUrls);
  const phone = contactAuthorized ? firstWhatsAppPhone(phones) : null;
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');

  const label = photoRequestActionLabel(hasPhotos);
  const title = photoRequestTitle(hasPhotos);

  function openRequest() {
    if (!contactAuthorized) {
      onNeedContact?.();
      return;
    }
    setMessage(
      buildPhotoRequestMessage({ kind, hasPhotos, name, spaceType, location }),
    );
    setNotice('');
    setOpen(true);
  }

  async function openWhatsApp() {
    const url = phone ? whatsAppChatUrl(phone, message) : null;
    if (!url) {
      setNotice(
        t('discovery.photoRequestUnavailable', {
          defaultValue: 'This contact number can’t be opened in WhatsApp.',
        }),
      );
      return;
    }
    const popup = window.open(url, '_blank', 'noopener,noreferrer');
    if (popup) {
      setOpen(false);
      return;
    }
    try {
      await navigator.clipboard.writeText(`${message}\n+${phone}`);
      setNotice(
        t('discovery.photoRequestCopied', {
          defaultValue: 'WhatsApp didn’t open. The message and number were copied so you can paste them.',
        }),
      );
    } catch {
      setNotice(
        t('discovery.photoRequestBlocked', {
          defaultValue: 'WhatsApp didn’t open. Allow pop-ups, or copy the message and contact number from this screen.',
        }),
      );
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openRequest}
        className="mt-3 inline-flex max-w-full items-center justify-center rounded-full border border-primary/30 bg-[#E7F6EE] px-3.5 py-2 text-left text-[13px] font-semibold text-[#0F6B4C] hover:border-primary/60"
      >
        {label}
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        labelledBy="photo-request-title"
        closeOnBackdrop
        className="max-w-md p-5"
      >
        <div>
          <h2 id="photo-request-title" className="text-lg font-semibold text-navy">
            {title}
          </h2>
          <p className="mt-1 text-[14px] font-medium text-navy">{name}</p>
          {phone ? (
            <>
              <label htmlFor="photo-request-message" className="mt-4 block text-[13px] font-semibold text-navy">
                {t('discovery.photoRequestMessage', { defaultValue: 'Message' })}
              </label>
              <textarea
                id="photo-request-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={6}
                className="mt-2 w-full resize-y rounded-2xl border border-border px-3 py-2 text-[14px] leading-relaxed text-navy outline-none focus:border-primary"
              />
              {notice ? <p className="mt-2 text-[13px] text-text-secondary">{notice}</p> : null}
              <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-full px-4 py-2 text-[14px] font-semibold text-text-secondary"
                >
                  {t('common.cancel', { defaultValue: 'Cancel' })}
                </button>
                <button
                  type="button"
                  onClick={() => void openWhatsApp()}
                  disabled={!message.trim()}
                  className="rounded-full bg-primary px-4 py-2 text-[14px] font-semibold text-white disabled:opacity-50"
                >
                  {t('discovery.openWhatsApp', { defaultValue: 'Open WhatsApp' })}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
                {t('discovery.photoRequestUnavailable', {
                  defaultValue: 'This contact number can’t be opened in WhatsApp.',
                })}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mt-4 rounded-full px-4 py-2 text-[14px] font-semibold text-text-secondary"
              >
                {t('common.cancel', { defaultValue: 'Cancel' })}
              </button>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
