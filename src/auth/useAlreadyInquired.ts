import { useEffect, useSyncExternalStore } from 'react';
import { useAuth } from './AuthProvider';
import { publicApi } from '../lib/apiClient';
import {
  getInquiredIds,
  getInquirySentVia,
  loadInquiredListings,
  resetInquiredListings,
  subscribeInquired,
  type InquiredListingRef,
  type InquirySentVia,
} from './inquiredListings';

type InquiredListingIdsResponse = {
  inquiredListingIds?: string[];
  inquiries?: { listingId?: string; sentVia?: string }[];
};

function asSentVia(value: string | undefined): InquirySentVia | null {
  if (value === 'EMAIL' || value === 'APP' || value === 'BOTH') return value;
  return null;
}

async function fetchInquiredListingIds(): Promise<InquiredListingRef[]> {
  const data = await publicApi<InquiredListingIdsResponse>('/enquiries/me/listing-ids');
  if (data.inquiries?.length) {
    return data.inquiries.flatMap((row) => {
      const id = row.listingId?.trim();
      if (!id) return [];
      return [{ id, sentVia: asSentVia(row.sentVia) }];
    });
  }
  return data.inquiredListingIds ?? [];
}

export function useAlreadyInquired(listingId?: string | null): boolean {
  const { isAuthenticated, user } = useAuth();
  const ids = useSyncExternalStore(subscribeInquired, getInquiredIds, getInquiredIds);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      resetInquiredListings();
      return;
    }
    void loadInquiredListings(user.id, fetchInquiredListingIds);
  }, [isAuthenticated, user?.id]);

  return Boolean(listingId && ids.has(listingId));
}

export function useInquirySentVia(listingId?: string | null): InquirySentVia | null {
  const inquired = useAlreadyInquired(listingId);
  if (!inquired || !listingId) return null;
  return getInquirySentVia(listingId);
}
