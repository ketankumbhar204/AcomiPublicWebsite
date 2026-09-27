import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { locationsApi } from '../api/locationsApi';
import { ActionButton } from '../components/common/ActionButton';
import { DiscoveryPageShell } from '../components/discovery/DiscoveryPageShell';
import { DiscoverySearchBar } from '../components/discovery/DiscoverySearchBar';
import { EnquireDialog } from '../components/discovery/EnquireDialog';
import { ListingCardSkeleton } from '../components/discovery/ListingCardSkeleton';
import { ListingDetailDrawer } from '../components/discovery/ListingDetailDrawer';
import { ListingEmpty } from '../components/discovery/ListingEmpty';
import { ListingInfiniteSentinel } from '../components/discovery/ListingInfiniteSentinel';
import { MessCard } from '../components/discovery/MessCard';
import { MessDetailPanel } from '../components/discovery/MessDetailPanel';
import { MessFilters } from '../components/discovery/MessFilters';
import { LocationSelectModal, type SelectedLocation } from '../components/onboarding/LocationSelectModal';
import { DEFAULT_MESS_QUERY } from '../data/listings/defaults';
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

export function MealsPage() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const parsed = useMemo(() => parsePlacesUrlState(searchParams), [searchParams]);
  const selectedLocation = parsed.selectedLocation;
  const [query, setQuery] = useState<MessQuery>(() => ({
    ...DEFAULT_MESS_QUERY,
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
      pincode: selectedLocation?.pincode,
      district: selectedLocation?.district,
      state: selectedLocation?.state,
      cityTaluka: selectedLocation?.cityTaluka,
      search: debouncedSearch,
      sort: query.sort,
    }),
    [
      debouncedSearch,
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
  const enquireResume = readEnquireIntent();
  const skipLocationPrompt = Boolean(
    enquireResume?.resumeAfterAuth && enquireResume.listingKind === 'mess',
  );
  const [locationOpen, setLocationOpen] = useAutoOpenLocationSelect(
    Boolean(selectedLocation?.location),
    skipLocationPrompt,
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailListing, setDetailListing] = useState<MessListing | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [enquireOpen, setEnquireOpen] = useState(false);
  const restoredEnquire = useRef(false);

  const writeMealsUrl = useCallback(
    (nextLocation: PlacesSelectedLocation | null, nextQuery: string) => {
      setSearchParams(buildPlacesSearchParams({ selectedLocation: nextLocation, query: nextQuery }), {
        replace: true,
      });
    },
    [setSearchParams],
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
            return buildPlacesSearchParams({
              selectedLocation: toPlacesSelectedLocation({
                location: selected.location,
                pincode: selected.pincode || match.pincode,
                district: match.district,
                state: match.state,
                cityTaluka: match.cityTaluka,
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

  const filtered = query.query.trim().length > 0 || Boolean(selectedLocation?.location);
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

  const selectListing = (id: string) => {
    setSelectedId(id);
    setDetailOpen(true);
  };

  const toggleSaved = (id: string) => {
    setSavedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
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
          />
        }
        filters={
          <>
            <h2 className="text-sm font-semibold text-navy">{t('discovery.filters')}</h2>
            <div className="mt-4">
              <MessFilters />
            </div>
          </>
        }
        toolbar={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-text-secondary">
              {status === 'loading'
                ? t('mealsPage.loading')
                : t(totalElements === 1 ? 'mealsPage.foundOne' : 'mealsPage.foundMany', {
                    count: totalElements,
                  })}
            </p>
          </div>
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
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {listings.map((listing) => (
                  <MessCard
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
