import type { DiscoverSpaceCard, DiscoverSpaceDetail } from '../../auth/types';
import { firstVerifiedListingImageUrl } from './representativeImage';
import type { MessListing, PropertyListing, PropertyListingType } from './types';

const PROPERTY_TYPES = new Set<PropertyListingType>(['PG', 'HOSTEL', 'RENTAL', 'CO_LIVING']);

function text(value?: string | null): string {
  return value?.trim() ?? '';
}

function toNumber(value?: number | string | null): number | null {
  if (value == null || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function amenityCodesOf(detail: DiscoverSpaceCard): string[] {
  const codes = [...(detail.amenityCodes ?? [])];
  if (detail.foodIncludedInRent && !codes.includes('FOOD_INCLUDED')) {
    codes.push('FOOD_INCLUDED');
  }
  return codes;
}

function localityAndCity(detail: DiscoverSpaceCard & Partial<DiscoverSpaceDetail>): { locality: string; city: string } {
  const city = text(detail.city);
  const line = text(detail.addressLine) || text(detail.address);
  const parts = line.split(',').map((part) => part.trim()).filter(Boolean);
  let locality = '';
  if (parts.length >= 2) {
    locality = parts[0] === city && parts.length > 1 ? parts[parts.length - 2] : parts[0];
  } else if (parts.length === 1 && parts[0].toLowerCase() !== city.toLowerCase()) {
    locality = parts[0];
  }
  return {
    locality: locality || city,
    city: city || parts.at(-1) || '',
  };
}

function listingImages(detail: DiscoverSpaceCard): string[] {
  const url = firstVerifiedListingImageUrl(
    detail.listingImageUrl,
    detail.coverImageUrl,
    detail.imageUrl,
  );
  return url ? [url] : [];
}

export function toPropertyListing(detail: DiscoverSpaceCard & Partial<DiscoverSpaceDetail>): PropertyListing | null {
  if (!PROPERTY_TYPES.has(detail.type as PropertyListingType)) {
    return null;
  }
  const { locality, city } = localityAndCity(detail);
  return {
    id: detail.spaceId,
    type: detail.type as PropertyListingType,
    name: detail.name,
    description: text(detail.description) || text(detail.sharingNotes),
    addressLine: text(detail.addressLine) || text(detail.address),
    locality,
    city,
    state: text(detail.state),
    pincode: text(detail.pincode),
    mapUrl: text(detail.mapUrl) || undefined,
    latitude: toNumber(detail.latitude),
    longitude: toNumber(detail.longitude),
    startingPrice: toNumber(detail.startingPrice),
    capacityEstimate: null,
    amenityCodes: amenityCodesOf(detail),
    foodIncludedInRent: detail.foodIncludedInRent === true,
    hasContact: detail.hasContact === true,
    sharingNotes: text(detail.sharingNotes) || undefined,
    listingMetadata: {
      images: listingImages(detail),
    },
  };
}

export function toMessListing(detail: DiscoverSpaceCard & Partial<DiscoverSpaceDetail>): MessListing | null {
  if (detail.type !== 'MESS') {
    return null;
  }
  const { locality, city } = localityAndCity(detail);
  return {
    id: detail.spaceId,
    name: detail.name,
    description: text(detail.description),
    addressLine: text(detail.addressLine) || text(detail.address),
    locality,
    city,
    state: text(detail.state),
    pincode: text(detail.pincode),
    mapUrl: text(detail.mapUrl) || undefined,
    latitude: toNumber(detail.latitude),
    longitude: toNumber(detail.longitude),
    monthlyPrice: toNumber(detail.monthlyPrice),
    mealPrice: toNumber(detail.mealPrice),
    hasContact: detail.hasContact === true,
    capacityEstimate: null,
    listingMetadata: {
      images: listingImages(detail),
      mealsServed: [],
    },
  };
}
