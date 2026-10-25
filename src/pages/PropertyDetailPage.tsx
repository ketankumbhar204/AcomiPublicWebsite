import { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ButtonLink } from '../components/common/ButtonLink';
import { useAlreadyInquired, useContactViewed, useInquiryRecord } from '../auth/useAlreadyInquired';
import { useDirectContactReveal } from '../auth/useDirectContactReveal';
import { useIsEnquirySending } from '../context/EnquiryFeedbackContext';
import { GetContactDetailsButton } from '../components/discovery/GetContactDetailsButton';
import { ListingContactCta } from '../components/discovery/ListingContactCta';
import { EnquireDialog } from '../components/discovery/EnquireDialog';
import { OwnerContactCard, type RevealedOwnerContact } from '../components/discovery/OwnerContactCard';
import { usePersistedRevealedContact } from '../components/discovery/usePersistedRevealedContact';
import { InquirySentBadge, InquirySentDetails } from '../components/discovery/InquirySentBadge';
import { ListingCardMeta } from '../components/discovery/ListingCardMeta';
import { ListingMapLink } from '../components/discovery/ListingMapLink';
import { ListingFacts } from '../components/discovery/ListingFacts';
import { priceBasisLabel } from '../lib/priceBasis';
import { amenityDisplayLabel, amenityIcon } from '../components/discovery/listingIcons';
import { ListingGallery } from '../components/discovery/ListingGallery';
import { ListingSaveButton } from '../components/discovery/ListingSaveButton';
import { OwnerListingActions, useMyListing } from '../components/discovery/OwnerListingActions';
import { ListingInfoChips } from '../components/discovery/ListingInfoChips';
import { ListingUnavailableDetails } from '../components/discovery/ListingUnavailableDetails';
import { PhotoRequestAction } from '../components/discovery/PhotoRequestAction';
import { useListingExtrasGate } from '../components/discovery/useListingExtrasGate';
import { hasActualListingPhotos } from '../lib/photoRequest';
import { ListingPrice } from '../components/discovery/ListingPrice';
import { Container } from '../components/layout/Container';
import { getDiscoverSpaceDetail } from '../data/listings/discoverApi';
import { formatListingAddress } from '../data/listings';
import { isListingSection, listingSectionElementId } from '../data/listings/listingInfo';
import { toPropertyListing } from '../data/listings/mapDiscoverListing';
import type { PropertyListing } from '../data/listings/types';
import { applySeo } from '../lib/seo';
import { takeEnquireResumeIntentForListing } from '../auth/enquireIntent';
import { scrollToListingSection, useScrollToListingSection } from '../lib/scrollToListingSection';

export function PropertyDetailPage() {
  const { t } = useTranslation();
  const { id = '' } = useParams();
  const [searchParams] = useSearchParams();
  const requestedSection = searchParams.get('section');
  const focusSection = isListingSection(requestedSection) ? requestedSection : null;
  const [listing, setListing] = useState<PropertyListing | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'missing'>('loading');
  const [listingVersion, setListingVersion] = useState(0);
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [revealedContact, setRevealedContact] = useState<RevealedOwnerContact | null>(null);
  const alreadyInquired = useAlreadyInquired(listing?.id);
  const contactViewed = useContactViewed(listing?.id);
  const inquiry = useInquiryRecord(listing?.id);
  const reveal = useDirectContactReveal(listing?.id, status === 'ready');
  const persistedContact = usePersistedRevealedContact(listing?.id ?? '', reveal.contact ?? revealedContact);
  const contact = persistedContact.contact;
  const contactLoading =
    persistedContact.loading || ((reveal.phase === 'checking' || reveal.phase === 'revealing') && !contact);
  const mine = useMyListing(listing?.id);
  const isOwnListing = reveal.phase === 'own' || Boolean(mine);
  const unlocked = Boolean(contact) || contactViewed || alreadyInquired || isOwnListing;
  const extras = useListingExtrasGate(listing?.id ?? '', Boolean(contact) || contactViewed || alreadyInquired);
  extras.mapHrefRef.current = listing?.mapUrl ?? '';
  const sendingEnquiry = useIsEnquirySending(listing?.id ?? '');
  useScrollToListingSection(focusSection, status === 'ready' && Boolean(listing));

  const listingRequest = useRef('');

  useEffect(() => {
    let cancelled = false;
    const switchingListing = listingRequest.current !== id;
    listingRequest.current = id;
    if (switchingListing || listingVersion === 0) {
      setStatus('loading');
      setListing(null);
      setRevealedContact(null);
    }
    void getDiscoverSpaceDetail(id)
      .then((detail) => {
        if (cancelled) return;
        const mapped = toPropertyListing(detail);
        setListing(mapped);
        setStatus(mapped ? 'ready' : 'missing');
      })
      .catch(() => {
        if (cancelled) return;
        setListing(null);
        setStatus('missing');
      });
    return () => {
      cancelled = true;
    };
  }, [id, listingVersion]);

  useEffect(() => {
    if (!listing?.id) return;
    const intent = takeEnquireResumeIntentForListing(listing.id);
    if (intent) {
      setEnquireOpen(true);
    }
  }, [listing?.id]);

  useEffect(() => {
    if (status === 'loading') {
      return;
    }
    if (status !== 'ready' || !listing) {
      applySeo({
        title: t('propertyDetail.seoNotFound.title'),
        description: t('propertyDetail.seoNotFound.description'),
        path: `/places/${id}`,
      });
      return;
    }
    applySeo({
      title: `${listing.name} — ACOMI`,
      description: `${listing.name}${listing.city ? ` in ${listing.city}` : ''}.`,
      path: `/places/${listing.id}`,
    });
  }, [id, listing, status, t]);

  if (status === 'loading') {
    return (
      <section className="bg-white py-20">
        <Container className="max-w-xl text-center">
          <p className="text-[15px] text-text-secondary">{t('places.loading')}</p>
        </Container>
      </section>
    );
  }

  if (!listing) {
    return (
      <section className="bg-white py-20">
        <Container className="max-w-xl text-center">
          <h1 className="text-[2rem] font-semibold tracking-tight text-navy">
            {t('propertyDetail.notFoundTitle')}
          </h1>
          <p className="mt-3 text-[15px] text-text-secondary">{t('propertyDetail.notFoundBody')}</p>
          <div className="mt-8">
            <ButtonLink href="/places" variant="ghost" external={false}>
              {t('propertyDetail.back')}
            </ButtonLink>
          </div>
        </Container>
      </section>
    );
  }

  const meta = listing.listingMetadata;
  const address = formatListingAddress(listing);

  return (
    <section className="bg-background py-10 sm:py-12">
      <Container>
        <p className="text-[13px] text-text-secondary">
          <Link to="/places" className="font-medium text-primary hover:underline">
            {t('propertyDetail.breadcrumb')}
          </Link>
          <span aria-hidden> / </span>
          {listing.name}
        </p>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
          <ListingGallery
            listingId={listing.id}
            spaceType={listing.type}
            images={meta.images}
            name={listing.name}
          />

          <div className="rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
            <div id={listingSectionElementId('food')}>
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
            {alreadyInquired ? <InquirySentBadge /> : null}
            <div className="mt-3 flex items-start justify-between gap-3">
              <h1 className="text-[1.75rem] font-semibold tracking-tight text-navy">{listing.name}</h1>
              <ListingSaveButton id={listing.id} name={listing.name} kind="places" detail={address} />
            </div>
            <OwnerListingActions
              listing={mine}
              onUpdated={() => setListingVersion((current) => current + 1)}
            />
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
                onClick={() => setEnquireOpen(true)}
                className="mt-2 flex w-full items-center gap-1.5 text-left text-[14px] text-text-secondary underline decoration-black/15 underline-offset-2 hover:text-primary hover:decoration-primary"
                aria-label={`${t('discovery.getContactDetails')}: ${listing.name}`}
              >
                <MapPin aria-hidden className="h-4 w-4 shrink-0 text-muted" />
                {address}
              </button>
            ) : address ? (
              <p className="mt-2 flex items-center gap-1.5 text-[14px] text-text-secondary">
                <MapPin aria-hidden className="h-4 w-4 shrink-0 text-muted" />
                {address}
              </p>
            ) : null}
            </div>
            <div id={listingSectionElementId('rent')}>
            <p className="mt-5 text-[1.5rem] font-semibold text-navy">
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
            {listing.sharingNotes ? (
              <p className="mt-2 text-[14px] text-text-secondary">{listing.sharingNotes}</p>
            ) : null}
            <div className="mt-6">
              <ListingCardMeta
                listing={listing}
                showMaps={Boolean(listing.mapUrl?.trim())}
                mapHref={extras.allowed ? listing.mapUrl : undefined}
                onEnquire={extras.allowed ? undefined : () => extras.hold('map')}
                chips={<ListingInfoChips listing={listing} variant="detail" onSelect={scrollToListingSection} />}
              />
              <ListingContactCta
                listingId={listing.id}
                listingName={listing.name}
                phase={isOwnListing ? 'own' : reveal.phase}
                alreadyInquired={alreadyInquired}
                contactViewed={contactViewed}
                sendingEnquiry={sendingEnquiry}
                sentToEmail={inquiry?.sentToEmail}
                onEnquire={() => setEnquireOpen(true)}
              />
            </div>
          </div>
        </div>

        <div id={listingSectionElementId('amenities')}>
        {listing.amenityCodes.length > 0 ? (
          <div className="mt-8 rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
            <h2 className="text-lg font-semibold text-navy">{t('discovery.amenities')}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {listing.amenityCodes.map((code, index) => {
                const label = amenityDisplayLabel(code, listing.amenityLabels?.[index], t);
                const Icon = amenityIcon(code);
                return (
                  <li
                    key={`${code}-${label}-${index}`}
                    className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border bg-soft px-3 py-1.5 text-[12px] font-medium text-text-secondary"
                  >
                    <Icon aria-hidden className="h-3.5 w-3.5 shrink-0 text-register" />
                    <span className="truncate">{label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
        </div>

        <div className="mt-6 rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
          <ListingUnavailableDetails
            className="space-y-1"
            hidePhotos={hasActualListingPhotos(listing.listingMetadata.images)}
          />
          {isOwnListing ? null : (
          <PhotoRequestAction
            kind="property"
            name={listing.name}
            spaceType={listing.type}
            location={formatListingAddress(listing)}
            photoUrls={listing.listingMetadata.images}
            phones={
              contact
                ? [contact.mobileNumber, contact.alternateMobileNumber, contact.additionalMobileNumber]
                : []
            }
            contactAuthorized={Boolean(contact)}
            onBeforeOpen={() => extras.hold('photos')}
            openToken={extras.photoOpenToken}
            onNeedContact={contact || contactViewed ? undefined : () => setEnquireOpen(true)}
          />
          )}
        </div>

        {listing.description ? (
          <div className="mt-6 rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
            <h2 className="text-lg font-semibold text-navy">{t('discovery.aboutPlace')}</h2>
            <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-text-secondary">{listing.description}</p>
          </div>
        ) : null}

        {listing.mapUrl ? (
          <div className="mt-6 rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
            <h2 className="text-lg font-semibold text-navy">{t('discovery.location')}</h2>
            {extras.allowed ? (
              <div className="mt-3">
                <ListingMapLink listing={listing} />
              </div>
            ) : (
              <>
                <p className="mt-3 text-[15px] text-text-secondary">{t('discovery.enquireForMap', { defaultValue: 'Map and exact location are shared after you send an enquiry.' })}</p>
                <GetContactDetailsButton
                  listingId={listing.id}
                  onClick={() => extras.hold('map')}
                  className="mt-4"
                  aria-label={`${t('discovery.openMaps')}: ${listing.name}`}
                />
              </>
            )}
          </div>
        ) : null}
      </Container>
      <EnquireDialog
        open={enquireOpen}
        listingId={listing.id}
        listingName={listing.name}
        listingKind="places"
        onClose={() => setEnquireOpen(false)}
        onOpen={() => setEnquireOpen(true)}
        onViewedHere={(contact) => {
          setRevealedContact(contact);
          setEnquireOpen(false);
        }}
      />
      {extras.dialog}
    </section>
  );
}
