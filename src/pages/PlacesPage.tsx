import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { locationsApi } from '../api/locationsApi';
import { ActionButton } from '../components/common/ActionButton';
import { ActiveFilterChips } from '../components/discovery/ActiveFilterChips';
import { DiscoveryPageShell } from '../components/discovery/DiscoveryPageShell';
import { DiscoverySearchBar } from '../components/discovery/DiscoverySearchBar';
import { EnquireDialog } from '../components/discovery/EnquireDialog';
import { FilterSheet } from '../components/discovery/FilterSheet';
import { ListingCardSkeleton } from '../components/discovery/ListingCardSkeleton';
import { ListingDetailDrawer } from '../components/discovery/ListingDetailDrawer';
import { ListingEmpty } from '../components/discovery/ListingEmpty';
import { ListingInfiniteSentinel } from '../components/discovery/ListingInfiniteSentinel';
import { PropertyCard } from '../components/discovery/PropertyCard';
import { PropertyDetailPanel } from '../components/discovery/PropertyDetailPanel';
import { PropertyFilters } from '../components/discovery/PropertyFilters';
import { propertyFilterChips } from '../components/discovery/propertyFilterChips';
import { LocationSelectModal, type SelectedLocation } from '../components/onboarding/LocationSelectModal';
import {
  DEFAULT_PROPERTY_QUERY,
  propertyQueryIsFiltered,
} from '../data/listings/defaults';
import {
  buildPlacesSearchParams,
  formatPlacesLocationLabel,
  parsePlacesUrlState,
  toPlacesSelectedLocation,
  type PlacesSelectedLocation,
} from '../data/listings/placesLocation';
import { usePagedPropertyListings } from '../data/listings/usePagedPropertyListings';
import type { PropertyQuery } from '../data/listings/types';
import { applySeo } from '../lib/seo';
import { readEnquireIntent, takeEnquireResumeIntent } from '../auth/enquireIntent';
import { useAutoOpenLocationSelect } from '../data/listings/useAutoOpenLocationSelect';

export function PlacesPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const parsed = useMemo(() => parsePlacesUrlState(searchParams), [searchParams]);
  const selectedLocation = parsed.selectedLocation;
  const [query, setQuery] = useState<PropertyQuery>(() => ({
    ...DEFAULT_PROPERTY_QUERY,
    query: parsed.query,
  }));
  const [debouncedSearch, setDebouncedSearch] = useState(parsed.query);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(query.query), 300);
    return () => window.clearTimeout(timer);
  }, [query.query]);
  const discoverFilters = useMemo(
    () => ({
      location: selectedLocation?.location,
      search: debouncedSearch,
      types: query.types,
      minRent: query.minPrice,
      maxRent: query.maxPrice,
      amenities: query.amenities,
      sort: query.sort,
    }),
    [
      debouncedSearch,
      query.amenities,
      query.maxPrice,
      query.minPrice,
      query.sort,
      query.types,
      selectedLocation?.location,
    ],
  );
  const { listings, status, reload, loadingMore, loadMoreError, hasMore, totalElements, loadMore } =
    usePagedPropertyListings(discoverFilters);
  const [sheetOpen, setSheetOpen] = useState(false);
  const enquireResume = readEnquireIntent();
  const skipLocationPrompt = Boolean(
    enquireResume?.resumeAfterAuth && enquireResume.listingKind === 'places',
  );
  const [locationOpen, setLocationOpen] = useAutoOpenLocationSelect(
    Boolean(selectedLocation?.location),
    skipLocationPrompt,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [enquireOpen, setEnquireOpen] = useState(false);
  const restoredEnquire = useRef(false);

  const writePlacesUrl = useCallback(
    (nextLocation: PlacesSelectedLocation | null, nextQuery: string) => {
      setSearchParams(buildPlacesSearchParams({ selectedLocation: nextLocation, query: nextQuery }), {
        replace: true,
      });
    },
    [setSearchParams],
  );

  useEffect(() => {
    applySeo({
      title: t('places.seo.title'),
      description: t('places.seo.description'),
      path: '/places',
    });
  }, [t]);

  useEffect(() => {
    if (parsed.legacyLocationInQ) {
      writePlacesUrl(parsed.selectedLocation, parsed.query);
    }
  }, [parsed.legacyLocationInQ, parsed.query, parsed.selectedLocation, setSearchParams]);

  useEffect(() => {
    setQuery((current) => (current.query === parsed.query ? current : { ...current, query: parsed.query }));
  }, [parsed.query]);

  useEffect(() => {
    const selected = parsed.selectedLocation;
    if (!selected?.location || selected.district) {
      return;
    }
    let active = true;
    const lookup = selected.pincode || selected.location;
    locationsApi
      .search(lookup)
      .then((results) => {
        if (!active) return;
        const match =
          results.find(
            (record) =>
              record.location.toLowerCase() === selected.location.toLowerCase() &&
              (!selected.pincode || record.pincode === selected.pincode),
          ) ?? results.find((record) => selected.pincode && record.pincode === selected.pincode);
        if (!match?.district) return;
        setSearchParams(
          (current) => {
            const currentState = parsePlacesUrlState(current);
            return buildPlacesSearchParams({
              selectedLocation: toPlacesSelectedLocation({
                location: selected.location,
                pincode: selected.pincode || match.pincode,
                district: match.district,
                state: match.state,
              }),
              query: currentState.query,
            });
          },
          { replace: true },
        );
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [parsed.selectedLocation, setSearchParams]);

  useEffect(() => {
    if (restoredEnquire.current || status !== 'ready') return;
    const intent = takeEnquireResumeIntent('places');
    if (!intent) return;
    if (!listings.some((item) => item.id === intent.listingId)) return;
    restoredEnquire.current = true;
    setSelectedId(intent.listingId);
    setDetailOpen(true);
    setEnquireOpen(true);
  }, [listings, status]);

  const chips = propertyFilterChips(query, setQuery, t);
  const filtered =
    propertyQueryIsFiltered(query) ||
    query.query.trim().length > 0 ||
    Boolean(selectedLocation?.location);
  const selected = listings.find((item) => item.id === selectedId) ?? null;
  const locationLabel = selectedLocation ? formatPlacesLocationLabel(selectedLocation) : '';

  useEffect(() => {
    if (selectedId && !listings.some((item) => item.id === selectedId)) {
      setSelectedId(null);
      setDetailOpen(false);
    }
  }, [listings, selectedId]);

  const clearFilters = () =>
    setQuery({ ...DEFAULT_PROPERTY_QUERY, query: query.query, sort: query.sort });

  const handleSearchChange = (value: string) => {
    setQuery({ ...query, query: value });
    writePlacesUrl(selectedLocation, value);
  };

  const handleLocationConfirm = (next: SelectedLocation) => {
    setLocationOpen(false);
    writePlacesUrl(toPlacesSelectedLocation(next), query.query);
  };

  const handleLocationClear = () => {
    writePlacesUrl(null, query.query);
  };

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
            onSearchChange={handleSearchChange}
            locationLabel={locationLabel || null}
            locationPlaceholder={t('places.selectLocation', { defaultValue: 'Select location' })}
            onLocationClick={() => setLocationOpen(true)}
            onLocationClear={locationLabel ? handleLocationClear : undefined}
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
                localities={[]}
                onChange={setQuery}
              />
            </div>
          </>
        }
        toolbar={
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-text-secondary">
                {status === 'loading'
                  ? t('places.loading')
                  : t(totalElements === 1 ? 'places.foundOne' : 'places.foundMany', {
                      count: totalElements,
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
                title={t('places.loadErrorTitle')}
                description={t('places.loadErrorDescription')}
                actionLabel={t('discovery.retry')}
                onClear={reload}
              />
            </div>
          ) : listings.length === 0 ? (
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
                {listings.map((listing) => (
                  <PropertyCard
                    key={listing.id}
                    listing={listing}
                    selected={detailOpen && selected?.id === listing.id}
                    saved={savedIds.includes(listing.id)}
                    onSelect={() => selectListing(listing.id)}
                    onToggleSave={() => toggleSaved(listing.id)}
                    onEnquire={() => {
                      setSelectedId(listing.id);
                      setEnquireOpen(true);
                    }}
                  />
                ))}
              </div>
              {loadingMore ? (
                <p className="mt-6 text-center text-sm text-text-secondary">{t('places.loadingMore')}</p>
              ) : null}
              {loadMoreError ? (
                <div className="mt-6 flex justify-center">
                  <ActionButton onClick={loadMore} variant="ghost">
                    {t('discovery.retry')}
                  </ActionButton>
                </div>
              ) : null}
              <ListingInfiniteSentinel
                onVisible={loadMore}
                disabled={!hasMore || loadingMore || loadMoreError || status !== 'ready'}
              />
            </>
          )
        }
      />

      <LocationSelectModal
        open={locationOpen}
        onClose={() => setLocationOpen(false)}
        onConfirm={handleLocationConfirm}
        applyOnSelect
        rankingContext={
          selectedLocation
            ? {
                state: selectedLocation.state,
                district: selectedLocation.district,
                taluk: selectedLocation.cityTaluka,
              }
            : undefined
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
            localities={[]}
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
        listingId={selected?.id ?? ''}
        listingName={selected?.name ?? ''}
        listingKind="places"
        onClose={() => setEnquireOpen(false)}
      />
    </>
  );
}
