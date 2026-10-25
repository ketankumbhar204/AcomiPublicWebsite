import { useState, type ReactNode } from 'react';
import { Heart, Home, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAlreadyInquired, useContactViewed } from '../../auth/useAlreadyInquired';
import { getPropertyTypeOption } from '../../constants/propertyRegistration';
import { useIsEnquirySending } from '../../context/EnquiryFeedbackContext';
import { formatListingAddress } from '../../data/listings/query';
import { isVerifiedListingImageUrl } from '../../data/listings/representativeImage';
import type { PropertyListing } from '../../data/listings/types';
import { ActionButton } from '../common/ActionButton';
import { GetContactDetailsButton } from './GetContactDetailsButton';
import { ListingFacts } from './ListingFacts';
import { ListingCover } from './ListingCover';
import { ContactViewedButton, InquirySentBadge, InquirySentButton } from './InquirySentBadge';
import { ListingInfoChips } from './ListingInfoChips';
import { ListingPrice } from './ListingPrice';
import { priceBasisLabel } from '../../lib/priceBasis';
import type { ListingSection } from '../../data/listings/listingInfo';

type PropertyCardProps = {
  listing: PropertyListing;
  selected?: boolean;
  saved?: boolean;
  onSelect: () => void;
  /** Opens details and scrolls to this section. Falls back to onSelect. */
  onOpenSection?: (section: ListingSection) => void;
  onToggleSave: () => void;
  onEnquire: () => void;
  /** Replaces the detail and contact buttons. The rest of the card stays the same. */
  actions?: ReactNode;
};

export function PropertyCard({
  listing,
  selected = false,
  saved = false,
  onSelect,
  onOpenSection,
  onToggleSave,
  onEnquire,
  actions,
}: PropertyCardProps) {
  const { t } = useTranslation();
  const formatted = formatListingAddress(listing);
  const place =
    listing.locality && listing.city && listing.locality !== listing.city
      ? `${listing.locality}, ${listing.city}`
      : formatted;
  const cta = t('discovery.getContactDetails');
  const viewDetails = t('discovery.viewDetails', { defaultValue: 'View Details' });
  const alreadyInquired = useAlreadyInquired(listing.id);
  const contactViewed = useContactViewed(listing.id);
  const sendingEnquiry = useIsEnquirySending(listing.id);
  const photos = listing.listingMetadata.images.filter((url) => isVerifiedListingImageUrl(url));
  const [photoIndex, setPhotoIndex] = useState(0);
  const activePhoto = photos.length > 0 ? photos[Math.min(photoIndex, photos.length - 1)] : undefined;
  const typeOption = getPropertyTypeOption(listing.type);

  return (
    <article
      className={`flex h-full min-w-0 flex-col rounded-2xl border bg-white shadow-[var(--shadow-sm)] transition ${
        actions ? 'overflow-visible' : 'overflow-hidden'
      } ${
        selected ? 'border-register ring-2 ring-register/25' : 'border-black/5 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]'
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-[#F3FBF7]">
        <button type="button" onClick={onSelect} className="absolute inset-0 z-0 block">
          <ListingCover
            listingId={listing.id}
            spaceType={listing.type}
            listingImageUrl={activePhoto}
            className="h-full w-full"
          />
        </button>
        <span className="pointer-events-none absolute top-3 left-3 z-10 inline-flex max-w-[calc(100%-4.75rem)] items-center gap-1 rounded-full border border-black/10 bg-white px-2.5 py-1.5 text-[11px] leading-none font-bold tracking-wide text-[#0F6B4C] uppercase shadow-[0_2px_8px_rgba(15,23,42,0.18)]">
          <Home aria-hidden className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{typeOption.title}</span>
        </span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            onToggleSave();
          }}
          aria-pressed={saved}
          aria-label={t(saved ? 'discovery.unsave' : 'discovery.save', { name: listing.name })}
          className="absolute top-2.5 right-2.5 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-navy shadow-[0_2px_8px_rgba(15,23,42,0.18)]"
        >
          <Heart aria-hidden className={`h-4 w-4 ${saved ? 'fill-coral text-coral' : ''}`} />
        </button>
        {photos.length > 1 ? (
          <>
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
              {photos.map((url, index) => (
                <button
                  key={`${url}-${index}`}
                  type="button"
                  aria-label={`Show photo ${index + 1} of ${photos.length}`}
                  aria-current={index === Math.min(photoIndex, photos.length - 1)}
                  onClick={() => setPhotoIndex(index)}
                  className={`pointer-events-auto h-1.5 w-1.5 rounded-full ${
                    index === Math.min(photoIndex, photos.length - 1) ? 'bg-white' : 'bg-white/55'
                  }`}
                />
              ))}
            </div>
            <span className="pointer-events-none absolute right-3 bottom-3 z-10 rounded-md bg-black/55 px-1.5 py-0.5 text-[11px] font-semibold text-white">
              {`${Math.min(photoIndex, photos.length - 1) + 1}/${photos.length}`}
            </span>
          </>
        ) : null}
        {alreadyInquired ? (
          <div className="pointer-events-none absolute bottom-3 left-3 z-10 max-w-[48%]">
            <InquirySentBadge />
          </div>
        ) : null}
      </div>
      <div className="@container flex flex-1 flex-col gap-2.5 p-4">
        <button type="button" onClick={onSelect} className="block w-full min-w-0 text-left hover:text-primary">
          <h2 className="line-clamp-2 text-[18px] leading-[1.25] font-extrabold tracking-tight text-navy">
            {listing.name}
          </h2>
        </button>
        {place && !alreadyInquired ? (
          <button
            type="button"
            onClick={onEnquire}
            className="flex min-h-5 w-full min-w-0 items-center gap-1 text-left text-[13px] text-text-secondary hover:text-primary"
            aria-label={`${cta}: ${listing.name}`}
          >
            <MapPin aria-hidden className="h-3.5 w-3.5 shrink-0 text-[#5F7368]" />
            <span className="truncate">{place}</span>
          </button>
        ) : (
          <p className="flex min-h-5 items-center gap-1 text-[13px] text-text-secondary">
            {place ? (
              <>
                <MapPin aria-hidden className="h-3.5 w-3.5 shrink-0 text-[#5F7368]" />
                <span className="truncate">{place}</span>
              </>
            ) : null}
          </p>
        )}
        <button
          type="button"
          onClick={alreadyInquired ? onSelect : onEnquire}
          className="w-full text-left text-[18px] font-extrabold tracking-tight text-navy hover:text-primary"
          aria-label={alreadyInquired ? `${viewDetails}: ${listing.name}` : `${cta}: ${listing.name}`}
        >
          <ListingPrice
            amount={listing.startingPrice}
            suffix={t(`discovery.priceBasis.${listing.priceBasis ?? ''}`, {
              defaultValue: priceBasisLabel(listing.priceBasis, listing.type),
            })}
            fallback={t('discovery.priceOnRequest')}
          />
        </button>
        <ListingFacts
          appearance="pills"
          genderPolicy={listing.genderPolicy}
          sharingNotes={listing.sharingNotes}
          foodAvailability={listing.foodAvailability}
        />
        <div className="rounded-[14px] bg-[#F3FBF7] px-3 py-3">
          <ListingInfoChips
            listing={listing}
            variant="card"
            onViewAll={onSelect}
            onSelect={(section) => (onOpenSection ? onOpenSection(section) : onSelect())}
            onEnquire={alreadyInquired ? undefined : onEnquire}
          />
        </div>
        <div className="mt-auto flex flex-row items-stretch gap-2 pt-0.5">
          {actions ?? (
          <>
          <ActionButton
            variant="outline"
            onClick={onSelect}
            className="!h-11 min-w-0 flex-[0.82] !rounded-xl bg-white !px-2 !text-[13px] whitespace-nowrap"
            aria-label={`${viewDetails}: ${listing.name}`}
          >
            {viewDetails}
          </ActionButton>
          {contactViewed && !sendingEnquiry ? (
            <ContactViewedButton onClick={onSelect} className="h-11 min-w-0 flex-[1.18]" />
          ) : alreadyInquired && !sendingEnquiry ? (
            <InquirySentButton onClick={onSelect} className="h-11 min-w-0 flex-[1.18]" />
          ) : (
            <GetContactDetailsButton
              listingId={listing.id}
              onClick={onEnquire}
              className="!h-11 min-w-0 flex-[1.18] !rounded-xl !px-2 !text-[13px] whitespace-nowrap"
              aria-label={`${cta}: ${listing.name}`}
            />
          )}
          </>
          )}
        </div>
      </div>
    </article>
  );
}
