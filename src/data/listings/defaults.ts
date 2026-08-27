import { ALL_AMENITIES } from '../../constants/propertyRegistration';
import type { MessQuery, PropertyListing, PropertyQuery } from './types';

export const DEFAULT_PROPERTY_QUERY: PropertyQuery = {
  query: '',
  types: [],
  localities: [],
  minPrice: null,
  maxPrice: null,
  minRating: null,
  amenities: [],
  sort: 'recommended',
};

export const DEFAULT_MESS_QUERY: MessQuery = {
  query: '',
  localities: [],
  minMonthly: null,
  maxMonthly: null,
  minMeal: null,
  maxMeal: null,
  minRating: null,
  sort: 'recommended',
};

export const PROPERTY_PRICE_PRESETS = [
  { id: 'any', label: 'Any price', min: null, max: null },
  { id: 'under-8', label: 'Under ₹8,000', min: null, max: 8000 },
  { id: '8-12', label: '₹8,000 – ₹12,000', min: 8000, max: 12000 },
  { id: '12-18', label: '₹12,000 – ₹18,000', min: 12000, max: 18000 },
  { id: '18-plus', label: '₹18,000+', min: 18000, max: null },
] as const;

export const MESS_MONTHLY_PRESETS = [
  { id: 'any', label: 'Any monthly price', min: null, max: null },
  { id: 'under-25', label: 'Under ₹2,500', min: null, max: 2500 },
  { id: '25-30', label: '₹2,500 – ₹3,000', min: 2500, max: 3000 },
  { id: '30-plus', label: '₹3,000+', min: 3000, max: null },
] as const;

export const MESS_MEAL_PRESETS = [
  { id: 'any', label: 'Any per-meal price', min: null, max: null },
  { id: 'under-85', label: 'Under ₹85', min: null, max: 85 },
  { id: '85-100', label: '₹85 – ₹100', min: 85, max: 100 },
  { id: '100-plus', label: '₹100+', min: 100, max: null },
] as const;

export const RATING_PRESETS = [
  { id: 'any', label: 'Any rating', value: null },
  { id: '45', label: '4.5+', value: 4.5 },
  { id: '40', label: '4.0+', value: 4.0 },
  { id: '35', label: '3.5+', value: 3.5 },
] as const;

export const SORT_OPTIONS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating-desc', label: 'Rating: High to Low' },
  { id: 'newest', label: 'Newly added' },
] as const;

export function amenitiesInUse(listings: readonly PropertyListing[]): string[] {
  const used = new Set<string>();
  listings.forEach((item) => item.amenityCodes.forEach((code) => used.add(code)));
  return ALL_AMENITIES.map((item) => item.code).filter((code) => used.has(code));
}

export function propertyQueryIsFiltered(query: PropertyQuery): boolean {
  return (
    query.types.length > 0 ||
    query.localities.length > 0 ||
    query.minPrice != null ||
    query.maxPrice != null ||
    query.minRating != null ||
    query.amenities.length > 0
  );
}

export function messQueryIsFiltered(query: MessQuery): boolean {
  return (
    query.localities.length > 0 ||
    query.minMonthly != null ||
    query.maxMonthly != null ||
    query.minMeal != null ||
    query.maxMeal != null ||
    query.minRating != null
  );
}
