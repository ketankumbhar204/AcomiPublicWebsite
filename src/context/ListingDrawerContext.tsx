import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { ListingKind } from '../constants/listing';
import { PropertyRegistrationDrawer } from '../components/registration/PropertyRegistrationDrawer';

type ListingDrawerValue = {
  listingKind: ListingKind | null;
  openListing: (kind: ListingKind) => void;
  closeListing: () => void;
};

const ListingDrawerContext = createContext<ListingDrawerValue | null>(null);

export function ListingDrawerProvider({ children }: { children: ReactNode }) {
  const [listingKind, setListingKind] = useState<ListingKind | null>(null);

  const openListing = useCallback((kind: ListingKind) => {
    setListingKind(kind);
  }, []);

  const closeListing = useCallback(() => {
    setListingKind(null);
  }, []);

  const value = useMemo(
    () => ({ listingKind, openListing, closeListing }),
    [listingKind, openListing, closeListing],
  );

  return (
    <ListingDrawerContext.Provider value={value}>
      {children}
      <PropertyRegistrationDrawer
        open={listingKind !== null}
        kind={listingKind ?? 'property'}
        onClose={closeListing}
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
