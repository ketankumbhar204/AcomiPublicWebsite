import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DISCOVER_PAGE_SIZE, discoverSpaces } from './discoverApi';
import { toMessListing } from './mapDiscoverListing';
import type { MessListing } from './types';

export type DiscoverLoadStatus = 'loading' | 'ready' | 'error';

export type PagedMessFilters = {
  location?: string;
  pincode?: string;
  district?: string;
  state?: string;
  cityTaluka?: string;
  search?: string;
  sort?: string;
};

export function mealsDiscoverFilterKey(filters: PagedMessFilters): string {
  return JSON.stringify({
    location: filters.location?.trim() ?? '',
    pincode: filters.pincode?.trim() ?? '',
    district: filters.district?.trim() ?? '',
    state: filters.state?.trim() ?? '',
    cityTaluka: filters.cityTaluka?.trim() ?? '',
    search: filters.search?.trim() ?? '',
    type: 'MESS',
    sort: filters.sort ?? 'newest',
    pageSize: DISCOVER_PAGE_SIZE,
  });
}

const pendingPages = new Map<string, ReturnType<typeof discoverSpaces>>();

function discoverPage(filters: PagedMessFilters, page: number) {
  const key = `${mealsDiscoverFilterKey(filters)}:${page}`;
  const existing = pendingPages.get(key);
  if (existing) {
    return existing;
  }
  const request = discoverSpaces({
    location: filters.location?.trim() || undefined,
    search: filters.search?.trim() || undefined,
    type: 'MESS',
    page,
    size: DISCOVER_PAGE_SIZE,
    sort: filters.sort?.trim() || 'newest',
  }).finally(() => {
    pendingPages.delete(key);
  });
  pendingPages.set(key, request);
  return request;
}

function mergeUnique(current: MessListing[], incoming: MessListing[]): MessListing[] {
  const seen = new Set(current.map((item) => item.id));
  const next = [...current];
  for (const item of incoming) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    next.push(item);
  }
  return next;
}

export function usePagedMessListings(filters: PagedMessFilters) {
  const filterKey = useMemo(() => mealsDiscoverFilterKey(filters), [filters]);
  const [listings, setListings] = useState<MessListing[]>([]);
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
          .map((card) => toMessListing(card))
          .filter((item): item is MessListing => item != null);
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
          .map((card) => toMessListing(card))
          .filter((item): item is MessListing => item != null);
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
