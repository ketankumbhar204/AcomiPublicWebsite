import { Heart, MapPin, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatInr } from '../../data/listings/query';
import type { PropertyListing } from '../../data/listings/types';
import { amenityIcon, propertyAvailabilityLabel } from './listingIcons';
import { ListingImage } from './ListingImage';

type PropertyCardProps = {
  listing: PropertyListing;
  selected?: boolean;
  saved?: boolean;
  onSelect: () => void;
  onToggleSave: () => void;
};

export function PropertyCard({ listing, selected = false, saved = false, onSelect, onToggleSave }: PropertyCardProps) {
  const { t } = useTranslation();
  const cover = listing.listingMetadata.images[0];
  const shownAmenities = listing.amenityCodes.slice(0, 4);

  return (
    <article
      className={`min-w-0 overflow-hidden rounded-2xl border bg-white shadow-[var(--shadow-sm)] transition ${
        selected ? 'border-register ring-2 ring-register/25' : 'border-black/5 hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <button type="button" onClick={onSelect} className="block h-full w-full">
          <ListingImage src={cover} alt="" className="h-full w-full" />
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
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-register px-2 py-1 text-[12px] font-semibold text-white">
          <Star aria-hidden className="h-3.5 w-3.5 fill-white" />
          {listing.listingMetadata.rating.toFixed(1)}
        </span>
      </div>
      <button type="button" onClick={onSelect} className="flex w-full flex-col p-4 text-left">
        <h2 className="text-[16px] font-semibold tracking-tight text-navy">{listing.name}</h2>
        <p className="mt-1 flex items-center gap-1.5 text-[13px] text-text-secondary">
          <MapPin aria-hidden className="h-3.5 w-3.5 shrink-0 text-muted" />
          {listing.locality}, {listing.city}
        </p>
        <p className="mt-3 text-[16px] font-semibold text-navy">
          {formatInr(listing.startingPrice)}
          <span className="ml-1 text-[12px] font-medium text-muted">
            {t(`discovery.priceSuffix.${listing.type}`)}
          </span>
        </p>
        <p className="mt-1 text-[13px] text-text-secondary">
          {propertyAvailabilityLabel(listing, t)}
        </p>
        {shownAmenities.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-2">
            {shownAmenities.map((code) => {
              const Icon = amenityIcon(code);
              return (
                <li key={code} className="inline-flex items-center gap-1 text-[11px] text-muted">
                  <Icon aria-hidden className="h-3.5 w-3.5" />
                  <span>{t(`discovery.amenity.${code}`)}</span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </button>
    </article>
  );
}
