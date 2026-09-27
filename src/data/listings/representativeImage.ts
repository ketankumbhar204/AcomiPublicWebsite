/**
 * ACOMI representative-image assignment
 *
 * Shared algorithm with AcomiMobile `src/utils/representativeImage.ts`.
 * Keep the hash, category map, variant count, and real-photo rules identical.
 *
 * 1. Verified listing photo (http(s) or site-relative, not Unsplash / pack) wins.
 * 2. Else normalize spaceType → PG | HOSTEL | CO_LIVING | RENTAL | SERVICED | MESS | GENERIC.
 * 3. variantIndex = FNV-1a32(stableListingId) % 3
 *    If listing id is missing, hash the category (deterministic, never a random function).
 * 4. Pick `{slug}-{variantIndex+1}.png` from /images/representative/
 *
 * These images are category-level visuals, never treated as property photos.
 */

export const REPRESENTATIVE_VARIANT_COUNT = 3;

export type RepresentativeCategory =
  | 'PG'
  | 'HOSTEL'
  | 'CO_LIVING'
  | 'RENTAL'
  | 'SERVICED'
  | 'MESS'
  | 'GENERIC';

export type ListingCoverKind = 'listing' | 'representative';

export type ListingCoverInput = {
  listingId?: string | null;
  spaceType?: string | null;
  listingImageUrl?: string | null;
};

export type ListingCover = {
  kind: ListingCoverKind;
  category: RepresentativeCategory;
  variantIndex: number;
  imageKey: string;
  url: string;
};

const CATEGORY_SLUG: Record<RepresentativeCategory, string> = {
  PG: 'pg',
  HOSTEL: 'hostel',
  CO_LIVING: 'coliving',
  RENTAL: 'rental',
  SERVICED: 'serviced',
  MESS: 'mess',
  GENERIC: 'generic',
};

/** FNV-1a 32-bit. Do not replace with a random function. */
export function stableHash(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function normalizeRepresentativeCategory(
  spaceType?: string | null,
): RepresentativeCategory {
  const key = (spaceType ?? '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_');

  if (key === 'PG') return 'PG';
  if (key === 'HOSTEL') return 'HOSTEL';
  if (key === 'CO_LIVING' || key === 'COLIVING') return 'CO_LIVING';
  if (key === 'RENTAL') return 'RENTAL';
  if (
    key === 'SERVICED' ||
    key === 'CORPORATE' ||
    key === 'SERVICED_APARTMENT' ||
    key === 'SERVICED_APARTMENTS' ||
    key === 'CORPORATE_APARTMENT' ||
    key === 'CORPORATE_APARTMENTS'
  ) {
    return 'SERVICED';
  }
  if (key === 'MESS' || key === 'TIFFIN') return 'MESS';
  return 'GENERIC';
}

export function representativeVariantIndex(
  listingId: string | null | undefined,
  category: RepresentativeCategory,
): number {
  const seed = listingId?.trim() || category;
  return stableHash(seed) % REPRESENTATIVE_VARIANT_COUNT;
}

export function representativeImageKey(
  category: RepresentativeCategory,
  variantIndex: number,
): string {
  return `${CATEGORY_SLUG[category]}-${variantIndex + 1}`;
}

export function representativeImageUrl(imageKey: string): string {
  return `/images/representative/${imageKey}.png`;
}

export function isVerifiedListingImageUrl(url?: string | null): boolean {
  const value = url?.trim() ?? '';
  if (!value) return false;
  const lower = value.toLowerCase();
  if (lower.includes('/images/representative/')) return false;
  if (lower.includes('images.unsplash.com')) return false;
  if (lower.startsWith('representative:')) return false;
  return lower.startsWith('https://') || lower.startsWith('http://') || lower.startsWith('/');
}

export function firstVerifiedListingImageUrl(
  ...candidates: Array<string | null | undefined>
): string | undefined {
  for (const candidate of candidates) {
    if (isVerifiedListingImageUrl(candidate)) {
      return candidate!.trim();
    }
  }
  return undefined;
}

export function resolveListingCover(input: ListingCoverInput): ListingCover {
  const category = normalizeRepresentativeCategory(input.spaceType);
  const variantIndex = representativeVariantIndex(input.listingId, category);
  const imageKey = representativeImageKey(category, variantIndex);
  const listingImageUrl = input.listingImageUrl?.trim();

  if (isVerifiedListingImageUrl(listingImageUrl)) {
    return {
      kind: 'listing',
      category,
      variantIndex,
      imageKey,
      url: listingImageUrl!,
    };
  }

  return {
    kind: 'representative',
    category,
    variantIndex,
    imageKey,
    url: representativeImageUrl(imageKey),
  };
}

/** Spec name — same as resolveListingCover without a real photo. */
export function getRepresentativeImage(
  spaceType: string | null | undefined,
  stableListingId: string | null | undefined,
): ListingCover {
  return resolveListingCover({ listingId: stableListingId, spaceType });
}
