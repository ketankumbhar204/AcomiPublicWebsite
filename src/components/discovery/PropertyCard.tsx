import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAlreadyInquired, useInquirySentVia } from '../../auth/useAlreadyInquired';
import { formatListingAddress } from '../../data/listings/query';
import type { PropertyListing } from '../../data/listings/types';
import { ActionButton } from '../common/ActionButton';
import { ListingCardMeta } from './ListingCardMeta';
import { ListingCover } from './ListingCover';
import { InquirySentBadge, InquirySentButton } from './InquirySentBadge';
import { ListingInfoChips } from './ListingInfoChips';
import { ListingPrice } from './ListingPrice';

type PropertyCardProps = {
  listing: PropertyListing;
  selected?: boolean;
  saved?: boolean;
  onSelect: () => void;
  onToggleSave: () => void;
  onEnquire: () => void;
};

export function PropertyCard({
  listing,
  selected = false,
  saved = false,
  onSelect,
  onToggleSave,
  onEnquire,
}: PropertyCardProps) {
  const { t } = useTranslation();
  const formatted = formatListingAddress(listing);
  const place =
    listing.locality && listing.city && listing.locality !== listing.city
      ? `${listing.locality}, ${listing.city}`
      : formatted;
  const cta = t('discovery.getContactDetails');
  const viewLabel = t('discovery.view', { defaultValue: 'View' });
  const viewDetails = t('discovery.viewDetails', { defaultValue: 'View details' });
  const alreadyInquired = useAlreadyInquired(listing.id);
  const sentVia = useInquirySentVia(listing.id);

  return (
    <article
      className={`flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border bg-white shadow-[var(--shadow-sm)] transition ${
        selected ? 'border-register ring-2 ring-register/25' : 'border-black/5 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <button type="button" onClick={onSelect} className="block h-full w-full">
          <ListingCover
            listingId={listing.id}
            spaceType={listing.type}
            listingImageUrl={listing.listingMetadata.images[0]}
            className="h-full w-full"
          />
        </button>
        <div className="absolute top-3 left-3 flex max-w-[calc(100%-3.25rem)] flex-wrap items-center gap-1.5">
          <span className="rounded-md bg-white/95 px-2 py-1 text-[11px] font-semibold tracking-wide text-navy uppercase">
            {t(`discovery.propertyTypes.${listing.type}`)}
          </span>
          {alreadyInquired ? <InquirySentBadge /> : null}
        </div>
        <button
          type="button"
          onClick={onToggleSave}
          aria-pressed={saved}
          aria-label={t(saved ? 'discovery.unsave' : 'discovery.save', { name: listing.name })}
          className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-navy shadow-sm"
        >
          <Heart aria-hidden className={`h-4 w-4 ${saved ? 'fill-coral text-coral' : ''}`} />
        </button>
      </div>
      <div className="@container flex flex-1 flex-col p-3.5">
        <button type="button" onClick={onSelect} className="w-full text-left">
          <h2 className="line-clamp-2 text-[16px] font-semibold tracking-tight text-navy">{listing.name}</h2>
          {alreadyInquired ? (
            <span className="mt-1 block">
              <InquirySentBadge variant="inline" sentVia={sentVia} />
            </span>
          ) : null}
        </button>
        {place && !alreadyInquired ? (
          <button
            type="button"
            onClick={onEnquire}
            className="mt-1 line-clamp-2 w-full text-left text-[13px] text-text-secondary underline decoration-black/15 underline-offset-2 hover:text-primary hover:decoration-primary"
            aria-label={`${cta}: ${listing.name}`}
          >
            {place}
          </button>
        ) : place ? (
          <p className="mt-1 line-clamp-2 text-[13px] text-text-secondary">{place}</p>
        ) : null}
        <button type="button" onClick={onSelect} className="w-full text-left">
          <p className="mt-2 text-[16px] font-semibold text-navy">
            <ListingPrice
              amount={listing.startingPrice}
              suffix={t(`discovery.priceSuffix.${listing.type}`)}
              fallback={t('discovery.priceOnRequest')}
            />
          </p>
        </button>
        <ListingCardMeta
          listing={listing}
          showMaps={false}
          onEnquire={alreadyInquired ? undefined : onEnquire}
          chips={<ListingInfoChips listing={listing} variant="card" onEnquire={alreadyInquired ? undefined : onEnquire} />}
        />
        <div className="mt-auto flex flex-col gap-2 pt-3 @min-[260px]:flex-row">
          <ActionButton
            variant="outline"
            onClick={onSelect}
            className="h-10 w-full shrink-0 whitespace-nowrap px-3 text-[13px] @min-[260px]:w-auto"
            aria-label={`${viewDetails}: ${listing.name}`}
          >
            {viewLabel}
          </ActionButton>
          {alreadyInquired ? (
            <InquirySentButton className="@min-[260px]:w-auto @min-[260px]:grow" />
          ) : (
            <ActionButton
              onClick={onEnquire}
              className="h-10 w-full shrink-0 whitespace-nowrap px-3 text-[13px] @min-[260px]:w-auto @min-[260px]:grow"
              aria-label={`${cta}: ${listing.name}`}
            >
              {cta}
            </ActionButton>
          )}
        </div>
      </div>
    </article>
  );
}
