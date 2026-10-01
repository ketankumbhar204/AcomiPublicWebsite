import type { LocationAutocompleteSuggestion } from '../data/listings/locationAutocomplete';
import { publicApi } from '../lib/apiClient';

export type LocationRecord = {
  state: string;
  district: string;
  cityTaluka: string;
  location: string;
  pincode: string;
};

const SEARCH_LIMIT = 20;

export type LocationSearchOptions = {
  limit?: number;
  state?: string;
  district?: string;
  taluk?: string;
};

export const locationsApi = {
  listStates: () => publicApi<string[]>('/locations/states'),

  listDistricts: (state: string) =>
    publicApi<string[]>(`/locations/districts?state=${encodeURIComponent(state)}`),

  listTalukas: (state: string, district: string) =>
    publicApi<string[]>(
      `/locations/talukas?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`,
    ),

  listAreas: (state: string, district: string, taluk: string) =>
    publicApi<LocationRecord[]>(
      `/locations/areas?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}&taluk=${encodeURIComponent(taluk)}`,
    ),

  search: (q: string, options: LocationSearchOptions = {}) => {
    const params = new URLSearchParams();
    params.set('q', q.trim());
    params.set('limit', String(options.limit ?? SEARCH_LIMIT));
    const state = options.state?.trim();
    const district = options.district?.trim();
    const taluk = options.taluk?.trim();
    if (state) params.set('state', state);
    if (district) params.set('district', district);
    if (taluk) params.set('taluk', taluk);
    return publicApi<LocationRecord[]>(`/locations/search?${params.toString()}`);
  },

  autocomplete: (q: string, options: Pick<LocationSearchOptions, 'state' | 'district'> = {}) => {
    const params = new URLSearchParams();
    params.set('q', q.trim());
    const state = options.state?.trim();
    const district = options.district?.trim();
    if (state) params.set('state', state);
    if (district) params.set('district', district);
    return publicApi<LocationAutocompleteSuggestion[]>(`/locations/autocomplete?${params.toString()}`);
  },
};
