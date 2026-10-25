import { useEffect, useState } from 'react';
import { fetchRevealedContact } from '../../auth/discoverEnquiry';
import { useContactViewed } from '../../auth/useAlreadyInquired';
import type { RevealedOwnerContact } from './OwnerContactCard';

export function usePersistedRevealedContact(
  listingId: string,
  live: RevealedOwnerContact | null | undefined,
): {
  contact: RevealedOwnerContact | null;
  loading: boolean;
  error: boolean;
  retry: () => void;
} {
  const contactViewed = useContactViewed(listingId);
  const [stored, setStored] = useState<RevealedOwnerContact | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (live) {
      setLoading(false);
      setError(false);
      return;
    }
    if (!contactViewed || !listingId) {
      setStored(null);
      setLoading(false);
      setError(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(false);
    void fetchRevealedContact(listingId)
      .then((contact) => {
        if (cancelled) return;
        setStored(contact);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setStored(null);
        setError(true);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt, contactViewed, listingId, live]);

  return {
    contact: live ?? stored,
    loading: !live && loading,
    error: !live && error,
    retry: () => setAttempt((value) => value + 1),
  };
}
