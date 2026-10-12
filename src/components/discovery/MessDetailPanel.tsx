import { Link } from 'react-router-dom';
import { MapPin, Users, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAlreadyInquired, useContactViewed, useInquiryRecord } from '../../auth/useAlreadyInquired';
import { useIsEnquirySending } from '../../context/EnquiryFeedbackContext';
import { GetContactDetailsButton } from './GetContactDetailsButton';
import { formatListingAddress } from '../../data/listings/query';
import type { MessListing } from '../../data/listings/types';
import { InquirySentButton, InquirySentDetails } from './InquirySentBadge';
import { ListingCardMeta } from './ListingCardMeta';
import { ListingGallery } from './ListingGallery';
import { ListingInfoChips } from './ListingInfoChips';
import { ListingPrice } from './ListingPrice';
import { priceBasisLabel } from '../../lib/priceBasis';
import { ListingUnavailableDetails } from './ListingUnavailableDetails';
import { PhotoRequestAction } from './PhotoRequestAction';
import { hasActualListingPhotos } from '../../lib/photoRequest';
import { OwnerContactCard, type RevealedOwnerContact } from './OwnerContactCard';
import { usePersistedRevealedContact } from './usePersistedRevealedContact';

type MessDetailPanelProps = {
  listing: MessListing;
  onEnquire: () => void;
  revealedContact?: RevealedOwnerContact | null;
};

export function MessDetailPanel({ listing, onEnquire, revealedContact }: MessDetailPanelProps) {
  const { t } = useTranslation();
  const meta = listing.listingMetadata;
  const meals = meta.mealsServed;
  const address = formatListingAddress(listing);
  const cta = t('discovery.getContactDetails');
  const alreadyInquired = useAlreadyInquired(listing.id);
  const contactViewed = useContactViewed(listing.id);
  const inquiry = useInquiryRecord(listing.id);
  const contact = usePersistedRevealedContact(listing.id, revealedContact);
  const sendingEnquiry = useIsEnquirySending(listing.id);
  const unlocked = Boolean(contact) || contactViewed || alreadyInquired;

  return (
    <div className="flex h-full flex-col">
      <div key={listing.id}>
        <ListingGallery
          listingId={listing.id}
          spaceType="MESS"
          images={meta.images}
          name={listing.name}
        />
      </div>
      <h2 className="mt-4 text-[1.35rem] font-semibold tracking-tight text-navy">{listing.name}</h2>
      {contactViewed ? (
        <p className="mt-3 text-[13px] font-semibold text-[#0F6B4C]">{t('discovery.contactDetailsViewed')}</p>
      ) : null}
      <OwnerContactCard contact={contact} mapUrl={listing.mapUrl} />
      {alreadyInquired ? <InquirySentDetails listingId={listing.id} /> : null}
      {address && !unlocked ? (
        <button
          type="button"
          onClick={onEnquire}
          className="mt-2 flex w-full items-start gap-1.5 text-left text-[13px] text-text-secondary underline decoration-black/15 underline-offset-2 hover:text-primary hover:decoration-primary"
          aria-label={`${cta}: ${listing.name}`}
        >
          <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          {address}
        </button>
      ) : address ? (
        <p className="mt-2 flex items-start gap-1.5 text-[13px] text-text-secondary">
          <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          {address}
        </p>
      ) : null}
      <p className="mt-4 text-[1.35rem] font-semibold text-navy">
        <ListingPrice
          amount={listing.monthlyPrice}
          suffix={t(`discovery.priceBasis.${listing.priceBasis ?? ''}`, {
            defaultValue: priceBasisLabel(listing.priceBasis, 'MESS'),
          })}
          fallback={t('discovery.priceOnRequest')}
          size="detail"
        />
      </p>
      {listing.mealPrice != null ? (
        <p className="mt-1 text-[14px] font-medium text-navy">
          <ListingPrice amount={listing.mealPrice} suffix={t('discovery.perMeal')} fallback={t('discovery.priceOnRequest')} />
        </p>
      ) : null}
      {listing.capacityEstimate != null || meals.length > 0 ? (
        <ul className="mt-4 grid grid-cols-2 gap-2">
          {listing.capacityEstimate != null ? (
            <li className="rounded-xl bg-soft px-3 py-2 text-[12px] font-medium text-navy">
              <Users aria-hidden className="mb-1 h-4 w-4 text-register" />
              {t('discovery.customersAbout', { count: listing.capacityEstimate })}
            </li>
          ) : null}
          {meals.length > 0 ? (
            <li className="rounded-xl bg-soft px-3 py-2 text-[12px] font-medium text-navy">
              <UtensilsCrossed aria-hidden className="mb-1 h-4 w-4 text-register" />
              {meals.map((meal) => t(`meals.${meal.toLowerCase()}`)).join(' + ')}
            </li>
          ) : null}
        </ul>
      ) : null}
      {listing.description ? (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-navy">{t('discovery.aboutMess')}</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{listing.description}</p>
        </div>
      ) : null}
      {meals.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-navy">{t('discovery.whatsIncluded')}</h3>
          <p className="mt-2 text-[13px] text-text-secondary">
            {meals.map((meal) => t(`meals.${meal.toLowerCase()}`)).join(', ')}
          </p>
        </div>
      ) : null}
      <ListingUnavailableDetails hidePhotos={hasActualListingPhotos(meta.images)} />
      <PhotoRequestAction
        kind="mess"
        name={listing.name}
        spaceType="MESS"
        location={address}
        photoUrls={meta.images}
        phones={
          contact
            ? [contact.mobileNumber, contact.alternateMobileNumber, contact.additionalMobileNumber]
            : []
        }
        contactAuthorized={Boolean(contact)}
        onNeedContact={contact || contactViewed ? undefined : onEnquire}
      />
      <div className="mt-auto pt-5">
        <ListingCardMeta
          listing={listing}
          showMaps={Boolean(listing.mapUrl?.trim())}
          mapHref={unlocked ? listing.mapUrl : undefined}
          onEnquire={unlocked ? undefined : onEnquire}
          chips={
            <ListingInfoChips
              listing={{ ...listing, mealsServed: meals }}
              variant="detail"
              surface="meals"
            />
          }
        />
        {contactViewed && !sendingEnquiry ? null : alreadyInquired && !sendingEnquiry ? (
          <InquirySentButton email={inquiry?.sentToEmail} className="mt-4" />
        ) : (
          <GetContactDetailsButton
            listingId={listing.id}
            onClick={onEnquire}
            className="mt-4 w-full"
            aria-label={`${cta}: ${listing.name}`}
          />
        )}
        <Link to={`/meals/${listing.id}`} className="mt-3 block text-center text-[13px] font-semibold text-primary hover:underline">
          {t('discovery.openFullPage')}
        </Link>
      </div>
    </div>
  );
}
