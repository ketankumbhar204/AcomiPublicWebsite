import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DISCOVER_PAGE_SIZE, discoverSpaces } from './discoverApi';
import { toPropertyListing } from './mapDiscoverListing';
import type { PropertyListing } from './types';

export type DiscoverLoadStatus = 'loading' | 'ready' | 'error';

export type PagedPropertyFilters = {
  location?: string;
  search?: string;
  types: string[];
  minRent: number | null;
  maxRent: number | null;
  amenities: string[];
  sort?: string;
};

export type PagedPropertyListings = {
  listings: PropertyListing[];
  status: DiscoverLoadStatus;
  loadingMore: boolean;
  loadMoreError: boolean;
  hasMore: boolean;
  totalElements: number;
  loadMore: () => void;
  reload: () => void;
};

const PROPERTY_TYPES = ['PG', 'HOSTEL', 'RENTAL', 'CO_LIVING'] as const;

export function placesDiscoverFilterKey(filters: PagedPropertyFilters): string {
  return JSON.stringify({
    location: filters.location?.trim() ?? '',
    search: filters.search?.trim() ?? '',
    types: [...filters.types].sort(),
    minRent: filters.minRent,
    maxRent: filters.maxRent,
    amenities: [...filters.amenities].sort(),
    sort: filters.sort ?? 'newest',
    pageSize: DISCOVER_PAGE_SIZE,
  });
}

const pendingPages = new Map<string, ReturnType<typeof discoverSpaces>>();

function discoverPage(filters: PagedPropertyFilters, page: number) {
  const key = `${placesDiscoverFilterKey(filters)}:${page}`;
  const existing = pendingPages.get(key);
  if (existing) {
    return existing;
  }
  const request = discoverSpaces(toDiscoverParams(filters, page)).finally(() => {
    pendingPages.delete(key);
  });
  pendingPages.set(key, request);
  return request;
}

function toDiscoverParams(filters: PagedPropertyFilters, page: number) {
  const types = filters.types.length > 0 ? filters.types : [...PROPERTY_TYPES];
  return {
    location: filters.location?.trim() || undefined,
    search: filters.search?.trim() || undefined,
    types,
    minRent: filters.minRent,
    maxRent: filters.maxRent,
    amenities: filters.amenities,
    page,
    size: DISCOVER_PAGE_SIZE,
    sort: filters.sort?.trim() || 'newest',
  };
}

function mergeUnique(current: PropertyListing[], incoming: PropertyListing[]): PropertyListing[] {
  const seen = new Set(current.map((item) => item.id));
  const next = [...current];
  for (const item of incoming) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    next.push(item);
  }
  return next;
}

export function usePagedPropertyListings(filters: PagedPropertyFilters): PagedPropertyListings {
  const filterKey = useMemo(() => placesDiscoverFilterKey(filters), [filters]);
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [status, setStatus] = useState<DiscoverLoadStatus>('loading');
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState(false);
  const [page, setPage] = useState(0);
  const [last, setLast] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);
  const inFlight = useRef(false);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    let cancelled = false;
    inFlight.current = true;
    setStatus('loading');
    setListings([]);
    setLoadingMore(false);
    setLoadMoreError(false);
    setPage(0);
    setLast(true);
    setTotalElements(0);
    void discoverPage(filtersRef.current, 0)
      .then((response) => {
        if (cancelled) return;
        const mapped = response.content
          .map((card) => toPropertyListing(card))
          .filter((item): item is PropertyListing => item != null);
        setListings(mapped);
        setPage(response.page);
        setLast(Boolean(response.last) || mapped.length === 0);
        setTotalElements(response.totalElements ?? mapped.length);
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setListings([]);
        setStatus('error');
      })
      .finally(() => {
        if (!cancelled) {
          inFlight.current = false;
        }
      });
    return () => {
      cancelled = true;
      inFlight.current = false;
    };
  }, [filterKey, reloadKey]);

  const hasMore = status === 'ready' && !last;

  const loadMore = useCallback(() => {
    if (status !== 'ready' || last || loadingMore || inFlight.current) {
      return;
    }
    inFlight.current = true;
    setLoadingMore(true);
    const nextPage = page + 1;
    void discoverPage(filtersRef.current, nextPage)
      .then((response) => {
        const mapped = response.content
          .map((card) => toPropertyListing(card))
          .filter((item): item is PropertyListing => item != null);
        setListings((current) => mergeUnique(current, mapped));
        setPage(response.page);
        setLast(Boolean(response.last) || mapped.length === 0);
        setTotalElements(response.totalElements ?? 0);
        setLoadMoreError(false);
      })
      .catch(() => {
        setLoadMoreError(true);
      })
      .finally(() => {
        inFlight.current = false;
        setLoadingMore(false);
      });
  }, [last, loadingMore, page, status]);

  return {
    listings,
    status,
    loadingMore,
    loadMoreError,
    hasMore,
    totalElements,
    loadMore,
    reload,
  };
}
