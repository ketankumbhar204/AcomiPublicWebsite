import { publicApi } from '../../lib/apiClient';
import type { DiscoverSpaceCard, DiscoverSpaceDetail } from '../../auth/types';

export type PagedDiscover<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first?: boolean;
  last?: boolean;
};

export type DiscoverSpacesParams = {
  search?: string;
  location?: string;
  type?: string;
  types?: string[];
  minRent?: number | null;
  maxRent?: number | null;
  amenities?: string[];
  page?: number;
  size?: number;
  sort?: string;
};

export const DISCOVER_PAGE_SIZE = 20;

export async function discoverSpaces(
  params: DiscoverSpacesParams = {},
): Promise<PagedDiscover<DiscoverSpaceCard>> {
  const {
    search,
    location,
    type,
    types,
    minRent,
    maxRent,
    amenities,
    page = 0,
    size = DISCOVER_PAGE_SIZE,
    sort = 'newest',
  } = params;
  const query = new URLSearchParams();
  const trimmedSearch = search?.trim();
  const trimmedLocation = location?.trim();
  if (trimmedSearch) query.set('search', trimmedSearch);
  if (trimmedLocation) query.set('location', trimmedLocation);
  if (type) query.set('type', type);
  for (const nextType of types ?? []) {
    if (nextType.trim()) {
      query.append('types', nextType.trim());
    }
  }
  if (minRent != null) query.set('minRent', String(minRent));
  if (maxRent != null) query.set('maxRent', String(maxRent));
  for (const code of amenities ?? []) {
    if (code.trim()) {
      query.append('amenities', code.trim());
    }
  }
  query.set('page', String(page));
  query.set('size', String(size));
  query.set('sort', sort);
  return publicApi<PagedDiscover<DiscoverSpaceCard>>(`/spaces/discover?${query.toString()}`);
}

export async function getDiscoverSpaceDetail(spaceId: string): Promise<DiscoverSpaceDetail> {
  return publicApi<DiscoverSpaceDetail>(`/spaces/discover/${spaceId}`);
}

const PAGE_SIZE = 50;
const CACHE_MS = 30_000;

let inflight: Promise<DiscoverSpaceDetail[]> | null = null;
let cached: { at: number; details: DiscoverSpaceDetail[] } | null = null;

async function fetchAllDetails(
  params: Pick<DiscoverSpacesParams, 'search' | 'location'> = {},
): Promise<DiscoverSpaceDetail[]> {
  const first = await discoverSpaces({ ...params, page: 0, size: PAGE_SIZE, sort: 'newest' });
  const cards = [...first.content];
  const totalPages = Math.max(first.totalPages ?? 1, 1);
  for (let page = 1; page < totalPages; page += 1) {
    const next = await discoverSpaces({ ...params, page, size: PAGE_SIZE, sort: 'newest' });
    cards.push(...next.content);
  }
  return Promise.all(
    cards.map((card) => getDiscoverSpaceDetail(card.spaceId).catch(() => card as DiscoverSpaceDetail)),
  );
}

function hasDiscoverFilter(params: Pick<DiscoverSpacesParams, 'search' | 'location'>): boolean {
  return Boolean(params.location?.trim() || params.search?.trim());
}

/** Loads discoverable space details (paginated list, then per-space detail for prices/address). */
export async function loadDiscoverDetails(
  params: Pick<DiscoverSpacesParams, 'search' | 'location'> = {},
): Promise<DiscoverSpaceDetail[]> {
  const location = params.location?.trim() ?? '';
  const search = params.search?.trim() ?? '';
  const filtered = hasDiscoverFilter({ location, search });
  if (!filtered && cached && Date.now() - cached.at < CACHE_MS) {
    return cached.details;
  }
  if (!filtered && inflight) {
    return inflight;
  }
  const request = fetchAllDetails({
    location: location || undefined,
    search: search || undefined,
  }).then((details) => {
    if (!filtered) {
      cached = { at: Date.now(), details };
    }
    return details;
  });
  if (!filtered) {
    inflight = request.finally(() => {
      inflight = null;
    });
    return inflight;
  }
  return request;
}
