import { Link } from 'react-router-dom';
import { MapPin, MessageCircle, Star, Users, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../common/ActionButton';
import { formatInr } from '../../data/listings/query';
import type { MessListing } from '../../data/listings/types';
import { ListingGallery } from './ListingGallery';
import { ListingMapLink } from './ListingMapLink';

type MessDetailPanelProps = {
  listing: MessListing;
  onEnquire: () => void;
};

export function MessDetailPanel({ listing, onEnquire }: MessDetailPanelProps) {
  const { t } = useTranslation();
  const meta = listing.listingMetadata;
  const meals = meta.mealsServed;

  return (
    <div className="flex h-full flex-col">
      <div key={listing.id}>
        <ListingGallery images={meta.images} name={listing.name} />
      </div>
      <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-navy">
        <Star aria-hidden className="h-3.5 w-3.5 fill-register text-register" />
        {meta.rating.toFixed(1)}
      </span>
      <h2 className="mt-2 text-[1.35rem] font-semibold tracking-tight text-navy">{listing.name}</h2>
      <p className="mt-2 flex items-start gap-1.5 text-[13px] text-text-secondary">
        <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
        {listing.addressLine}, {listing.locality}, {listing.city}, {listing.state} {listing.pincode}
      </p>
      <p className="mt-4 text-[1.35rem] font-semibold text-navy">
        {formatInr(listing.monthlyPrice)}
        <span className="ml-1 text-[12px] font-medium text-muted">{t('discovery.perMonth')}</span>
      </p>
      <p className="mt-1 text-[14px] font-medium text-navy">
        {formatInr(listing.mealPrice)}
        <span className="ml-1 text-[12px] font-medium text-muted">{t('discovery.perMeal')}</span>
      </p>
      <ul className="mt-4 grid grid-cols-2 gap-2">
        <li className="rounded-xl bg-soft px-3 py-2 text-[12px] font-medium text-navy">
          <Users aria-hidden className="mb-1 h-4 w-4 text-register" />
          {t('discovery.customersAbout', { count: listing.capacityEstimate })}
        </li>
        {meals.length > 0 ? (
          <li className="rounded-xl bg-soft px-3 py-2 text-[12px] font-medium text-navy">
            <UtensilsCrossed aria-hidden className="mb-1 h-4 w-4 text-register" />
            {meals.map((meal) => t(`meals.${meal.toLowerCase()}`)).join(' + ')}
          </li>
        ) : null}
      </ul>
      <div className="mt-5">
        <h3 className="text-sm font-semibold text-navy">{t('discovery.aboutMess')}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">{listing.description}</p>
      </div>
      {meals.length > 0 ? (
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-navy">{t('discovery.whatsIncluded')}</h3>
          <p className="mt-2 text-[13px] text-text-secondary">
            {meals.map((meal) => t(`meals.${meal.toLowerCase()}`)).join(', ')}
          </p>
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
        <Link to={`/meals/${listing.id}`} className="mt-3 block text-center text-[13px] font-semibold text-primary hover:underline">
          {t('discovery.openFullPage')}
        </Link>
      </div>
    </div>
  );
}
