import type { MeListing, MeListingKind, MeListingPublication } from './mySpacesApi';

function shownAddress(listing: Pick<MeListing, 'address' | 'city' | 'state' | 'pincode'>): string {
  return [listing.address, listing.city, listing.state, listing.pincode]
    .filter((part) => part && part.trim())
    .join(', ');
}

export type KindFilter = 'ALL' | MeListingKind;
export type StatusFilter = 'ALL' | MeListingPublication;
export type ListingSort = 'updated' | 'name' | 'priceAsc' | 'priceDesc';

export type ListingViewFilters = {
  kind: KindFilter;
  status: StatusFilter;
  search: string;
  city: string;
  spaceType: string;
  sort: ListingSort;
};

export const LISTING_PAGE_SIZE = 9;

export function listingPriceAmount(listing: MeListing): number | null {
  const raw =
    listing.kind === 'MESS'
      ? (listing.monthlyPrice ?? listing.mealPrice)
      : listing.startingPrice;
  if (raw == null || raw === '') return null;
  const amount = typeof raw === 'number' ? raw : Number(raw);
  return Number.isFinite(amount) ? amount : null;
}

/** Same fields the listings API searches, plus the address shown on the card. */
export function matchesListingSearch(listing: MeListing, search: string): boolean {
  const needle = search.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    listing.name,
    listing.address,
    listing.city,
    listing.registrationReference,
    shownAddress(listing),
  ]
    .filter((part) => part && part.trim())
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
}

function matchesNarrowing(
  listing: MeListing,
  filters: Pick<ListingViewFilters, 'search' | 'city' | 'spaceType'>,
): boolean {
  if (!matchesListingSearch(listing, filters.search)) return false;
  if (filters.city && (listing.city ?? '') !== filters.city) return false;
  if (filters.spaceType && (listing.spaceType ?? '') !== filters.spaceType) return false;
  return true;
}

export function listingFacetCounts(
  items: readonly MeListing[],
  filters: Pick<ListingViewFilters, 'search' | 'city' | 'spaceType'>,
): { all: number; properties: number; messes: number; live: number; pending: number } {
  const base = items.filter((item) => matchesNarrowing(item, filters));
  return {
    all: base.length,
    properties: base.filter((item) => item.kind === 'PROPERTY').length,
    messes: base.filter((item) => item.kind === 'MESS').length,
    live: base.filter((item) => item.publication === 'LIVE').length,
    pending: base.filter((item) => item.publication === 'PENDING').length,
  };
}

function compareListings(sort: ListingSort, left: MeListing, right: MeListing): number {
  if (sort === 'name') return left.name.localeCompare(right.name);
  if (sort === 'priceAsc' || sort === 'priceDesc') {
    const a = listingPriceAmount(left);
    const b = listingPriceAmount(right);
    if (a == null && b == null) return left.name.localeCompare(right.name);
    if (a == null) return 1;
    if (b == null) return -1;
    const diff = sort === 'priceAsc' ? a - b : b - a;
    return diff === 0 ? left.name.localeCompare(right.name) : diff;
  }
  const a = left.updatedAt ?? '';
  const b = right.updatedAt ?? '';
  if (a === b) return left.name.localeCompare(right.name);
  return a < b ? 1 : -1;
}

export function applyListingFilters(items: readonly MeListing[], filters: ListingViewFilters): MeListing[] {
  return items
    .filter((item) => matchesNarrowing(item, filters))
    .filter((item) => filters.kind === 'ALL' || item.kind === filters.kind)
    .filter((item) => filters.status === 'ALL' || item.publication === filters.status)
    .slice()
    .sort((left, right) => compareListings(filters.sort, left, right));
}

export function paginateListings<T>(items: readonly T[], page: number, pageSize = LISTING_PAGE_SIZE): {
  page: number;
  pages: number;
  from: number;
  to: number;
  slice: T[];
} {
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), pages);
  const start = (current - 1) * pageSize;
  const slice = items.slice(start, start + pageSize);
  return {
    page: current,
    pages,
    from: slice.length === 0 ? 0 : start + 1,
    to: start + slice.length,
    slice,
  };
}

export function photoCount(listing: MeListing): number {
  const gallery = listing.gallery?.length ?? 0;
  if (gallery > 0) return gallery;
  return listing.photoFileId || listing.coverImageUrl ? 1 : 0;
}
