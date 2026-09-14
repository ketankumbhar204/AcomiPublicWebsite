import { useEffect, useMemo, useRef, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../components/common/ActionButton';
import { ActiveFilterChips } from '../components/discovery/ActiveFilterChips';
import { DiscoveryPageShell } from '../components/discovery/DiscoveryPageShell';
import { DiscoverySearchBar } from '../components/discovery/DiscoverySearchBar';
import { EnquireDialog } from '../components/discovery/EnquireDialog';
import { FilterSheet } from '../components/discovery/FilterSheet';
import { ListingCardSkeleton } from '../components/discovery/ListingCardSkeleton';
import { ListingDetailDrawer } from '../components/discovery/ListingDetailDrawer';
import { ListingEmpty } from '../components/discovery/ListingEmpty';
import { ListingPagination } from '../components/discovery/ListingPagination';
import { MessCard } from '../components/discovery/MessCard';
import { MessDetailPanel } from '../components/discovery/MessDetailPanel';
import { MessFilters } from '../components/discovery/MessFilters';
import { messFilterChips } from '../components/discovery/messFilterChips';
import { DEFAULT_MESS_QUERY, messQueryIsFiltered } from '../data/listings/defaults';
import { filterMesses, uniqueCities, uniqueLocalities } from '../data/listings';
import { useMessListings } from '../data/listings/useDiscoverListings';
import type { MessQuery } from '../data/listings/types';
import { applySeo } from '../lib/seo';
import { readEnquireIntent } from '../auth/enquireIntent';

const PAGE_SIZE = 12;

export function MealsPage() {
  const { t } = useTranslation();
  const { listings, status, reload } = useMessListings();
  const localities = uniqueLocalities(listings);
  const cities = uniqueCities(listings);
  const [query, setQuery] = useState<MessQuery>(DEFAULT_MESS_QUERY);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [enquireOpen, setEnquireOpen] = useState(false);
  const restoredEnquire = useRef(false);

  useEffect(() => {
    applySeo({
      title: t('mealsPage.seo.title'),
      description: t('mealsPage.seo.description'),
      path: '/meals',
    });
  }, [t]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    if (restoredEnquire.current || status !== 'ready') return;
    const intent = readEnquireIntent();
    if (!intent || intent.listingKind !== 'mess') return;
    if (!listings.some((item) => item.id === intent.listingId)) return;
    restoredEnquire.current = true;
    setSelectedId(intent.listingId);
    setDetailOpen(true);
    setEnquireOpen(true);
  }, [listings, status]);

  const results = useMemo(() => filterMesses(listings, query), [listings, query]);
  const chips = messFilterChips(query, setQuery, t);
  const filtered = messQueryIsFiltered(query) || query.query.trim().length > 0;
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const shown = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selected = listings.find((item) => item.id === selectedId) ?? null;
  const cityLabel = cities.length === 1 ? cities[0] : cities.length > 1 ? cities.slice(0, 2).join(', ') : t('mealsPage.regionFallback');

  useEffect(() => {
    if (selectedId && !listings.some((item) => item.id === selectedId)) {
      setSelectedId(null);
      setDetailOpen(false);
    }
  }, [listings, selectedId]);

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
        eyebrow={t('mealsPage.eyebrow')}
        title={t('mealsPage.title')}
        description={t('mealsPage.description')}
        search={
          <DiscoverySearchBar
            searchId="meals-search"
            searchLabel={t('mealsPage.searchLabel')}
            searchValue={query.query}
            searchPlaceholder={t('mealsPage.searchPlaceholder')}
            onSearchChange={(value) => setQuery({ ...query, query: value })}
            city={cityLabel}
            sortId="meals-sort"
            sortValue={query.sort}
            onSortChange={(sort) => setQuery({ ...query, sort })}
          />
        }
        filters={
          <>
            <h2 className="text-sm font-semibold text-navy">{t('discovery.filters')}</h2>
            <div className="mt-4">
              <MessFilters query={query} localities={localities} onChange={setQuery} />
            </div>
          </>
        }
        toolbar={
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-text-secondary">
                {status === 'loading'
                  ? t('mealsPage.loading')
                  : t(results.length === 1 ? 'mealsPage.foundOne' : 'mealsPage.foundMany', {
                      count: results.length,
                    })}
              </p>
              <ActionButton onClick={() => setSheetOpen(true)} variant="ghost" className="lg:hidden">
                <SlidersHorizontal aria-hidden className="h-4 w-4" />
                {t('discovery.filters')}
              </ActionButton>
            </div>
            <div className="mt-3">
              <ActiveFilterChips filters={chips} onClearAll={clearFilters} />
            </div>
          </>
        }
        results={
          status === 'loading' ? (
            <ListingCardSkeleton />
          ) : status === 'error' ? (
            <div className="mt-6">
              <ListingEmpty
                title={t('mealsPage.loadErrorTitle')}
                description={t('mealsPage.loadErrorDescription')}
                actionLabel={t('discovery.retry')}
                onClear={reload}
              />
            </div>
          ) : results.length === 0 ? (
            <div className="mt-6">
              <ListingEmpty
                title={t('mealsPage.emptyTitle')}
                description={t('mealsPage.emptyDescription')}
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
        title={t('discovery.filters')}
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
        title={selected?.name ?? t('mealsPage.detailFallback')}
        onClose={() => setDetailOpen(false)}
      >
        {selected ? <MessDetailPanel listing={selected} onEnquire={() => setEnquireOpen(true)} /> : null}
      </ListingDetailDrawer>

      <EnquireDialog
        open={enquireOpen}
        listingId={selected?.id ?? ''}
        listingName={selected?.name ?? ''}
        listingKind="mess"
        onClose={() => setEnquireOpen(false)}
      />
    </>
  );
}
