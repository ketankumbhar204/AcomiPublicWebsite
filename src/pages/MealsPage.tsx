import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { ActionButton } from '../components/common/ActionButton';
import { ActiveFilterChips } from '../components/discovery/ActiveFilterChips';
import { DiscoveryPageShell } from '../components/discovery/DiscoveryPageShell';
import { DiscoverySearchBar } from '../components/discovery/DiscoverySearchBar';
import { EnquireDialog } from '../components/discovery/EnquireDialog';
import { FilterSheet } from '../components/discovery/FilterSheet';
import { ListingDetailDrawer } from '../components/discovery/ListingDetailDrawer';
import { ListingEmpty } from '../components/discovery/ListingEmpty';
import { ListingPagination } from '../components/discovery/ListingPagination';
import { MessCard } from '../components/discovery/MessCard';
import { MessDetailPanel } from '../components/discovery/MessDetailPanel';
import { MessFilters } from '../components/discovery/MessFilters';
import { messFilterChips } from '../components/discovery/messFilterChips';
import { DEFAULT_MESS_QUERY, messQueryIsFiltered } from '../data/listings/defaults';
import { filterMesses, getMessListings, uniqueLocalities } from '../data/listings';
import type { MessQuery } from '../data/listings/types';
import { applySeo } from '../lib/seo';

const PAGE_SIZE = 12;

export function MealsPage() {
  const listings = getMessListings();
  const localities = uniqueLocalities(listings);
  const [query, setQuery] = useState<MessQuery>(DEFAULT_MESS_QUERY);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [enquireOpen, setEnquireOpen] = useState(false);

  useEffect(() => {
    applySeo({
      title: 'Find meals — ACOMI',
      description: 'Browse messes, tiffin and meal services in Pune.',
      path: '/meals',
    });
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const results = useMemo(() => filterMesses(listings, query), [listings, query]);
  const chips = messFilterChips(query, setQuery);
  const filtered = messQueryIsFiltered(query) || query.query.trim().length > 0;
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const shown = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = results.find((item) => item.id === selectedId) ?? null;

  useEffect(() => {
    if (selectedId && !results.some((item) => item.id === selectedId)) {
      setSelectedId(null);
      setDetailOpen(false);
    }
  }, [results, selectedId]);

  const clearFilters = () =>
    setQuery({ ...DEFAULT_MESS_QUERY, query: query.query, sort: query.sort });

  const selectListing = (id: string) => {
    setSelectedId(id);
    setDetailOpen(true);
  };

  const toggleSaved = (id: string) => {
    setSavedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <>
      <DiscoveryPageShell
        eyebrow="Find meals"
        title="Find meals near you"
        description="Mess, tiffin and meal services across Pune."
        search={
          <DiscoverySearchBar
            searchId="meals-search"
            searchLabel="Search meals"
            searchValue={query.query}
            searchPlaceholder="Search by city, area or mess name"
            onSearchChange={(value) => setQuery({ ...query, query: value })}
            city="Pune"
            sortId="meals-sort"
            sortValue={query.sort}
            onSortChange={(sort) => setQuery({ ...query, sort })}
          />
        }
        filters={
          <>
            <h2 className="text-sm font-semibold text-navy">Filters</h2>
            <div className="mt-4">
              <MessFilters query={query} localities={localities} onChange={setQuery} />
            </div>
          </>
        }
        toolbar={
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-text-secondary">
                {results.length} {results.length === 1 ? 'mess found' : 'messes found'}
              </p>
              <ActionButton onClick={() => setSheetOpen(true)} variant="ghost" className="lg:hidden">
                <SlidersHorizontal aria-hidden className="h-4 w-4" />
                Filters
              </ActionButton>
            </div>
            <div className="mt-3">
              <ActiveFilterChips filters={chips} onClearAll={clearFilters} />
            </div>
          </>
        }
        results={
          results.length === 0 ? (
            <div className="mt-6">
              <ListingEmpty
                title="No messes found"
                description="Try another area or price range."
                onClear={filtered ? clearFilters : () => setQuery(DEFAULT_MESS_QUERY)}
              />
            </div>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {shown.map((listing) => (
                  <MessCard
                    key={listing.id}
                    listing={listing}
                    selected={detailOpen && selected?.id === listing.id}
                    saved={savedIds.includes(listing.id)}
                    onSelect={() => selectListing(listing.id)}
                    onToggleSave={() => toggleSaved(listing.id)}
                  />
                ))}
              </div>
              <ListingPagination page={page} pageCount={pageCount} onPageChange={setPage} />
            </>
          )
        }
      />

      <FilterSheet
        open={sheetOpen}
        title="Filters"
        labelledBy="meals-filters-title"
        value={query}
        onClose={() => setSheetOpen(false)}
        onApply={setQuery}
        onClear={clearFilters}
      >
        {(draft, setDraft) => (
          <MessFilters query={draft} localities={localities} onChange={setDraft} />
        )}
      </FilterSheet>

      <ListingDetailDrawer
        open={detailOpen && selected != null}
        titleId="meals-detail-title"
        title={selected?.name ?? 'Mess details'}
        onClose={() => setDetailOpen(false)}
      >
        {selected ? <MessDetailPanel listing={selected} onEnquire={() => setEnquireOpen(true)} /> : null}
      </ListingDetailDrawer>

      <EnquireDialog
        open={enquireOpen}
        title={selected ? `Enquire about ${selected.name}` : 'Enquire'}
        onClose={() => setEnquireOpen(false)}
      />
    </>
  );
}
