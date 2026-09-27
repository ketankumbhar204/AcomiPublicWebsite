import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatListingAddress } from '../../data/listings/query';
import type { MessListing } from '../../data/listings/types';
import { ActionButton } from '../common/ActionButton';
import { ListingCardMeta } from './ListingCardMeta';
import { ListingCover } from './ListingCover';
import { ListingInfoChips } from './ListingInfoChips';
import { ListingPrice } from './ListingPrice';

type MessCardProps = {
  listing: MessListing;
  selected?: boolean;
  saved?: boolean;
  onSelect: () => void;
  onToggleSave: () => void;
  onEnquire: () => void;
};

export function MessCard({
  listing,
  selected = false,
  saved = false,
  onSelect,
  onToggleSave,
  onEnquire,
}: MessCardProps) {
  const { t } = useTranslation();
  const address = formatListingAddress(listing);
  const cta = t('discovery.getContactDetails');
  const viewDetails = t('discovery.viewDetails', { defaultValue: 'View details' });

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
            spaceType="MESS"
            listingImageUrl={listing.listingMetadata.images[0]}
            className="h-full w-full"
          />
        </button>
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
          <p className="mt-1 line-clamp-2 text-[13px] text-text-secondary">{address || listing.name}</p>
          <p className="mt-2 text-[16px] font-semibold text-navy">
            <ListingPrice
              amount={listing.monthlyPrice}
              suffix={t('discovery.perMonth')}
              fallback={t('discovery.priceOnRequest')}
            />
          </p>
          {listing.mealPrice != null ? (
            <p className="mt-1 text-[13px] font-medium text-navy">
              <ListingPrice amount={listing.mealPrice} suffix={t('discovery.perMeal')} fallback={t('discovery.priceOnRequest')} />
            </p>
          ) : null}
        </button>
        <ListingCardMeta
          listing={listing}
          onEnquire={onEnquire}
          chips={
            <ListingInfoChips
              listing={{ ...listing, mealsServed: listing.listingMetadata.mealsServed }}
              variant="card"
              surface="meals"
              onEnquire={onEnquire}
            />
          }
        />
        <div className="mt-auto flex flex-col gap-2 pt-3">
          <ActionButton
            variant="outline"
            onClick={onSelect}
            className="h-9 w-full px-3 text-[13px]"
            aria-label={`${viewDetails}: ${listing.name}`}
          >
            {viewDetails}
          </ActionButton>
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
