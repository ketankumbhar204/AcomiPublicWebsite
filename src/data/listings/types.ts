import type { PropertyType } from '../../api/types';

/**
 * Field mapping
 *
 * Registration → listing (customer-facing)
 * propertyType / mess          → type
 * propertyName / messName      → name
 * description                  → description
 * addressLine                  → addressLine
 * city / state / pincode      → city / state / pincode
 * (locality parsed from address for display)
 * mapUrl                       → mapUrl
 * startingPrice / monthlyPrice  → startingPrice / monthlyPrice
 * mealPrice                    → mealPrice (mess only)
 * capacityEstimate             → capacityEstimate
 * amenities[]                  → amenityCodes (property only)
 *
 * Never shown: ownerName, mobileNumber, internal registration reference.
 *
 * listingMetadata is mock customer-discovery data that the registration
 * form does not collect today (ratings, photos, availability, featured rank).
 */

export type PropertyListingType = Exclude<PropertyType, 'MESS'>;

export type ListingMetadata = {
  rating: number;
  reviewCount: number;
  images: string[];
  featuredRank: number;
  listedAt: string;
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
  startingPrice: number;
  capacityEstimate: number;
  amenityCodes: string[];
  listingMetadata: ListingMetadata & { availableCount: number };
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
  monthlyPrice: number;
  mealPrice: number;
  capacityEstimate: number;
  listingMetadata: ListingMetadata & {
    /** Future listing metadata — not collected on the mess form today. */
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
