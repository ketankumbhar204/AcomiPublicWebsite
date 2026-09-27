import { resolveListingCover } from './representativeImage';

/** Category representative URL. Prefer resolveListingCover at the call site. */
export function discoverDefaultImageUrl(
  type: string | undefined,
  listingId?: string | null,
): string {
  return resolveListingCover({ listingId, spaceType: type }).url;
}
