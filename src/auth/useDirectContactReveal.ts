import { useEffect, useState } from 'react';
import type { RevealedOwnerContact } from '../components/discovery/OwnerContactCard';
import { PublicApiError } from '../lib/apiClient';
import { useAuth } from './AuthProvider';
import { directContactDecision } from './contactViewQuota';
import { createSpaceEnquiry } from './discoverEnquiry';
import { fetchInquiryQuota } from './inquiryCreditsApi';
import { markInquired } from './inquiredListings';
import { listMySpaceMemberships } from './mySpacesApi';
import { useContactViewed } from './useAlreadyInquired';

export type DirectRevealPhase =
  | 'idle'
  | 'checking'
  | 'revealing'
  | 'revealed'
  | 'disabled'
  | 'exhausted'
  | 'own'
  | 'error';

const inflight = new Map<string, Promise<RevealedOwnerContact | DirectRevealPhase>>();
const ownedCache = new Map<string, { ids: Set<string>; at: number }>();
const OWNED_TTL_MS = 60_000;

function cacheKey(userId: string | undefined, listingId: string): string {
  return `${userId ?? 'anon'}:${listingId}`;
}

async function ownedSpaceIds(userId: string | undefined): Promise<Set<string>> {
  if (!userId) return new Set();
  const cached = ownedCache.get(userId);
  if (cached && Date.now() - cached.at < OWNED_TTL_MS) return cached.ids;
  try {
    const mine = await listMySpaceMemberships();
    const ids = new Set(
      mine.filter((space) => space.membershipRole === 'OWNER' && space.spaceId).map((space) => space.spaceId),
    );
    ownedCache.set(userId, { ids, at: Date.now() });
    return ids;
  } catch {
    return cached?.ids ?? new Set();
  }
}

async function revealOnce(
  listingId: string,
  userId: string | undefined,
): Promise<RevealedOwnerContact | DirectRevealPhase> {
  const key = cacheKey(userId, listingId);
  const existing = inflight.get(key);
  if (existing) return existing;
  const run = (async () => {
    try {
      const owned = await ownedSpaceIds(userId);
      if (owned.has(listingId)) return 'own' as const;
      const quota = await fetchInquiryQuota();
      const decision = directContactDecision(quota);
      if (decision !== 'reveal') return decision;
      const created = await createSpaceEnquiry(listingId, { deliveryChannel: 'VIEW_HERE' });
      markInquired(created.spaceId || listingId, null, {
        contactViewed: true,
        sentAt: created.deliveredAt || created.requestedAt,
      });
      return created.ownerContact ?? { available: false };
    } catch (err) {
      const code = err instanceof PublicApiError ? err.errorCode : undefined;
      if (code === 'SELF_ENQUIRY_NOT_ALLOWED') return 'own' as const;
      if (code === 'VIEW_HERE_DISABLED') return 'disabled' as const;
      if (code === 'VIEW_HERE_LIMIT_REACHED') return 'exhausted' as const;
      return 'error' as const;
    }
  })();
  inflight.set(key, run);
  const result = await run;
  if (result === 'disabled' || result === 'exhausted' || result === 'error') {
    inflight.delete(key);
  }
  return result;
}

export function useDirectContactReveal(listingId: string | null | undefined, enabled: boolean) {
  const { isAuthenticated, user } = useAuth();
  const contactViewed = useContactViewed(listingId);
  const [contact, setContact] = useState<RevealedOwnerContact | null>(null);
  const [phase, setPhase] = useState<DirectRevealPhase>('idle');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled || !listingId || !isAuthenticated || contactViewed) {
      setContact(null);
      setPhase('idle');
      return;
    }
    let cancelled = false;
    setContact(null);
    setPhase('checking');
    void revealOnce(listingId, user?.id).then((result) => {
      if (cancelled) return;
      if (result && typeof result === 'object') {
        setContact(result);
        setPhase('revealed');
        return;
      }
      setPhase(
        result === 'disabled' || result === 'exhausted' || result === 'own' || result === 'error'
          ? result
          : 'error',
      );
    });
    return () => {
      cancelled = true;
    };
  }, [attempt, contactViewed, enabled, isAuthenticated, listingId, user?.id]);

  return {
    contact,
    phase,
    retry: () => setAttempt((value) => value + 1),
  };
}
