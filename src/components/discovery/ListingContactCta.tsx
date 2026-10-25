import { useTranslation } from 'react-i18next';
import type { DirectRevealPhase } from '../../auth/useDirectContactReveal';
import { GetContactDetailsButton } from './GetContactDetailsButton';
import { InquirySentButton } from './InquirySentBadge';

type ListingContactCtaProps = {
  listingId: string;
  listingName: string;
  phase: DirectRevealPhase;
  alreadyInquired: boolean;
  contactViewed: boolean;
  sendingEnquiry: boolean;
  sentToEmail?: string | null;
  onEnquire: () => void;
};

export function ListingContactCta({
  listingId,
  listingName,
  phase,
  alreadyInquired,
  contactViewed,
  sendingEnquiry,
  sentToEmail,
  onEnquire,
}: ListingContactCtaProps) {
  const { t } = useTranslation();
  const revealing = phase === 'checking' || phase === 'revealing' || phase === 'revealed';

  if (phase === 'own') {
    return (
      <div className="mt-4 rounded-xl border border-[#C6EBD7] bg-[#F3FBF7] px-4 py-3 text-left">
        <p className="text-[14px] font-semibold text-navy">{t('discovery.enquireOwnTitle')}</p>
        <p className="mt-1 text-[13px] text-text-secondary">{t('discovery.enquireOwnBody')}</p>
      </div>
    );
  }

  return (
    <>
      {phase === 'disabled' || phase === 'exhausted' ? (
        <p className="mt-4 text-[13px] text-text-secondary">
          {phase === 'exhausted'
            ? t('discovery.viewHereExhausted', {
                defaultValue: 'You have used all instant contact views for today.',
              })
            : t('discovery.viewHereDisabled', {
                defaultValue: 'Instant contact viewing is turned off. You can still request details.',
              })}
        </p>
      ) : null}
      {revealing || (contactViewed && !sendingEnquiry) ? null : alreadyInquired && !sendingEnquiry ? (
        <InquirySentButton email={sentToEmail} className="mt-4" />
      ) : (
        <GetContactDetailsButton
          listingId={listingId}
          onClick={onEnquire}
          className="mt-4 w-full"
          aria-label={`${t('discovery.getContactDetails')}: ${listingName}`}
        />
      )}
    </>
  );
}
