import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../common/ActionButton';
import { formatListingAddress } from '../../data/listings/query';
import type { PropertyListing } from '../../data/listings/types';
import { amenityIcon } from './listingIcons';
import { ListingCardMeta } from './ListingCardMeta';
import { ListingGallery } from './ListingGallery';
import { ListingInfoChips } from './ListingInfoChips';
import { ListingPrice } from './ListingPrice';

type PropertyDetailPanelProps = {
  listing: PropertyListing;
  onEnquire: () => void;
};

export function PropertyDetailPanel({ listing, onEnquire }: PropertyDetailPanelProps) {
  const { t } = useTranslation();
  const meta = listing.listingMetadata;
  const address = formatListingAddress(listing);
  const cta = t('discovery.getContactDetails');

  return (
    <div className="flex h-full flex-col">
      <div key={listing.id}>
        <ListingGallery
          listingId={listing.id}
          spaceType={listing.type}
          images={meta.images}
          name={listing.name}
        />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-soft px-2 py-1 text-[11px] font-semibold tracking-wide text-navy uppercase">
          {t(`discovery.propertyTypes.${listing.type}`)}
        </span>
      </div>
      <h2 className="mt-2 text-[1.35rem] font-semibold tracking-tight text-navy">{listing.name}</h2>
      {address ? (
        <p className="mt-2 flex items-start gap-1.5 text-[13px] text-text-secondary">
          <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
          {address}
        </p>
      ) : null}
      <p className="mt-4 text-[1.35rem] font-semibold text-navy">
        <ListingPrice
          amount={listing.startingPrice}
          suffix={t(`discovery.priceSuffix.${listing.type}`)}
          fallback={t('discovery.priceOnRequest')}
          size="detail"
        />
      </p>
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
      <div className="mt-auto pt-5">
        <ListingCardMeta
          listing={listing}
          onEnquire={onEnquire}
          chips={<ListingInfoChips listing={listing} variant="detail" onEnquire={onEnquire} />}
        />
        <ActionButton onClick={onEnquire} className="mt-4 w-full" aria-label={`${cta}: ${listing.name}`}>
          {cta}
        </ActionButton>
        <Link to={`/places/${listing.id}`} className="mt-3 block text-center text-[13px] font-semibold text-primary hover:underline">
          {t('discovery.openFullPage')}
        </Link>
      </div>
    </div>
  );
}
