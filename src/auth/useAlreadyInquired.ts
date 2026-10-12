import { useEffect, useSyncExternalStore } from 'react';
import { useAuth } from './AuthProvider';
import { publicApi } from '../lib/apiClient';
import {
  getInquiredIds,
  getInquiryRecord,
  getInquirySnapshot,
  loadInquiredListings,
  resetInquiredListings,
  subscribeInquired,
  type InquiredListingRef,
  type InquiryRecord,
  type InquirySentVia,
} from './inquiredListings';

type InquiredListingIdsResponse = {
  inquiredListingIds?: string[];
  inquiries?: {
    listingId?: string;
    enquiryId?: string | null;
    contactViewed?: boolean;
    sentVia?: string;
    sentToEmail?: string | null;
    sentAt?: string | null;
  }[];
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
      return [{
        id,
        contactViewed: row.contactViewed === true,
        sentVia: asSentVia(row.sentVia),
        sentToEmail: row.sentToEmail?.trim() || null,
        sentAt: row.sentAt?.trim() || null,
      }];
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

export function useInquiryRecord(listingId?: string | null): InquiryRecord | null {
  const { isAuthenticated, user } = useAuth();
  const version = useSyncExternalStore(subscribeInquired, getInquirySnapshot, getInquirySnapshot);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) {
      resetInquiredListings();
      return;
    }
    void loadInquiredListings(user.id, fetchInquiredListingIds);
  }, [isAuthenticated, user?.id]);

  void version;
  if (!listingId) return null;
  return getInquiryRecord(listingId);
}

export function useInquirySentVia(listingId?: string | null): InquirySentVia | null {
  return useInquiryRecord(listingId)?.sentVia ?? null;
}

export function useContactViewed(listingId?: string | null): boolean {
  return useInquiryRecord(listingId)?.contactViewed === true;
}
