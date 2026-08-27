import { ALL_AMENITIES, getPropertyTypeOption } from '../../constants/propertyRegistration';
import type { MessListing, MessQuery, PropertyListing, PropertyQuery } from './types';

export function amenityLabel(code: string): string {
  return ALL_AMENITIES.find((item) => item.code === code)?.label ?? code;
}

function matchesQuery(haystack: string[], query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) {
    return true;
  }
  return haystack.some((part) => part.toLowerCase().includes(q));
}

export function filterProperties(
  listings: readonly PropertyListing[],
  query: PropertyQuery,
): PropertyListing[] {
  const searched = listings.filter((item) =>
    matchesQuery(
      [
        item.name,
        item.city,
        item.locality,
        item.pincode,
        item.type,
        getPropertyTypeOption(item.type).title,
        item.addressLine,
      ],
      query.query,
    ),
  );

  const filtered = searched.filter((item) => {
    if (query.types.length > 0 && !query.types.includes(item.type)) {
      return false;
    }
    if (query.localities.length > 0 && !query.localities.includes(item.locality)) {
      return false;
    }
    if (query.minPrice != null && item.startingPrice < query.minPrice) {
      return false;
    }
    if (query.maxPrice != null && item.startingPrice > query.maxPrice) {
      return false;
    }
    if (query.minRating != null && item.listingMetadata.rating < query.minRating) {
      return false;
    }
    if (query.amenities.length > 0 && !query.amenities.every((code) => item.amenityCodes.includes(code))) {
      return false;
    }
    return true;
  });

  return sortList(filtered, query.sort, (item) => item.startingPrice, (item) => item.listingMetadata);
}

export function filterMesses(listings: readonly MessListing[], query: MessQuery): MessListing[] {
  const searched = listings.filter((item) =>
    matchesQuery([item.name, item.city, item.locality, item.pincode, item.addressLine], query.query),
  );

  const filtered = searched.filter((item) => {
    if (query.localities.length > 0 && !query.localities.includes(item.locality)) {
      return false;
    }
    if (query.minMonthly != null && item.monthlyPrice < query.minMonthly) {
      return false;
    }
    if (query.maxMonthly != null && item.monthlyPrice > query.maxMonthly) {
      return false;
    }
    if (query.minMeal != null && item.mealPrice < query.minMeal) {
      return false;
    }
    if (query.maxMeal != null && item.mealPrice > query.maxMeal) {
      return false;
    }
    if (query.minRating != null && item.listingMetadata.rating < query.minRating) {
      return false;
    }
    return true;
  });

  return sortList(filtered, query.sort, (item) => item.monthlyPrice, (item) => item.listingMetadata);
}

function sortList<T>(
  items: T[],
  sort: PropertyQuery['sort'],
  priceOf: (item: T) => number,
  metaOf: (item: T) => { featuredRank: number; rating: number; listedAt: string },
): T[] {
  const next = [...items];
  next.sort((a, b) => {
    const ma = metaOf(a);
    const mb = metaOf(b);
    switch (sort) {
      case 'price-asc':
        return priceOf(a) - priceOf(b);
      case 'price-desc':
        return priceOf(b) - priceOf(a);
      case 'rating-desc':
        return mb.rating - ma.rating;
      case 'newest':
        return mb.listedAt.localeCompare(ma.listedAt);
      default:
        return ma.featuredRank - mb.featuredRank;
    }
  });
  return next;
}

export function uniqueLocalities(items: readonly { locality: string }[]): string[] {
  return [...new Set(items.map((item) => item.locality))].sort();
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function listingMapUrl(listing: {
  mapUrl?: string;
  addressLine: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
}): string {
  if (listing.mapUrl) {
    return listing.mapUrl;
  }
  const query = `${listing.addressLine}, ${listing.locality}, ${listing.city}, ${listing.state} ${listing.pincode}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
