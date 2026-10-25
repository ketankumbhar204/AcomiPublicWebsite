import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Building2, ChevronLeft, ChevronRight, MoreHorizontal, Pencil, UtensilsCrossed, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { listMyListings, type MeListing } from '../auth/mySpacesApi';
import { appHref, showsAccommodation, showsManage, showsMeals, showsPublicListing } from '../auth/mySpacesActions';
import {
  applyListingFilters,
  listingFacetCounts,
  paginateListings,
  type KindFilter,
  type ListingSort,
  type StatusFilter,
} from '../auth/mySpacesView';
import { PublicApiError } from '../lib/apiClient';
import { API_BASE_URL } from '../config/env';
import { RequireAuth } from '../components/auth/RequireAuth';
import { ActionButton } from '../components/common/ActionButton';
import { ListingCardSkeleton } from '../components/discovery/ListingCardSkeleton';
import { MessCard } from '../components/discovery/MessCard';
import { PropertyCard } from '../components/discovery/PropertyCard';
import { Container } from '../components/layout/Container';
import { APP } from '../constants/links';
import { useFavorites } from '../context/FavoritesContext';
import { useListingDrawer } from '../context/ListingDrawerContext';
import type { MessListing, PropertyListing } from '../data/listings/types';
import type { PropertyType } from '../api/types';
import { isPriceBasis } from '../lib/priceBasis';
import { applySeo } from '../lib/seo';

/** Same track as Places and Meals: four readable cards on a 1366px desktop. */
const RESULTS_GRID =
  'mt-4 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(min(100%,19.25rem),1fr))]';

function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const origin = API_BASE_URL.replace(/\/api\/v1\/?$/, '');
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

export function MySpacesPage() {
  return (
    <RequireAuth>
      <MySpacesView />
    </RequireAuth>
  );
}

function MySpacesView() {
  const { t } = useTranslation();
  const { openListing, openListingEdit, subscribeListingSaved } = useListingDrawer();
  const [items, setItems] = useState<MeListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<KindFilter>('ALL');
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [spaceType, setSpaceType] = useState('');
  const [sort, setSort] = useState<ListingSort>('updated');
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setItems(await listMyListings());
    } catch (err) {
      setError(err instanceof PublicApiError ? err.message : t('mySpaces.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    applySeo({
      title: t('mySpaces.title'),
      description: t('mySpaces.subtitle'),
      path: '/my-spaces',
    });
  }, [t]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [kind, status, search, city, spaceType, sort]);

  useEffect(
    () =>
      subscribeListingSaved(() => {
        setNotice(t('mySpaces.saved'));
        setLoading(true);
        void load();
      }),
    [load, subscribeListingSaved, t],
  );

  const filters = { kind, status, search, city, spaceType, sort };
  const counts = useMemo(
    () => listingFacetCounts(items, { search, city, spaceType }),
    [city, items, search, spaceType],
  );
  const filtered = useMemo(() => applyListingFilters(items, filters), [city, items, kind, search, sort, spaceType, status]);
  const pageView = paginateListings(filtered, page);
  const cities = useMemo(
    () => [...new Set(items.map((item) => item.city?.trim()).filter((value): value is string => Boolean(value)))].sort(),
    [items],
  );
  const types = useMemo(
    () => [...new Set(items.map((item) => item.spaceType).filter((value): value is string => Boolean(value)))].sort(),
    [items],
  );
  const filtersActive = Boolean(search.trim() || city || spaceType || kind !== 'ALL' || status !== 'ALL');
  const emptyAccount = !loading && !error && items.length === 0;

  function clearFilters() {
    setKind('ALL');
    setStatus('ALL');
    setSearch('');
    setCity('');
    setSpaceType('');
    setSort('updated');
  }

  return (
    <section className="bg-background py-8 sm:py-10">
      <Container>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">{t('mySpaces.title')}</h1>
          <p className="mt-1 max-w-2xl text-sm text-text-secondary">{t('mySpaces.subtitle')}</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label={t('mySpaces.title')}>
          <FilterChip label={`${t('mySpaces.all')} (${counts.all})`} selected={kind === 'ALL'} onClick={() => setKind('ALL')} />
          <FilterChip label={`${t('mySpaces.properties')} (${counts.properties})`} selected={kind === 'PROPERTY'} onClick={() => setKind('PROPERTY')} />
          <FilterChip label={`${t('mySpaces.messes')} (${counts.messes})`} selected={kind === 'MESS'} onClick={() => setKind('MESS')} />
          <FilterChip label={`${t('mySpaces.live')} (${counts.live})`} selected={status === 'LIVE'} onClick={() => setStatus(status === 'LIVE' ? 'ALL' : 'LIVE')} />
          <FilterChip label={`${t('mySpaces.pending')} (${counts.pending})`} selected={status === 'PENDING'} onClick={() => setStatus(status === 'PENDING' ? 'ALL' : 'PENDING')} />
        </div>

        <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-center">
          <label className="relative block min-w-0 flex-1">
            <span className="sr-only">{t('mySpaces.search')}</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('mySpaces.search')}
              className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 pr-10 text-sm text-navy outline-none focus-visible:ring-2 focus-visible:ring-register"
            />
            {search ? (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label={t('mySpaces.clearSearch')}
                className="absolute top-1/2 right-2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-text-secondary hover:bg-soft"
              >
                <X aria-hidden className="h-4 w-4" />
              </button>
            ) : null}
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex">
            <FilterSelect label={t('mySpaces.location')} value={city} onChange={setCity}>
              <option value="">{t('mySpaces.allLocations')}</option>
              {cities.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </FilterSelect>
            <FilterSelect label={t('mySpaces.type')} value={spaceType} onChange={setSpaceType}>
              <option value="">{t('mySpaces.allTypes')}</option>
              {types.map((value) => (
                <option key={value} value={value}>
                  {t(`discovery.propertyTypes.${value}`, { defaultValue: value.replaceAll('_', ' ') })}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label={t('mySpaces.status')} value={status === 'ALL' ? '' : status} onChange={(value) => setStatus(value === 'LIVE' || value === 'PENDING' ? value : 'ALL')}>
              <option value="">{t('mySpaces.allStatuses')}</option>
              <option value="LIVE">{t('mySpaces.live')}</option>
              <option value="PENDING">{t('mySpaces.pending')}</option>
            </FilterSelect>
            <FilterSelect label={t('mySpaces.sort')} value={sort} onChange={(value) => setSort(value as ListingSort)}>
              <option value="updated">{t('mySpaces.sortUpdated')}</option>
              <option value="name">{t('mySpaces.sortName')}</option>
              <option value="priceAsc">{t('mySpaces.sortPriceAsc')}</option>
              <option value="priceDesc">{t('mySpaces.sortPriceDesc')}</option>
            </FilterSelect>
          </div>
        </div>

        {notice ? <p className="mt-3 text-sm font-medium text-register">{notice}</p> : null}
        {error && items.length > 0 ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        {loading && items.length === 0 ? (
          <div aria-busy="true" aria-live="polite">
            <span className="sr-only">{t('mySpaces.loading')}</span>
            <ListingCardSkeleton gridClassName={RESULTS_GRID} compact />
          </div>
        ) : null}

        {error && items.length === 0 ? (
          <div className="mt-8 rounded-[24px] border border-black/5 bg-white px-6 py-10 text-center">
            <p className="text-sm text-text-secondary">{error}</p>
            <div className="mt-4 flex justify-center">
              <ActionButton
                variant="ghost"
                onClick={() => {
                  setLoading(true);
                  void load();
                }}
              >
                {t('mySpaces.retry')}
              </ActionButton>
            </div>
          </div>
        ) : null}

        {emptyAccount ? (
          <div className="mt-8 rounded-[24px] border border-black/5 bg-white px-6 py-14 text-center">
            <Building2 aria-hidden className="mx-auto h-7 w-7 text-coral" />
            <h2 className="mt-3 text-xl font-semibold text-navy">{t('mySpaces.emptyTitle')}</h2>
            <p className="mt-2 text-sm text-text-secondary">{t('mySpaces.emptyBody')}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <ActionButton onClick={() => openListing('property')}>{t('mySpaces.listProperty')}</ActionButton>
              <ActionButton variant="outline" className="!text-register !ring-register hover:!bg-register-soft" onClick={() => openListing('mess')}>
                {t('mySpaces.listMess')}
              </ActionButton>
            </div>
          </div>
        ) : null}

        {!loading && !error && !emptyAccount && filtered.length === 0 ? (
          <div className="mt-8 text-center">
            <p className="text-sm text-text-secondary">{t('mySpaces.noMatches')}</p>
            {filtersActive ? (
              <button type="button" onClick={clearFilters} className="mt-3 text-sm font-semibold text-register">
                {t('mySpaces.clearFilters')}
              </button>
            ) : null}
          </div>
        ) : null}

        {pageView.slice.length > 0 ? (
          <div className={RESULTS_GRID}>
            {pageView.slice.map((listing) => (
              <ListingCard
                key={listing.spaceId ?? listing.registrationId}
                listing={listing}
                onEdit={() => {
                  setNotice(null);
                  openListingEdit(listing);
                }}
              />
            ))}
          </div>
        ) : null}

        {filtered.length > 0 ? (
          <div className="mt-5 flex flex-col gap-3 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
            <p>{t('mySpaces.showing', { from: pageView.from, to: pageView.to, count: filtered.length })}</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={t('mySpaces.previous')}
                disabled={pageView.page <= 1}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-navy disabled:opacity-40"
              >
                <ChevronLeft aria-hidden className="h-4 w-4" />
              </button>
              <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-register px-3 font-semibold text-white">
                {pageView.page}
              </span>
              <button
                type="button"
                aria-label={t('mySpaces.next')}
                disabled={pageView.page >= pageView.pages}
                onClick={() => setPage((value) => value + 1)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-navy disabled:opacity-40"
              >
                <ChevronRight aria-hidden className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : null}

      </Container>
    </section>
  );
}

const PROPERTY_TYPES: readonly PropertyType[] = ['PG', 'HOSTEL', 'CO_LIVING', 'RENTAL', 'CORPORATE_STAY', 'MESS'];

function mediaAmount(value: number | string | null | undefined): number | null {
  if (value == null || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function listingImages(listing: MeListing): string[] {
  const gallery = (listing.gallery ?? [])
    .map((photo) => mediaUrl(photo.contentUrl))
    .filter((url): url is string => Boolean(url));
  if (gallery.length > 0) return gallery;
  const cover = mediaUrl(listing.coverImageUrl);
  if (cover) return [cover];
  if (listing.photoFileId) {
    const file = mediaUrl(`/api/v1/files/${listing.photoFileId}/content`);
    return file ? [file] : [];
  }
  return [];
}

function toPropertyCardListing(listing: MeListing): PropertyListing {
  const type = PROPERTY_TYPES.find((item) => item === listing.spaceType) ?? 'PG';
  const gender = listing.genderPolicy === 'MALE' || listing.genderPolicy === 'FEMALE' || listing.genderPolicy === 'MIXED'
    ? listing.genderPolicy
    : null;
  return {
    id: listing.spaceId ?? listing.registrationId ?? listing.name,
    type,
    name: listing.name,
    description: listing.description ?? '',
    addressLine: listing.address ?? '',
    locality: '',
    city: listing.city ?? '',
    state: listing.state ?? '',
    pincode: listing.pincode ?? '',
    mapUrl: listing.mapUrl ?? undefined,
    latitude: mediaAmount(listing.latitude),
    longitude: mediaAmount(listing.longitude),
    startingPrice: mediaAmount(listing.startingPrice),
    priceBasis: isPriceBasis(listing.priceBasis) ? listing.priceBasis : null,
    capacityEstimate: listing.capacityEstimate ?? null,
    amenityCodes: (listing.amenities ?? []).map((item) => item.code),
    foodIncludedInRent: listing.foodIncluded === true,
    foodAvailability: listing.foodIncluded ? 'INCLUDED' : null,
    genderPolicy: gender,
    hasContact: Boolean(listing.contactNumber?.trim()),
    hasMobileContact: Boolean(listing.contactNumber?.trim()),
    sharingNotes: listing.sharingNotes ?? undefined,
    listingMetadata: { images: listingImages(listing) },
  };
}

function toMessCardListing(listing: MeListing): MessListing {
  return {
    id: listing.spaceId ?? listing.registrationId ?? listing.name,
    name: listing.name,
    description: listing.description ?? '',
    addressLine: listing.address ?? '',
    locality: '',
    city: listing.city ?? '',
    state: listing.state ?? '',
    pincode: listing.pincode ?? '',
    mapUrl: listing.mapUrl ?? undefined,
    latitude: mediaAmount(listing.latitude),
    longitude: mediaAmount(listing.longitude),
    monthlyPrice: mediaAmount(listing.monthlyPrice),
    mealPrice: mediaAmount(listing.mealPrice),
    priceBasis: isPriceBasis(listing.priceBasis) ? listing.priceBasis : null,
    amenityCodes: (listing.amenities ?? []).map((item) => item.code),
    foodIncludedInRent: listing.foodIncluded === true,
    foodAvailability: listing.foodIncluded ? 'INCLUDED' : null,
    hasContact: Boolean(listing.contactNumber?.trim()),
    hasMobileContact: Boolean(listing.contactNumber?.trim()),
    capacityEstimate: listing.capacityEstimate ?? null,
    listingMetadata: { images: listingImages(listing), mealsServed: [] },
  };
}

function ListingCard({ listing, onEdit }: { listing: MeListing; onEdit: () => void }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isSaved, toggleFavorite } = useFavorites();
  const manage = showsManage(listing) ? appHref(APP.web, listing.managePath) : null;
  const accommodation = showsAccommodation(listing) ? appHref(APP.web, listing.accommodationPath) : null;
  const meals = showsMeals(listing) ? appHref(APP.web, listing.mealsPath) : null;
  const publicHref = showsPublicListing(listing) ? listing.publicPath ?? null : null;
  const primary = accommodation
    ? { href: accommodation, label: t('mySpaces.accommodation'), Icon: Building2 }
    : meals
      ? { href: meals, label: t('mySpaces.mealManagement'), Icon: UtensilsCrossed }
      : null;
  const openPublic = () => {
    if (publicHref) navigate(publicHref);
  };
  const cardId = listing.spaceId ?? listing.registrationId ?? listing.name;
  const actions = (
    <>
      <ActionButton
        variant="outline"
        onClick={onEdit}
        className="!h-11 min-w-0 flex-[0.82] !rounded-xl bg-white !px-2 !text-[13px] whitespace-nowrap"
      >
        <Pencil aria-hidden className="h-4 w-4" />
        {t('mySpaces.edit')}
      </ActionButton>
      {primary ? (
        <a
          href={primary.href}
          className="inline-flex h-11 min-w-0 flex-[1.18] items-center justify-center gap-1.5 rounded-xl bg-register px-2 text-[13px] font-semibold whitespace-nowrap text-white hover:bg-register-hover"
        >
          <primary.Icon aria-hidden className="h-4 w-4" />
          {primary.label}
        </a>
      ) : null}
      <ListingMenu publicHref={publicHref} manage={manage} />
    </>
  );
  if (listing.kind === 'MESS') {
    const card = toMessCardListing(listing);
    return (
      <MessCard
        listing={card}
        saved={isSaved(card.id)}
        onSelect={openPublic}
        onOpenSection={openPublic}
        onToggleSave={() => {
          if (!listing.spaceId) return;
          toggleFavorite({
            id: cardId,
            kind: 'meals',
            name: listing.name,
            detail: [listing.city, listing.state].filter(Boolean).join(', '),
          });
        }}
        onEnquire={openPublic}
        actions={actions}
      />
    );
  }
  const card = toPropertyCardListing(listing);
  return (
    <PropertyCard
      listing={card}
      saved={isSaved(card.id)}
      onSelect={openPublic}
      onOpenSection={openPublic}
      onToggleSave={() => {
        if (!listing.spaceId) return;
        toggleFavorite({
          id: cardId,
          kind: 'places',
          name: listing.name,
          detail: [listing.city, listing.state].filter(Boolean).join(', '),
        });
      }}
      onEnquire={openPublic}
      actions={actions}
    />
  );
}

function ListingMenu({ publicHref, manage }: { publicHref: string | null; manage: string | null }) {
  const { t } = useTranslation();
  if (!publicHref && !manage) return null;
  return (
    <details className="relative shrink-0">
      <summary
        aria-label={t('mySpaces.moreActions')}
        className="inline-flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-xl border border-black/10 text-navy [&::-webkit-details-marker]:hidden"
      >
        <MoreHorizontal aria-hidden className="h-4 w-4" />
      </summary>
      <div className="absolute right-0 bottom-12 z-10 min-w-44 rounded-xl border border-black/10 bg-white p-1 shadow-[var(--shadow-sm)]">
        {publicHref ? (
          <Link to={publicHref} className="block rounded-lg px-3 py-2 text-sm font-semibold text-navy hover:bg-soft">
            {t('mySpaces.viewPublic')}
          </Link>
        ) : null}
        {manage ? (
          <a href={manage} className="block rounded-lg px-3 py-2 text-sm font-semibold text-navy hover:bg-soft">
            {t('mySpaces.manage')}
          </a>
        ) : null}
      </div>
    </details>
  );
}

function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={`min-h-11 rounded-full border px-3.5 text-sm font-semibold ${
        selected ? 'border-register bg-register text-white hover:bg-register-hover' : 'border-black/10 bg-white text-navy'
      }`}
    >
      {label}
    </button>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="block min-w-0 lg:min-w-36">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-xl border border-black/10 bg-white px-3 text-sm font-medium text-navy outline-none focus-visible:ring-2 focus-visible:ring-register"
      >
        {children}
      </select>
    </label>
  );
}
