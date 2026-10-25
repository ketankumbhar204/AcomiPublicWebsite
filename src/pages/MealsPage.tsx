import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { locationsApi } from '../api/locationsApi';
import { ActionButton } from '../components/common/ActionButton';
import { ListingHeaderActions } from '../components/common/PersistentListingActions';
import { ActiveFilterChips } from '../components/discovery/ActiveFilterChips';
import { DiscoveryPageShell } from '../components/discovery/DiscoveryPageShell';
import { DiscoverySearchBar } from '../components/discovery/DiscoverySearchBar';
import { EnquireDialog } from '../components/discovery/EnquireDialog';
import { FilterSheet } from '../components/discovery/FilterSheet';
import { ListingCardSkeleton } from '../components/discovery/ListingCardSkeleton';
import { ListingDetailDrawer } from '../components/discovery/ListingDetailDrawer';
import { ListingEmpty } from '../components/discovery/ListingEmpty';
import { ListingInfiniteSentinel } from '../components/discovery/ListingInfiniteSentinel';
import { MessCard } from '../components/discovery/MessCard';
import type { RevealedOwnerContact } from '../components/discovery/OwnerContactCard';
import { MessDetailPanel } from '../components/discovery/MessDetailPanel';
import { MessFilters } from '../components/discovery/MessFilters';
import { messFilterChips } from '../components/discovery/messFilterChips';
import { LocationSelectModal, type SelectedLocation } from '../components/onboarding/LocationSelectModal';
import { DEFAULT_MESS_QUERY, messQueryIsFiltered } from '../data/listings/defaults';
import { appendMealFilters, parseMealFilters, sameMealCodes } from '../data/listings/mealsFilterUrl';
import { getDiscoverSpaceDetail } from '../data/listings/discoverApi';
import { toMessListing } from '../data/listings/mapDiscoverListing';
import {
  buildPlacesSearchParams,
  formatPlacesLocationLabel,
  parsePlacesUrlState,
  toPlacesSelectedLocation,
  type PlacesSelectedLocation,
} from '../data/listings/placesLocation';
import { usePagedMessListings } from '../data/listings/usePagedMessListings';
import type { MessListing, MessQuery } from '../data/listings/types';
import { applySeo } from '../lib/seo';
import { readEnquireIntent, takeEnquireResumeIntent } from '../auth/enquireIntent';
import { useAutoOpenLocationSelect } from '../data/listings/useAutoOpenLocationSelect';
import { useFavorites } from '../context/FavoritesContext';
import type { ListingSection } from '../data/listings/listingInfo';

const MEALS_RESULTS_GRID =
  'mt-4 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(min(100%,19.25rem),1fr))]';

function activeMealFilterCount(query: MessQuery): number {
  let count = query.localities.length;
  if (query.contactAvailable) count += 1;
  if (query.minMonthly != null || query.maxMonthly != null) count += 1;
  count += query.mealTypes.length + query.foodTypes.length;
  return count;
}

function mealFiltersOf(query: MessQuery) {
  return {
    minMonthly: query.minMonthly,
    maxMonthly: query.maxMonthly,
    contactAvailable: query.contactAvailable,
    mealTypes: query.mealTypes,
    foodTypes: query.foodTypes,
  };
}

export function MealsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const parsed = useMemo(() => parsePlacesUrlState(searchParams), [searchParams]);
  const selectedLocation = parsed.selectedLocation;
  const [query, setQuery] = useState<MessQuery>(() => ({
    ...DEFAULT_MESS_QUERY,
    query: parsed.query,
    ...parseMealFilters(searchParams),
  }));
  const [debouncedSearch, setDebouncedSearch] = useState(parsed.query);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(query.query), 300);
    return () => window.clearTimeout(timer);
  }, [query.query]);
  const discoverFilters = useMemo(
    () => ({
      location: selectedLocation?.location,
      pincode: selectedLocation?.pincode,
      district: selectedLocation?.district,
      state: selectedLocation?.state,
      cityTaluka: selectedLocation?.cityTaluka,
      search: debouncedSearch,
      contactAvailable: query.contactAvailable,
      mealTypes: query.mealTypes,
      foodTypes: query.foodTypes,
      minRent: query.minMonthly,
      maxRent: query.maxMonthly,
      sort: query.sort,
    }),
    [
      debouncedSearch,
      query.contactAvailable,
      query.foodTypes,
      query.mealTypes,
      query.maxMonthly,
      query.minMonthly,
      query.sort,
      selectedLocation?.cityTaluka,
      selectedLocation?.district,
      selectedLocation?.location,
      selectedLocation?.pincode,
      selectedLocation?.state,
    ],
  );
  const { listings, status, reload, loadingMore, loadMoreError, hasMore, totalElements, loadMore } =
    usePagedMessListings(discoverFilters);
  const [sheetOpen, setSheetOpen] = useState(false);
  const enquireResume = readEnquireIntent();
  const skipLocationPrompt = Boolean(
    enquireResume?.resumeAfterAuth && enquireResume.listingKind === 'mess',
  );
  const [locationOpen, setLocationOpen] = useAutoOpenLocationSelect(true, skipLocationPrompt);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailListing, setDetailListing] = useState<MessListing | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [focusSection, setFocusSection] = useState<ListingSection | null>(null);
  const [focusToken, setFocusToken] = useState(0);
  const { isSaved, toggleFavorite } = useFavorites();
  const [enquireOpen, setEnquireOpen] = useState(false);
  const [revealedContact, setRevealedContact] = useState<RevealedOwnerContact | null>(null);

  useEffect(() => {
    setRevealedContact(null);
  }, [selectedId]);
  const restoredEnquire = useRef(false);

  const writeMealsUrl = useCallback(
    (
      nextLocation: PlacesSelectedLocation | null,
      nextQuery: string,
      filters: ReturnType<typeof mealFiltersOf> = mealFiltersOf(query),
    ) => {
      setSearchParams(
        appendMealFilters(
          buildPlacesSearchParams({ selectedLocation: nextLocation, query: nextQuery }),
          filters,
        ),
        { replace: true },
      );
    },
    [query, setSearchParams],
  );

  useEffect(() => {
    applySeo({
      title: t('mealsPage.seo.title'),
      description: t('mealsPage.seo.description'),
      path: '/meals',
    });
  }, [t]);

  useEffect(() => {
    if (parsed.legacyLocationInQ) {
      writeMealsUrl(parsed.selectedLocation, parsed.query);
    }
  }, [parsed.legacyLocationInQ, parsed.query, parsed.selectedLocation, writeMealsUrl]);

  useEffect(() => {
    const filters = parseMealFilters(searchParams);
    setQuery((current) => {
      const queryText = current.query === parsed.query ? current.query : parsed.query;
      if (
        queryText === current.query &&
        current.minMonthly === filters.minMonthly &&
        current.maxMonthly === filters.maxMonthly &&
        current.contactAvailable === filters.contactAvailable &&
        sameMealCodes(current.mealTypes, filters.mealTypes) &&
        sameMealCodes(current.foodTypes, filters.foodTypes)
      ) {
        return current;
      }
      return { ...current, query: queryText, ...filters };
    });
  }, [parsed.query, searchParams]);

  useEffect(() => {
    const selected = parsed.selectedLocation;
    if (!selected?.location || selected.district) {
      return;
    }
    let active = true;
    const lookup = selected.pincode || selected.location;
    locationsApi
      .search(lookup, {
        state: selected.state,
        district: selected.district,
        taluk: selected.cityTaluka,
      })
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
            return appendMealFilters(
              buildPlacesSearchParams({
                selectedLocation: toPlacesSelectedLocation({
                  location: selected.location,
                  pincode: selected.pincode || match.pincode,
                  district: match.district,
                  state: match.state,
                  cityTaluka: match.cityTaluka,
                }),
                query: currentState.query,
              }),
              parseMealFilters(current),
            );
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
    if (!selectedId) {
      setDetailListing(null);
      return;
    }
    let active = true;
    void getDiscoverSpaceDetail(selectedId)
      .then((detail) => {
        if (!active) return;
        setDetailListing(toMessListing(detail));
      })
      .catch(() => {
        if (!active) return;
        setDetailListing(null);
      });
    return () => {
      active = false;
    };
  }, [selectedId]);

  useEffect(() => {
    if (restoredEnquire.current || status !== 'ready') return;
    const intent = takeEnquireResumeIntent('mess');
    if (!intent) return;
    if (!listings.some((item) => item.id === intent.listingId)) return;
    restoredEnquire.current = true;
    setSelectedId(intent.listingId);
    setDetailOpen(true);
    setEnquireOpen(true);
  }, [listings, status]);

  const updateQuery = (next: MessQuery) => {
    setQuery(next);
    writeMealsUrl(selectedLocation, next.query, mealFiltersOf(next));
  };

  const chips = messFilterChips(query, updateQuery, t);
  const filtered =
    messQueryIsFiltered(query) || query.query.trim().length > 0 || Boolean(selectedLocation?.location);

  const clearFilters = () => {
    const next = { ...DEFAULT_MESS_QUERY, query: query.query, sort: query.sort };
    setQuery(next);
    writeMealsUrl(selectedLocation, next.query, mealFiltersOf(next));
  };
  const selected =
    detailListing?.id === selectedId
      ? detailListing
      : (listings.find((item) => item.id === selectedId) ?? null);
  const locationLabel = selectedLocation ? formatPlacesLocationLabel(selectedLocation) : '';

  useEffect(() => {
    if (selectedId && !listings.some((item) => item.id === selectedId) && detailListing?.id !== selectedId) {
      setSelectedId(null);
      setDetailOpen(false);
    }
  }, [detailListing?.id, listings, selectedId]);

  const handleSearchChange = (value: string) => {
    setQuery({ ...query, query: value });
    writeMealsUrl(selectedLocation, value);
  };

  const handleLocationConfirm = (next: SelectedLocation) => {
    setLocationOpen(false);
    writeMealsUrl(toPlacesSelectedLocation(next), query.query);
  };

  const handleLocationClear = () => {
    writeMealsUrl(null, query.query);
  };

  const selectListing = (id: string, section?: ListingSection | null) => {
    setSelectedId(id);
    setFocusSection(section ?? null);
    setFocusToken((value) => value + 1);
    setDetailOpen(true);
  };

  const emptyTitle = selectedLocation?.location
    ? t('mealsPage.emptyInLocation', { location: selectedLocation.location })
    : t('mealsPage.emptyTitle');
  const emptyDescription = selectedLocation?.location
    ? t('mealsPage.emptyInLocationDescription')
    : t('mealsPage.emptyDescription');

  return (
    <>
      <DiscoveryPageShell
        eyebrow={t('mealsPage.eyebrow')}
        title={t('mealsPage.title')}
        description={t('mealsPage.description')}
        headerActions={<ListingHeaderActions />}
        search={
          <DiscoverySearchBar
            searchId="meals-search"
            searchLabel={t('mealsPage.searchLabel')}
            searchValue={query.query}
            searchPlaceholder={t('mealsPage.searchPlaceholder')}
            onSearchChange={handleSearchChange}
            locationLabel={locationLabel || null}
            locationPlaceholder={t('mealsPage.selectLocation', { defaultValue: 'Select location' })}
            onLocationClick={() => setLocationOpen(true)}
            onLocationClear={locationLabel ? handleLocationClear : undefined}
            sortId="meals-sort"
            sortValue={query.sort}
            onSortChange={(sort) => setQuery({ ...query, sort })}
            onOpenFilters={() => setSheetOpen(true)}
            filtersOpen={sheetOpen}
            activeFilterCount={activeMealFilterCount(query)}
          />
        }
        hideSidebar
        toolbar={
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="text-sm text-text-secondary">
              {status === 'loading'
                ? t('mealsPage.loading')
                : !selectedLocation
                  ? t('mealsPage.foundAll', { count: totalElements })
                  : t(totalElements === 1 ? 'mealsPage.foundOne' : 'mealsPage.foundMany', {
                      count: totalElements,
                    })}
            </p>
            <ActiveFilterChips filters={chips} onClearAll={clearFilters} />
          </div>
        }
        results={
          status === 'loading' ? (
            <ListingCardSkeleton gridClassName={MEALS_RESULTS_GRID} compact />
          ) : status === 'error' ? (
            <div className="mt-6">
              <ListingEmpty
                title={t('mealsPage.loadErrorTitle')}
                description={t('mealsPage.loadErrorDescription')}
                actionLabel={t('discovery.retry')}
                onClear={reload}
              />
            </div>
          ) : listings.length === 0 ? (
            <div className="mt-6">
              <ListingEmpty
                title={emptyTitle}
                description={emptyDescription}
                onClear={filtered ? () => writeMealsUrl(selectedLocation, '') : () => writeMealsUrl(null, '')}
              />
            </div>
          ) : (
            <>
              <div className={MEALS_RESULTS_GRID}>
                {listings.map((listing) => (
                  <MessCard
                    key={listing.id}
                    listing={listing}
                    selected={detailOpen && selected?.id === listing.id}
                    saved={isSaved(listing.id)}
                    onSelect={() => selectListing(listing.id)}
                    onOpenSection={(section) => selectListing(listing.id, section)}
                    onToggleSave={() =>
                      toggleFavorite({
                        id: listing.id,
                        kind: 'meals',
                        name: listing.name,
                        detail: [listing.locality, listing.city].filter(Boolean).join(', '),
                      })
                    }
                    onEnquire={() => {
                      setSelectedId(listing.id);
                      setEnquireOpen(true);
                    }}
                  />
                ))}
              </div>
              {loadingMore ? (
                <p className="mt-6 text-center text-sm text-text-secondary">{t('mealsPage.loadingMore')}</p>
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
        labelledBy="meals-filters-title"
        value={query}
        onClose={() => setSheetOpen(false)}
        onApply={updateQuery}
        onClear={clearFilters}
      >
        {(draft, setDraft) => <MessFilters query={draft} onChange={setDraft} />}
      </FilterSheet>

      <ListingDetailDrawer
        open={detailOpen && selected != null}
        titleId="meals-detail-title"
        title={selected?.name ?? t('mealsPage.detailFallback')}
        onClose={() => setDetailOpen(false)}
      >
        {selected ? (
          <MessDetailPanel
            listing={selected}
            revealedContact={revealedContact}
            focusSection={focusSection}
            focusToken={focusToken}
            onEnquire={() => setEnquireOpen(true)}
          />
        ) : null}
      </ListingDetailDrawer>

      <EnquireDialog
        open={enquireOpen}
        listingId={selected?.id ?? ''}
        listingName={selected?.name ?? ''}
        listingKind="mess"
        onClose={() => setEnquireOpen(false)}
        onOpen={() => setEnquireOpen(true)}
        onViewedHere={(contact) => {
          setRevealedContact(contact);
          setDetailOpen(true);
          setEnquireOpen(false);
        }}
      />
    </>
  );
}
