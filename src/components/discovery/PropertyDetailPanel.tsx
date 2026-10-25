import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAlreadyInquired, useContactViewed, useInquiryRecord } from '../../auth/useAlreadyInquired';
import { useDirectContactReveal } from '../../auth/useDirectContactReveal';
import { useIsEnquirySending } from '../../context/EnquiryFeedbackContext';
import { ListingContactCta } from './ListingContactCta';
import { formatListingAddress } from '../../data/listings/query';
import { listingSectionElementId, type ListingSection } from '../../data/listings/listingInfo';
import type { PropertyListing } from '../../data/listings/types';
import { amenityDisplayLabel, amenityIcon } from './listingIcons';
import { InquirySentBadge, InquirySentDetails } from './InquirySentBadge';
import { ListingCardMeta } from './ListingCardMeta';
import { ListingFacts } from './ListingFacts';
import { ListingGallery } from './ListingGallery';
import { ListingSaveButton } from './ListingSaveButton';
import { ListingInfoChips } from './ListingInfoChips';
import { ListingPrice } from './ListingPrice';
import { priceBasisLabel } from '../../lib/priceBasis';
import { ListingUnavailableDetails } from './ListingUnavailableDetails';
import { PhotoRequestAction } from './PhotoRequestAction';
import { useListingExtrasGate } from './useListingExtrasGate';
import { hasActualListingPhotos } from '../../lib/photoRequest';
import { OwnerListingActions, useMyListing } from './OwnerListingActions';
import { OwnerContactCard, type RevealedOwnerContact } from './OwnerContactCard';
import { usePersistedRevealedContact } from './usePersistedRevealedContact';
import { scrollToListingSection, useScrollToListingSection } from '../../lib/scrollToListingSection';

type PropertyDetailPanelProps = {
  listing: PropertyListing;
  onEnquire: () => void;
  revealedContact?: RevealedOwnerContact | null;
  focusSection?: ListingSection | null;
  focusToken?: number;
};

export function PropertyDetailPanel({
  listing,
  onEnquire,
  revealedContact,
  focusSection = null,
  focusToken = 0,
}: PropertyDetailPanelProps) {
  const { t } = useTranslation();
  const meta = listing.listingMetadata;
  const address = formatListingAddress(listing);
  const cta = t('discovery.getContactDetails');
  const alreadyInquired = useAlreadyInquired(listing.id);
  const contactViewed = useContactViewed(listing.id);
  const inquiry = useInquiryRecord(listing.id);
  const reveal = useDirectContactReveal(listing.id, true);
  const persistedContact = usePersistedRevealedContact(listing.id, reveal.contact ?? revealedContact);
  const contact = persistedContact.contact;
  const contactLoading =
    persistedContact.loading || ((reveal.phase === 'checking' || reveal.phase === 'revealing') && !contact);
  const sendingEnquiry = useIsEnquirySending(listing.id);
  const mine = useMyListing(listing.id);
  const isOwnListing = reveal.phase === 'own' || Boolean(mine);
  const unlocked = Boolean(contact) || contactViewed || alreadyInquired || isOwnListing;
  const extras = useListingExtrasGate(listing.id, Boolean(contact) || contactViewed || alreadyInquired);
  extras.mapHrefRef.current = listing.mapUrl ?? '';
  useScrollToListingSection(focusSection, true, focusToken);

  return (
    <div className="flex h-full flex-col">
      <div key={listing.id} className="relative">
        <ListingGallery
          listingId={listing.id}
          spaceType={listing.type}
          images={meta.images}
          name={listing.name}
        />
        {alreadyInquired ? (
          <div className="absolute top-3 left-3">
            <InquirySentBadge />
          </div>
        ) : null}
      </div>
      <div id={listingSectionElementId('food')} className="mt-4">
        <ListingFacts
          leading={
            <span className="inline-flex items-center rounded-md bg-[#F4F7F5] px-2 py-1 text-[11px] leading-none font-semibold tracking-wide text-navy uppercase">
              {t(`discovery.propertyTypes.${listing.type}`)}
            </span>
          }
          genderPolicy={listing.genderPolicy}
          sharingNotes={listing.sharingNotes}
          foodAvailability={listing.foodAvailability ?? (listing.foodIncludedInRent ? 'INCLUDED' : null)}
        />
      </div>
      <div className="mt-2 flex items-start justify-between gap-3">
        <h2 className="text-[1.35rem] font-semibold tracking-tight text-navy">{listing.name}</h2>
        <ListingSaveButton id={listing.id} name={listing.name} kind="places" detail={address} />
      </div>
      <OwnerListingActions listing={mine} />
      <div id={listingSectionElementId('contact')}>
        {contactViewed ? (
          <p className="mt-3 text-[13px] font-semibold text-[#0F6B4C]">{t('discovery.contactDetailsViewed')}</p>
        ) : null}
        <OwnerContactCard
          contact={contact}
          mapUrl={listing.mapUrl}
          loading={contactLoading}
          error={persistedContact.error || (reveal.phase === 'error' && !contact)}
          onRetry={persistedContact.error ? persistedContact.retry : reveal.retry}
        />
      </div>
      {alreadyInquired ? <InquirySentDetails listingId={listing.id} /> : null}
      <div id={listingSectionElementId('address')}>
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
      </div>
      <div id={listingSectionElementId('rent')}>
      <p className="mt-4 text-[1.35rem] font-semibold text-navy">
        <ListingPrice
          amount={listing.startingPrice}
          suffix={t(`discovery.priceBasis.${listing.priceBasis ?? ''}`, {
            defaultValue: priceBasisLabel(listing.priceBasis, listing.type),
          })}
          fallback={t('discovery.priceOnRequest')}
          size="detail"
        />
      </p>
      </div>
      {listing.description ? (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-navy">{t('discovery.aboutPlace')}</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{listing.description}</p>
        </div>
      ) : null}
      {listing.sharingNotes ? (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-navy">{t('discovery.sharing')}</h3>
          <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{listing.sharingNotes}</p>
        </div>
      ) : null}
      <div id={listingSectionElementId('amenities')}>
      {listing.amenityCodes.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-navy">{t('discovery.amenities')}</h3>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {listing.amenityCodes.map((code, index) => {
              const label = amenityDisplayLabel(code, listing.amenityLabels?.[index], t);
              const Icon = amenityIcon(code);
              return (
                <li key={`${code}-${label}-${index}`} className="inline-flex min-w-0 items-center gap-2 text-[12px] text-text-secondary">
                  <Icon aria-hidden className="h-4 w-4 shrink-0 text-register" />
                  <span className="truncate">{label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      </div>
      <ListingUnavailableDetails hidePhotos={hasActualListingPhotos(meta.images)} />
      {isOwnListing ? null : (
      <PhotoRequestAction
        kind="property"
        name={listing.name}
        spaceType={listing.type}
        location={address}
        photoUrls={meta.images}
        phones={
          contact
            ? [contact.mobileNumber, contact.alternateMobileNumber, contact.additionalMobileNumber]
            : []
        }
        contactAuthorized={Boolean(contact)}
        onBeforeOpen={() => extras.hold('photos')}
        openToken={extras.photoOpenToken}
        onNeedContact={contact || contactViewed ? undefined : onEnquire}
      />
      )}
      <div className="mt-auto pt-5">
        <ListingCardMeta
          listing={listing}
          showMaps={Boolean(listing.mapUrl?.trim())}
          mapHref={extras.allowed ? listing.mapUrl : undefined}
          onEnquire={extras.allowed ? undefined : () => extras.hold('map')}
          chips={
            <ListingInfoChips
              listing={listing}
              variant="detail"
              onSelect={scrollToListingSection}
            />
          }
        />
        <ListingContactCta
          listingId={listing.id}
          listingName={listing.name}
          phase={isOwnListing ? 'own' : reveal.phase}
          alreadyInquired={alreadyInquired}
          contactViewed={contactViewed}
          sendingEnquiry={sendingEnquiry}
          sentToEmail={inquiry?.sentToEmail}
          onEnquire={onEnquire}
        />
        <Link to={`/places/${listing.id}`} className="mt-3 block text-center text-[13px] font-semibold text-primary hover:underline">
          {t('discovery.openFullPage')}
        </Link>
      </div>
      {extras.dialog}
    </div>
  );
}
