import { MESSES } from './messes';
import { PROPERTIES } from './properties';
import type { MessListing, PropertyListing } from './types';

/**
 * Listing repository. Today this reads local dummy data.
 * Later, swap these functions for API calls without changing the UI.
 */
export function getPropertyListings(): readonly PropertyListing[] {
  return PROPERTIES;
}

export function getPropertyListing(id: string): PropertyListing | undefined {
  return PROPERTIES.find((item) => item.id === id);
}

export function getMessListings(): readonly MessListing[] {
  return MESSES;
}

export function getMessListing(id: string): MessListing | undefined {
  return MESSES.find((item) => item.id === id);
}
