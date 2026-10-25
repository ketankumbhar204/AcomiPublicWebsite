import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { ListingKind } from '../constants/listing';
import type { MeListing } from '../auth/mySpacesApi';
import { PropertyRegistrationDrawer } from '../components/registration/PropertyRegistrationDrawer';

type ListingDrawerValue = {
  listingKind: ListingKind | null;
  openListing: (kind: ListingKind) => void;
  openListingEdit: (listing: MeListing) => void;
  closeListing: () => void;
  subscribeListingSaved: (listener: () => void) => () => void;
};

const ListingDrawerContext = createContext<ListingDrawerValue | null>(null);

export function ListingDrawerProvider({ children }: { children: ReactNode }) {
  const [listingKind, setListingKind] = useState<ListingKind | null>(null);
  const [editListing, setEditListing] = useState<MeListing | null>(null);
  const savedListeners = useRef(new Set<() => void>());

  const openListing = useCallback((kind: ListingKind) => {
    setEditListing(null);
    setListingKind(kind);
  }, []);

  const openListingEdit = useCallback((listing: MeListing) => {
    setEditListing(listing);
    setListingKind(listing.kind === 'MESS' ? 'mess' : 'property');
  }, []);

  const closeListing = useCallback(() => {
    setListingKind(null);
    setEditListing(null);
  }, []);

  const subscribeListingSaved = useCallback((listener: () => void) => {
    savedListeners.current.add(listener);
    return () => {
      savedListeners.current.delete(listener);
    };
  }, []);

  const notifySaved = useCallback(() => {
    savedListeners.current.forEach((listener) => listener());
  }, []);

  const value = useMemo(
    () => ({ listingKind, openListing, openListingEdit, closeListing, subscribeListingSaved }),
    [listingKind, openListing, openListingEdit, closeListing, subscribeListingSaved],
  );

  return (
    <ListingDrawerContext.Provider value={value}>
      {children}
      <PropertyRegistrationDrawer
        open={listingKind !== null}
        kind={listingKind ?? 'property'}
        editListing={editListing}
        onClose={closeListing}
        onSaved={notifySaved}
      />
    </ListingDrawerContext.Provider>
  );
}

export function useListingDrawer(): ListingDrawerValue {
  const context = useContext(ListingDrawerContext);
  if (!context) {
    throw new Error('useListingDrawer must be used inside ListingDrawerProvider');
  }
  return context;
}
