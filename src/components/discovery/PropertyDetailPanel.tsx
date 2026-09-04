import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, Star, Users, Wifi, UtensilsCrossed, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../common/ActionButton';
import { formatInr } from '../../data/listings/query';
import type { PropertyListing } from '../../data/listings/types';
import { amenityIcon, propertyAvailabilityLabel } from './listingIcons';
import { ListingGallery } from './ListingGallery';
import { ListingMapLink } from './ListingMapLink';

type PropertyDetailPanelProps = {
  listing: PropertyListing;
  onEnquire: () => void;
};

export function PropertyDetailPanel({ listing, onEnquire }: PropertyDetailPanelProps) {
  const { t } = useTranslation();
  const meta = listing.listingMetadata;
  const facts = [
    { label: propertyAvailabilityLabel(listing, t), Icon: Users },
    listing.amenityCodes.includes('FOOD_INCLUDED')
      ? { label: t('discovery.mealsAvailable'), Icon: UtensilsCrossed }
      : null,
    listing.amenityCodes.includes('WIFI') ? { label: t('discovery.amenity.WIFI'), Icon: Wifi } : null,
    listing.amenityCodes.includes('POWER_BACKUP') ? { label: t('discovery.amenity.POWER_BACKUP'), Icon: Zap } : null,
  ].filter((item): item is { label: string; Icon: typeof Users } => item != null);

  return (
    <div className="flex h-full flex-col">
      <div key={listing.id}>
        <ListingGallery images={meta.images} name={listing.name} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-soft px-2 py-1 text-[11px] font-semibold tracking-wide text-navy uppercase">
          {t(`discovery.propertyTypes.${listing.type}`)}
        </span>
        <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-navy">
          <Star aria-hidden className="h-3.5 w-3.5 fill-register text-register" />
          {meta.rating.toFixed(1)}
        </span>
      </div>
      <h2 className="mt-2 text-[1.35rem] font-semibold tracking-tight text-navy">{listing.name}</h2>
      <p className="mt-2 flex items-start gap-1.5 text-[13px] text-text-secondary">
        <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
        {listing.addressLine}, {listing.locality}, {listing.city}, {listing.state} {listing.pincode}
      </p>
      <p className="mt-4 text-[1.35rem] font-semibold text-navy">
        {formatInr(listing.startingPrice)}
        <span className="ml-1 text-[12px] font-medium text-muted">
          {t(`discovery.priceSuffix.${listing.type}`)}
        </span>
      </p>
      {facts.length > 0 ? (
        <ul className="mt-4 grid grid-cols-2 gap-2">
          {facts.map((fact) => (
            <li key={fact.label} className="rounded-xl bg-soft px-3 py-2 text-[12px] font-medium text-navy">
              <fact.Icon aria-hidden className="mb-1 h-4 w-4 text-register" />
              {fact.label}
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-5">
        <h3 className="text-sm font-semibold text-navy">{t('discovery.aboutPlace')}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{listing.description}</p>
      </div>
      {listing.amenityCodes.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-navy">{t('discovery.amenities')}</h3>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {listing.amenityCodes.map((code) => {
              const Icon = amenityIcon(code);
              return (
                <li key={code} className="inline-flex items-center gap-2 text-[12px] text-text-secondary">
                  <Icon aria-hidden className="h-4 w-4 text-register" />
                  {t(`discovery.amenity.${code}`)}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
      <div className="mt-5">
        <h3 className="text-sm font-semibold text-navy">{t('discovery.location')}</h3>
        <ListingMapLink listing={listing} compact />
      </div>
      <p className="mt-3 text-[11px] text-muted">{t('discovery.sampleRatings')}</p>
      <div className="mt-auto pt-5">
        <ActionButton onClick={onEnquire} className="w-full">
          <MessageCircle aria-hidden className="h-4 w-4" />
          {t('discovery.contactEnquire')}
        </ActionButton>
        <Link to={`/places/${listing.id}`} className="mt-3 block text-center text-[13px] font-semibold text-primary hover:underline">
          {t('discovery.openFullPage')}
        </Link>
      </div>
    </div>
  );
}
