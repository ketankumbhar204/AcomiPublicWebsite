import type { MeListing } from './mySpacesApi';

export function showsPublicListing(listing: Pick<MeListing, 'publication' | 'publicPath' | 'spaceId'>): boolean {
  return listing.publication === 'LIVE' && Boolean(listing.spaceId) && Boolean(listing.publicPath);
}

export function showsAccommodation(
  listing: Pick<MeListing, 'publication' | 'spaceType' | 'kind' | 'accommodationPath' | 'operationalManagementAvailable'>,
): boolean {
  return (
    listing.publication === 'LIVE' &&
    listing.operationalManagementAvailable === true &&
    listing.kind !== 'MESS' &&
    listing.spaceType !== 'MESS' &&
    Boolean(listing.accommodationPath)
  );
}

export function showsMeals(
  listing: Pick<MeListing, 'publication' | 'spaceType' | 'kind' | 'mealsPath' | 'operationalManagementAvailable'>,
): boolean {
  return (
    listing.publication === 'LIVE' &&
    listing.operationalManagementAvailable === true &&
    (listing.kind === 'MESS' || listing.spaceType === 'MESS') &&
    Boolean(listing.mealsPath)
  );
}

export function showsManage(
  listing: Pick<MeListing, 'publication' | 'managePath' | 'operationalManagementAvailable'>,
): boolean {
  return listing.publication === 'LIVE' && listing.operationalManagementAvailable === true && Boolean(listing.managePath);
}

/** Join the operations app origin with a backend-provided path. Rejects off-site paths. */
export function appHref(appOrigin: string, path: string | null | undefined): string | null {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return null;
  const origin = appOrigin.replace(/\/+$/, '');
  return `${origin}${path}`;
}

export function listingAddress(listing: Pick<MeListing, 'address' | 'city' | 'state' | 'pincode'>): string {
  return [listing.address, listing.city, listing.state, listing.pincode].filter((part) => part && part.trim()).join(', ');
}
