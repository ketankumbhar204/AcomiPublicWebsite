import { Heart, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatListingAddress } from '../../data/listings/query';
import type { PropertyListing } from '../../data/listings/types';
import { ActionButton } from '../common/ActionButton';
import { ListingCover } from './ListingCover';
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
  const place = listing.locality && listing.city && listing.locality !== listing.city
    ? `${listing.locality}, ${listing.city}`
    : formatListingAddress(listing) || listing.name;
  const cta = t('discovery.getContactDetails');

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
        <span className="absolute top-3 left-3 rounded-md bg-white/95 px-2 py-1 text-[11px] font-semibold tracking-wide text-navy uppercase">
          {t(`discovery.propertyTypes.${listing.type}`)}
        </span>
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
      <div className="flex flex-1 flex-col p-3.5">
        <button type="button" onClick={onSelect} className="w-full text-left">
          <h2 className="line-clamp-2 text-[16px] font-semibold tracking-tight text-navy">{listing.name}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-text-secondary">
            <MapPin aria-hidden className="h-3.5 w-3.5 shrink-0 text-muted" />
            <span className="line-clamp-2">{place}</span>
          </p>
          <p className="mt-2 text-[16px] font-semibold text-navy">
            <ListingPrice
              amount={listing.startingPrice}
              suffix={t(`discovery.priceSuffix.${listing.type}`)}
              fallback={t('discovery.priceOnRequest')}
            />
          </p>
        </button>
        <div className="mt-2">
          <ListingInfoChips listing={listing} variant="card" />
        </div>
        <div className="mt-auto pt-3">
          <ActionButton
            onClick={onEnquire}
            className="h-9 w-full px-3 text-[13px]"
            aria-label={`${cta}: ${listing.name}`}
          >
            {cta}
          </ActionButton>
        </div>
      </div>
    </article>
  );
}
