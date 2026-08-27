import { ExternalLink, MapPin } from 'lucide-react';
import { listingMapUrl } from '../../data/listings/query';

type ListingMapLinkProps = {
  listing: {
    mapUrl?: string;
    addressLine: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
  };
  compact?: boolean;
};

export function ListingMapLink({ listing, compact = false }: ListingMapLinkProps) {
  const href = listingMapUrl(listing);

  if (compact) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-register hover:underline"
      >
        <MapPin aria-hidden className="h-4 w-4" />
        Open in Google Maps
        <ExternalLink aria-hidden className="h-3.5 w-3.5" />
      </a>
    );
  }

  return (
    <div>
      <p className="text-[15px] text-text-secondary">
        {listing.addressLine}, {listing.locality}, {listing.city}, {listing.state} {listing.pincode}
      </p>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-register px-4 py-2.5 text-sm font-semibold text-white hover:bg-register-hover"
      >
        <MapPin aria-hidden className="h-4 w-4" />
        Open in Google Maps
      </a>
    </div>
  );
}
