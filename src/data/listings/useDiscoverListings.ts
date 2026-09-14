import { useCallback, useEffect, useState } from 'react';
import { loadDiscoverDetails } from './discoverApi';
import { toMessListing, toPropertyListing } from './mapDiscoverListing';
import type { MessListing, PropertyListing } from './types';

export type DiscoverLoadStatus = 'loading' | 'ready' | 'error';

export function usePropertyListings() {
  const [listings, setListings] = useState<PropertyListing[]>([]);
  const [status, setStatus] = useState<DiscoverLoadStatus>('loading');
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    void loadDiscoverDetails()
      .then((details) => {
        if (cancelled) return;
        setListings(details.map(toPropertyListing).filter((item): item is PropertyListing => item != null));
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setListings([]);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return { listings, status, reload };
}

export function useMessListings() {
  const [listings, setListings] = useState<MessListing[]>([]);
  const [status, setStatus] = useState<DiscoverLoadStatus>('loading');
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    void loadDiscoverDetails()
      .then((details) => {
        if (cancelled) return;
        setListings(details.map(toMessListing).filter((item): item is MessListing => item != null));
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) return;
        setListings([]);
        setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return { listings, status, reload };
}
