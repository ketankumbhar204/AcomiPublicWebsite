import type { DiscoverSpaceCard, DiscoverSpaceDetail } from '../../auth/types';
import { isPriceBasis } from '../../lib/priceBasis';
import { firstVerifiedListingImageUrl } from './representativeImage';
import type { FoodFilter, GenderFilter, MessListing, PropertyListing, PropertyListingType } from './types';

const PROPERTY_TYPES = new Set<PropertyListingType>(['PG', 'HOSTEL', 'RENTAL', 'CO_LIVING', 'MESS']);

function text(value?: string | null): string {
  return value?.trim() ?? '';
}

function toNumber(value?: number | string | null): number | null {
  if (value == null || value === '') return null;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function genderPolicyOf(value?: string | null): GenderFilter | null {
  if (value === 'MALE' || value === 'FEMALE' || value === 'MIXED') return value;
  return null;
}

function foodAvailabilityOf(value?: string | null): FoodFilter | null {
  if (value === 'INCLUDED' || value === 'AVAILABLE' || value === 'NONE') return value;
  return null;
}

function listedAmenities(detail: DiscoverSpaceCard): { codes: string[]; labels: string[] } {
  const codes = [...(detail.amenityCodes ?? [])];
  const labels = [...(detail.amenityLabels ?? [])];
  while (labels.length < codes.length) labels.push('');
  if (detail.foodIncludedInRent && !codes.includes('FOOD_INCLUDED')) {
    codes.push('FOOD_INCLUDED');
    labels.push('Food');
  }
  return { codes, labels: labels.slice(0, codes.length) };
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
  const amenities = listedAmenities(detail);
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
    startingPrice: toNumber(detail.startingPrice) ?? toNumber(detail.monthlyPrice),
    priceBasis: isPriceBasis(detail.priceBasis) ? detail.priceBasis : null,
    capacityEstimate: null,
    amenityCodes: amenities.codes,
    amenityLabels: amenities.labels,
    foodIncludedInRent: detail.foodIncludedInRent === true,
    foodAvailability: foodAvailabilityOf(detail.foodAvailability),
    genderPolicy: genderPolicyOf(detail.genderPolicy),
    hasContact: detail.hasContact === true,
    hasMobileContact: detail.hasMobileContact === true,
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
  const amenities = listedAmenities(detail);
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
    priceBasis: isPriceBasis(detail.priceBasis) ? detail.priceBasis : null,
    amenityCodes: amenities.codes,
    foodIncludedInRent: detail.foodIncludedInRent === true,
    foodAvailability:
      foodAvailabilityOf(detail.foodAvailability) ?? (detail.foodIncludedInRent ? 'INCLUDED' : null),
    hasContact: detail.hasContact === true,
    hasMobileContact: detail.hasMobileContact === true,
    capacityEstimate: null,
    listingMetadata: {
      images: listingImages(detail),
      mealsServed: [],
    },
  };
}
