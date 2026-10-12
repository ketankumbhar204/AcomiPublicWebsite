import type { MealFoodTypeFilter, MealSlotFilter } from './types';

export type MealFilterParams = {
  minMonthly: number | null;
  maxMonthly: number | null;
  contactAvailable: boolean;
  mealTypes: MealSlotFilter[];
  foodTypes: MealFoodTypeFilter[];
};

const MEAL_SLOTS: readonly MealSlotFilter[] = ['BREAKFAST', 'LUNCH', 'DINNER'];
const FOOD_TYPES: readonly MealFoodTypeFilter[] = ['VEG', 'NON_VEG', 'EGG'];

function parseRent(value: string | null): number | null {
  if (!value || !/^\d+$/.test(value)) return null;
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : null;
}

function parseCodes<T extends string>(params: URLSearchParams, key: string, allowed: readonly T[]): T[] {
  const seen: T[] = [];
  for (const raw of params.getAll(key)) {
    const code = raw.trim().toUpperCase().replace(/[\s-]+/g, '_') as T;
    if (allowed.includes(code) && !seen.includes(code)) seen.push(code);
  }
  return seen;
}

export function parseMealFilters(params: URLSearchParams): MealFilterParams {
  return {
    minMonthly: parseRent(params.get('minRent')),
    maxMonthly: parseRent(params.get('maxRent')),
    contactAvailable: params.get('contact') === '1',
    mealTypes: parseCodes(params, 'mealTypes', MEAL_SLOTS),
    foodTypes: parseCodes(params, 'foodTypes', FOOD_TYPES),
  };
}

export function appendMealFilters(params: URLSearchParams, filters: MealFilterParams): URLSearchParams {
  if (filters.minMonthly != null) params.set('minRent', String(filters.minMonthly));
  else params.delete('minRent');
  if (filters.maxMonthly != null) params.set('maxRent', String(filters.maxMonthly));
  else params.delete('maxRent');
  if (filters.contactAvailable) params.set('contact', '1');
  else params.delete('contact');
  params.delete('mealTypes');
  for (const slot of filters.mealTypes) params.append('mealTypes', slot);
  params.delete('foodTypes');
  for (const food of filters.foodTypes) params.append('foodTypes', food);
  return params;
}

export function sameMealCodes(left: readonly string[], right: readonly string[]): boolean {
  return left.join(',') === right.join(',');
}
