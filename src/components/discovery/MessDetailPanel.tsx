import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, Users, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../common/ActionButton';
import { formatListingAddress } from '../../data/listings/query';
import type { MessListing } from '../../data/listings/types';
import { ListingGallery } from './ListingGallery';
import { ListingMapLink } from './ListingMapLink';
import { ListingPrice } from './ListingPrice';

type MessDetailPanelProps = {
  listing: MessListing;
  onEnquire: () => void;
};

export function MessDetailPanel({ listing, onEnquire }: MessDetailPanelProps) {
  const { t } = useTranslation();
  const meta = listing.listingMetadata;
  const meals = meta.mealsServed;
  const address = formatListingAddress(listing);

  return (
    <div className="flex h-full flex-col">
      <div key={listing.id}>
        <ListingGallery images={meta.images} name={listing.name} />
      </div>
      <h2 className="mt-4 text-[1.35rem] font-semibold tracking-tight text-navy">{listing.name}</h2>
      {address ? (
        <p className="mt-2 flex items-start gap-1.5 text-[13px] text-text-secondary">
          <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          {address}
        </p>
      ) : null}
      <p className="mt-4 text-[1.35rem] font-semibold text-navy">
        <ListingPrice
          amount={listing.monthlyPrice}
          suffix={t('discovery.perMonth')}
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
      {address ? (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-navy">{t('discovery.location')}</h3>
          <ListingMapLink listing={listing} compact />
        </div>
      ) : null}
      <div className="mt-auto pt-5">
        <ActionButton onClick={onEnquire} className="w-full">
          <MessageCircle aria-hidden className="h-4 w-4" />
          {t('discovery.contactEnquire')}
        </ActionButton>
        <Link to={`/meals/${listing.id}`} className="mt-3 block text-center text-[13px] font-semibold text-primary hover:underline">
          {t('discovery.openFullPage')}
        </Link>
      </div>
    </div>
  );
}
