import type { PropertyType } from '../../api/types';

/**
 * Field mapping
 *
 * Discover API → listing (customer-facing)
 * spaceId                      → id
 * type                         → type
 * name                         → name
 * description                  → description
 * addressLine / address        → addressLine
 * city / state / pincode       → city / state / pincode
 * (locality parsed from address for display)
 * mapUrl                       → mapUrl
 * startingPrice / monthlyPrice → startingPrice / monthlyPrice
 * mealPrice                    → mealPrice (mess only)
 *
 * Never shown: ownerName, mobileNumber, internal registration reference.
 *
 * listingMetadata.images holds verified listing photos only.
 * Category representative images are resolved at display time and are never stored as listing photos.
 * Ratings, availability, and capacity are omitted — the API does not provide them.
 */

export type PropertyListingType = Exclude<PropertyType, 'MESS'>;

export type ListingMetadata = {
  rating?: number;
  reviewCount?: number;
  images: string[];
  featuredRank?: number;
  listedAt?: string;
};

export type PropertyListing = {
  id: string;
  type: PropertyListingType;
  name: string;
  description: string;
  addressLine: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  mapUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
  startingPrice: number | null;
  capacityEstimate: number | null;
  amenityCodes: string[];
  foodIncludedInRent?: boolean;
  hasContact?: boolean;
  hasMobileContact?: boolean;
  sharingNotes?: string;
  listingMetadata: ListingMetadata & { availableCount?: number | null };
};

export type MessListing = {
  id: string;
  name: string;
  description: string;
  addressLine: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  mapUrl?: string;
  latitude?: number | null;
  longitude?: number | null;
  monthlyPrice: number | null;
  mealPrice: number | null;
  amenityCodes?: string[];
  foodIncludedInRent?: boolean;
  hasContact?: boolean;
  hasMobileContact?: boolean;
  capacityEstimate: number | null;
  listingMetadata: ListingMetadata & {
    mealsServed: string[];
  };
};

export type PropertySort = 'recommended' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest';

export type PropertyQuery = {
  query: string;
  types: PropertyListingType[];
  localities: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;
  amenities: string[];
  sort: PropertySort;
};

export type MessQuery = {
  query: string;
  localities: string[];
  minMonthly: number | null;
  maxMonthly: number | null;
  minMeal: number | null;
  maxMeal: number | null;
  minRating: number | null;
  sort: PropertySort;
};
