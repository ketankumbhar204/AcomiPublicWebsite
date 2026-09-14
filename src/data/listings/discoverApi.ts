import { publicApi } from '../../lib/apiClient';
import type { DiscoverSpaceCard, DiscoverSpaceDetail } from '../../auth/types';

export type PagedDiscover<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type DiscoverSpacesParams = {
  search?: string;
  type?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export async function discoverSpaces(
  params: DiscoverSpacesParams = {},
): Promise<PagedDiscover<DiscoverSpaceCard>> {
  const { search, type, page = 0, size = 50, sort = 'newest' } = params;
  const query = new URLSearchParams();
  const trimmed = search?.trim();
  if (trimmed) query.set('search', trimmed);
  if (type) query.set('type', type);
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

async function fetchAllDetails(): Promise<DiscoverSpaceDetail[]> {
  const first = await discoverSpaces({ page: 0, size: PAGE_SIZE, sort: 'newest' });
  const cards = [...first.content];
  const totalPages = Math.max(first.totalPages ?? 1, 1);
  for (let page = 1; page < totalPages; page += 1) {
    const next = await discoverSpaces({ page, size: PAGE_SIZE, sort: 'newest' });
    cards.push(...next.content);
  }
  return Promise.all(
    cards.map((card) => getDiscoverSpaceDetail(card.spaceId).catch(() => card as DiscoverSpaceDetail)),
  );
}

/** Loads every discoverable space detail (paginated list, then per-space detail for prices/address). */
export async function loadDiscoverDetails(): Promise<DiscoverSpaceDetail[]> {
  if (cached && Date.now() - cached.at < CACHE_MS) {
    return cached.details;
  }
  if (!inflight) {
    inflight = fetchAllDetails()
      .then((details) => {
        cached = { at: Date.now(), details };
        return details;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}
