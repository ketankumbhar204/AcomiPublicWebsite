import { useEffect, useState } from 'react';
import { fetchRevealedContact } from '../../auth/discoverEnquiry';
import { useContactViewed } from '../../auth/useAlreadyInquired';
import type { RevealedOwnerContact } from './OwnerContactCard';

export function usePersistedRevealedContact(
  listingId: string,
  live: RevealedOwnerContact | null | undefined,
): RevealedOwnerContact | null {
  const contactViewed = useContactViewed(listingId);
  const [stored, setStored] = useState<RevealedOwnerContact | null>(null);

  useEffect(() => {
    if (live) return;
    if (!contactViewed) {
      setStored(null);
      return;
    }
    let cancelled = false;
    void fetchRevealedContact(listingId).then((contact) => {
      if (!cancelled) setStored(contact);
    });
    return () => {
      cancelled = true;
    };
  }, [contactViewed, listingId, live]);

  return live ?? stored;
}
