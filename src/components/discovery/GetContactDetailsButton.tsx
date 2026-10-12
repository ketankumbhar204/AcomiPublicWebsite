import { Loader2, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useEnquirySendKind, useIsEnquirySending } from '../../context/EnquiryFeedbackContext';
import { ActionButton } from '../common/ActionButton';

type GetContactDetailsButtonProps = {
  listingId: string;
  onClick: () => void;
  className?: string;
  'aria-label'?: string;
};

export function GetContactDetailsButton({
  listingId,
  onClick,
  className = '',
  'aria-label': ariaLabel,
}: GetContactDetailsButtonProps) {
  const { t } = useTranslation();
  const sending = useIsEnquirySending(listingId);
  const sendKind = useEnquirySendKind(listingId);

  return (
    <ActionButton onClick={onClick} disabled={sending} className={className} aria-label={ariaLabel}>
      {sending ? (
        <span className="inline-flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          {sendKind === 'view' ? t('discovery.enquireViewingShort') : t('discovery.enquireSubmittingShort')}
        </span>
      ) : (
        <span className="inline-flex items-center justify-center gap-1.5">
          <Phone aria-hidden className="h-4 w-4" />
          {t('discovery.getContactDetails')}
        </span>
      )}
    </ActionButton>
  );
}
