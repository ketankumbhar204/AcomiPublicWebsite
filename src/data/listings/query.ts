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
    if (query.minPrice != null && (item.startingPrice == null || item.startingPrice < query.minPrice)) {
      return false;
    }
    if (query.maxPrice != null && (item.startingPrice == null || item.startingPrice > query.maxPrice)) {
      return false;
    }
    if (query.minRating != null && (item.listingMetadata.rating == null || item.listingMetadata.rating < query.minRating)) {
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
    if (query.minMonthly != null && (item.monthlyPrice == null || item.monthlyPrice < query.minMonthly)) {
      return false;
    }
    if (query.maxMonthly != null && (item.monthlyPrice == null || item.monthlyPrice > query.maxMonthly)) {
      return false;
    }
    if (query.minMeal != null && (item.mealPrice == null || item.mealPrice < query.minMeal)) {
      return false;
    }
    if (query.maxMeal != null && (item.mealPrice == null || item.mealPrice > query.maxMeal)) {
      return false;
    }
    if (query.minRating != null && (item.listingMetadata.rating == null || item.listingMetadata.rating < query.minRating)) {
      return false;
    }
    return true;
  });

  return sortList(filtered, query.sort, (item) => item.monthlyPrice, (item) => item.listingMetadata);
}

function sortList<T>(
  items: T[],
  sort: PropertyQuery['sort'],
  priceOf: (item: T) => number | null,
  metaOf: (item: T) => { featuredRank?: number; rating?: number; listedAt?: string },
): T[] {
  const next = [...items];
  next.sort((a, b) => {
    const ma = metaOf(a);
    const mb = metaOf(b);
    switch (sort) {
      case 'price-asc':
        return (priceOf(a) ?? Number.POSITIVE_INFINITY) - (priceOf(b) ?? Number.POSITIVE_INFINITY);
      case 'price-desc':
        return (priceOf(b) ?? Number.NEGATIVE_INFINITY) - (priceOf(a) ?? Number.NEGATIVE_INFINITY);
      case 'rating-desc':
        return (mb.rating ?? 0) - (ma.rating ?? 0);
      case 'newest':
        return (mb.listedAt ?? '').localeCompare(ma.listedAt ?? '');
      default:
        return (ma.featuredRank ?? 0) - (mb.featuredRank ?? 0);
    }
  });
  return next;
}

export function uniqueLocalities(items: readonly { locality: string }[]): string[] {
  return [...new Set(items.map((item) => item.locality).filter(Boolean))].sort();
}

export function uniqueCities(items: readonly { city: string }[]): string[] {
  return [...new Set(items.map((item) => item.city).filter(Boolean))].sort();
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatListingAddress(listing: {
  addressLine: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
}): string {
  const parts: string[] = [];
  const push = (value: string) => {
    const next = value.trim();
    if (!next) return;
    if (parts.some((part) => part.toLowerCase() === next.toLowerCase())) return;
    parts.push(next);
  };
  push(listing.addressLine);
  push(listing.locality);
  push(listing.city);
  push(listing.state);
  if (listing.pincode.trim()) {
    parts.push(listing.pincode.trim());
  }
  return parts.join(', ');
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
  const query = formatListingAddress(listing);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || 'India')}`;
}
