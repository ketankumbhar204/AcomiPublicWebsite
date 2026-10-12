/**
 * Current-user enquiry listing ids. The set is replaced from
 * GET /enquiries/me/listing-ids and updated after a successful create.
 * Logged-out sessions stay empty.
 */

export type InquirySentVia = 'EMAIL' | 'APP' | 'BOTH';

export type InquiryRecord = {
  sentVia: InquirySentVia | null;
  sentToEmail: string | null;
  sentAt: string | null;
  contactViewed: boolean;
};

export type InquiredListingRef =
  | string
  | {
      id: string;
      sentVia?: InquirySentVia | null;
      sentToEmail?: string | null;
      sentAt?: string | null;
      contactViewed?: boolean;
      emailStatus?: 'SENDING' | 'SENT' | null;
      enquiryId?: string | null;
    };

export type PendingEnquiryEmail = {
  enquiryId: string;
  listingId: string;
};

type Listener = () => void;

let ids = new Set<string>();
let records = new Map<string, InquiryRecord>();
let optimistic = new Set<string>();
let optimisticRecords = new Map<string, InquiryRecord>();
let loadEpoch = 0;
let snapshotVersion = 0;
let inflight: Promise<void> | null = null;
let pendingEmails: PendingEnquiryEmail[] = [];
const listeners = new Set<Listener>();

function emit(): void {
  snapshotVersion += 1;
  listeners.forEach((listener) => listener());
}

export function getInquirySnapshot(): number {
  return snapshotVersion;
}

export function getInquiredIds(): ReadonlySet<string> {
  return ids;
}

export function getInquirySentVia(listingId: string): InquirySentVia | null {
  return records.get(listingId)?.sentVia ?? null;
}

export function getInquiryRecord(listingId: string): InquiryRecord | null {
  return records.get(listingId) ?? null;
}

export function getPendingEnquiryEmails(): readonly PendingEnquiryEmail[] {
  return pendingEmails;
}

export function clearPendingEnquiryEmail(enquiryId: string): void {
  if (!pendingEmails.some((row) => row.enquiryId === enquiryId)) return;
  pendingEmails = pendingEmails.filter((row) => row.enquiryId !== enquiryId);
  emit();
}

export function inquirySentViaFromEnquiry(enquiry: {
  clientChannel?: string | null;
  contactDelivery?: string | null;
  contactEmailSent?: boolean;
  deliveryChannel?: string | null;
  appDeliveredAt?: string | null;
  emailDeliveredAt?: string | null;
} | null | undefined): InquirySentVia {
  const email = enquiry?.clientChannel !== 'ANDROID'
    || Boolean(enquiry?.contactEmailSent)
    || enquiry?.contactDelivery === 'EMAIL'
    || enquiry?.deliveryChannel === 'EMAIL'
    || Boolean(enquiry?.emailDeliveredAt);
  const app = enquiry?.clientChannel === 'ANDROID'
    || enquiry?.contactDelivery === 'IN_APP'
    || enquiry?.deliveryChannel === 'APP'
    || Boolean(enquiry?.appDeliveredAt);
  if (email && app) return 'BOTH';
  if (app) return 'APP';
  return 'EMAIL';
}

function asSentVia(value: string | null | undefined): InquirySentVia | null {
  if (value === 'EMAIL' || value === 'APP' || value === 'BOTH') return value;
  return null;
}

export function subscribeInquired(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function listingAlreadyInquired(listingIds: Iterable<string>, listingId: string): boolean {
  for (const id of listingIds) {
    if (id === listingId) return true;
  }
  return false;
}

export function resetInquiredListings(): void {
  loadEpoch += 1;
  inflight = null;
  optimistic = new Set();
  optimisticRecords = new Map();
  records = new Map();
  ids = new Set();
  pendingEmails = [];
  emit();
}

export function markInquired(
  listingId: string,
  sentVia?: InquirySentVia | null,
  details?: { sentToEmail?: string | null; sentAt?: string | null; contactViewed?: boolean },
): void {
  const id = listingId.trim();
  if (!id) return;
  const current = records.get(id);
  const via = asSentVia(sentVia) ?? current?.sentVia ?? null;
  const next: InquiryRecord = {
    sentVia: via,
    sentToEmail: details?.sentToEmail ?? current?.sentToEmail ?? null,
    sentAt: details?.sentAt ?? current?.sentAt ?? null,
    contactViewed: details?.contactViewed ?? current?.contactViewed ?? false,
  };
  records = new Map(records).set(id, next);
  if (via) {
    optimistic = new Set(optimistic).add(id);
    optimisticRecords = new Map(optimisticRecords).set(id, next);
    if (!ids.has(id)) {
      ids = new Set(ids).add(id);
    }
  }
  emit();
}

export async function loadInquiredListings(
  userId: string,
  fetchIds: () => Promise<InquiredListingRef[]>,
): Promise<void> {
  if (!userId) {
    resetInquiredListings();
    return;
  }
  if (inflight) return inflight;

  const epoch = loadEpoch;
  const optimisticBefore = optimistic;
  const request = (async () => {
    try {
      const fetched = await fetchIds();
      if (epoch !== loadEpoch) return;
      const next = new Set<string>();
      const nextRecords = new Map<string, InquiryRecord>();
      const nextPending: PendingEnquiryEmail[] = [];
      for (const item of fetched) {
        const id = typeof item === 'string' ? item : item?.id;
        if (!id) continue;
        if (typeof item !== 'string' && item.contactViewed && !item.sentVia) {
          nextRecords.set(id, {
            sentVia: null,
            sentToEmail: null,
            sentAt: item.sentAt?.trim() || null,
            contactViewed: true,
          });
          continue;
        }
        next.add(id);
        if (typeof item !== 'string') {
          nextRecords.set(id, {
            sentVia: asSentVia(item.sentVia),
            sentToEmail: item.sentToEmail?.trim() || null,
            sentAt: item.sentAt?.trim() || null,
            contactViewed: item.contactViewed === true,
          });
        }
      }
      const stillOptimistic = new Set<string>();
      for (const id of optimistic) {
        if (!optimisticBefore.has(id)) {
          next.add(id);
          stillOptimistic.add(id);
          const record = optimisticRecords.get(id);
          if (record) nextRecords.set(id, record);
        }
      }
      optimistic = stillOptimistic;
      optimisticRecords = new Map([...optimisticRecords].filter(([id]) => stillOptimistic.has(id)));
      records = nextRecords;
      ids = next;
      pendingEmails = nextPending;
      emit();
    } catch {
      // A failed refresh leaves the previous set in place.
    }
  })();

  inflight = request;
  try {
    await request;
  } finally {
    if (inflight === request) inflight = null;
  }
}
