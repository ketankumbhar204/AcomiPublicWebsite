import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

type ListingPreviewValue = {
  previewOpen: boolean;
  setPreviewOpen: (open: boolean) => void;
};

const ListingPreviewContext = createContext<ListingPreviewValue | null>(null);

export function ListingPreviewProvider({ children }: { children: ReactNode }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const value = useMemo(() => ({ previewOpen, setPreviewOpen }), [previewOpen]);
  return <ListingPreviewContext.Provider value={value}>{children}</ListingPreviewContext.Provider>;
}

export function useListingPreview(): ListingPreviewValue {
  const context = useContext(ListingPreviewContext);
  if (!context) {
    throw new Error('useListingPreview must be used inside ListingPreviewProvider');
  }
  return context;
}
