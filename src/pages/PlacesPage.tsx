import { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ActionButton } from '../components/common/ActionButton';
import { ActiveFilterChips } from '../components/discovery/ActiveFilterChips';
import { DiscoveryPageShell } from '../components/discovery/DiscoveryPageShell';
import { DiscoverySearchBar } from '../components/discovery/DiscoverySearchBar';
import { EnquireDialog } from '../components/discovery/EnquireDialog';
import { FilterSheet } from '../components/discovery/FilterSheet';
import { ListingDetailDrawer } from '../components/discovery/ListingDetailDrawer';
import { ListingEmpty } from '../components/discovery/ListingEmpty';
import { ListingPagination } from '../components/discovery/ListingPagination';
import { PropertyCard } from '../components/discovery/PropertyCard';
import { PropertyDetailPanel } from '../components/discovery/PropertyDetailPanel';
import { PropertyFilters } from '../components/discovery/PropertyFilters';
import { propertyFilterChips } from '../components/discovery/propertyFilterChips';
import {
  DEFAULT_PROPERTY_QUERY,
  propertyQueryIsFiltered,
} from '../data/listings/defaults';
import { filterProperties, getPropertyListings, uniqueLocalities } from '../data/listings';
import type { PropertyQuery } from '../data/listings/types';
import { applySeo } from '../lib/seo';

const PAGE_SIZE = 12;

export function PlacesPage() {
  const { t } = useTranslation();
  const listings = getPropertyListings();
  const localities = uniqueLocalities(listings);
  const [query, setQuery] = useState<PropertyQuery>(DEFAULT_PROPERTY_QUERY);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [enquireOpen, setEnquireOpen] = useState(false);

  useEffect(() => {
    applySeo({
      title: t('places.seo.title'),
      description: t('places.seo.description'),
      path: '/places',
    });
  }, [t]);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const results = useMemo(() => filterProperties(listings, query), [listings, query]);
  const chips = propertyFilterChips(query, setQuery, t);
  const filtered = propertyQueryIsFiltered(query) || query.query.trim().length > 0;
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
    setQuery({ ...DEFAULT_PROPERTY_QUERY, query: query.query, sort: query.sort });

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
        eyebrow={t('places.eyebrow')}
        title={t('places.title')}
        description={t('places.description')}
        search={
          <DiscoverySearchBar
            searchId="places-search"
            searchLabel={t('places.searchLabel')}
            searchValue={query.query}
            searchPlaceholder={t('places.searchPlaceholder')}
            onSearchChange={(value) => setQuery({ ...query, query: value })}
            city="Pune"
            sortId="places-sort"
            sortValue={query.sort}
            onSortChange={(sort) => setQuery({ ...query, sort })}
          />
        }
        filters={
          <>
            <h2 className="text-sm font-semibold text-navy">{t('discovery.filters')}</h2>
            <div className="mt-4">
              <PropertyFilters
                query={query}
                listings={listings}
                localities={localities}
                onChange={setQuery}
              />
            </div>
          </>
        }
        toolbar={
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-text-secondary">
                {t(results.length === 1 ? 'places.foundOne' : 'places.foundMany', {
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
          results.length === 0 ? (
            <div className="mt-6">
              <ListingEmpty
                title={t('places.emptyTitle')}
                description={t('places.emptyDescription')}
                onClear={filtered ? clearFilters : () => setQuery(DEFAULT_PROPERTY_QUERY)}
              />
            </div>
          ) : (
            <>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {shown.map((listing) => (
                  <PropertyCard
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
        labelledBy="places-filters-title"
        value={query}
        onClose={() => setSheetOpen(false)}
        onApply={setQuery}
        onClear={clearFilters}
      >
        {(draft, setDraft) => (
          <PropertyFilters
            query={draft}
            listings={listings}
            localities={localities}
            onChange={setDraft}
          />
        )}
      </FilterSheet>

      <ListingDetailDrawer
        open={detailOpen && selected != null}
        titleId="places-detail-title"
        title={selected?.name ?? t('places.detailFallback')}
        onClose={() => setDetailOpen(false)}
      >
        {selected ? <PropertyDetailPanel listing={selected} onEnquire={() => setEnquireOpen(true)} /> : null}
      </ListingDetailDrawer>

      <EnquireDialog
        open={enquireOpen}
        title={selected ? t('discovery.enquireAbout', { name: selected.name }) : t('discovery.enquire')}
        onClose={() => setEnquireOpen(false)}
      />
    </>
  );
}
