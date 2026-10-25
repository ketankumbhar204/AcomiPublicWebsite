import { PublicApiError, publicApi } from '../lib/apiClient';
import type { MembershipRole, MySpaceMembership } from './types';

export type MeListingKind = 'PROPERTY' | 'MESS';
export type MeListingPublication = 'LIVE' | 'PENDING';

export type MeListingPhoto = {
  id: string;
  contentUrl: string;
  contentType?: string | null;
};

export type MeListing = {
  spaceId?: string | null;
  registrationId?: string | null;
  kind: MeListingKind;
  spaceType?: string | null;
  name: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  mapUrl?: string | null;
  description?: string | null;
  contactNumber?: string | null;
  genderPolicy?: string | null;
  foodIncluded?: boolean | null;
  photoFileId?: string | null;
  coverImageUrl?: string | null;
  gallery?: MeListingPhoto[] | null;
  startingPrice?: number | string | null;
  monthlyPrice?: number | string | null;
  mealPrice?: number | string | null;
  priceBasis?: string | null;
  ownerName?: string | null;
  buildingName?: string | null;
  sharingNotes?: string | null;
  capacityEstimate?: number | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  amenities?: MeListingAmenity[] | null;
  publication: MeListingPublication;
  registrationReference?: string | null;
  registrationStatus?: string | null;
  membershipRole?: string | null;
  updatedAt?: string | null;
  operationalManagementAvailable?: boolean;
  publicPath?: string | null;
  managePath?: string | null;
  accommodationPath?: string | null;
  mealsPath?: string | null;
};

export type ListingCatalogUpdate = {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  description?: string;
  contactNumber?: string;
  genderPolicy?: string;
  foodIncludedInRent?: boolean;
  foodIncludedListing?: boolean;
  startingPrice?: number;
  monthlyPrice?: number;
  mealPrice?: number;
  priceBasis?: string;
  monthlyPriceBasis?: string;
  mapUrl?: string;
  latitude?: number;
  longitude?: number;
  ownerName?: string;
  buildingName?: string;
  capacityEstimate?: number;
  amenities?: Array<{ code: string; label: string }>;
  /** Omitted leaves the current gallery. A list replaces it. */
  photos?: string[];
};

export type MeListingAmenity = {
  code: string;
  label?: string | null;
};

export async function listMyListings(params?: {
  kind?: MeListingKind;
  status?: MeListingPublication;
  search?: string;
}): Promise<MeListing[]> {
  const query = new URLSearchParams();
  if (params?.kind) query.set('kind', params.kind);
  if (params?.status) query.set('status', params.status);
  if (params?.search?.trim()) query.set('search', params.search.trim());
  const suffix = query.toString();
  const data = await publicApi<MeListing[]>(`/me/listings${suffix ? `?${suffix}` : ''}`);
  return Array.isArray(data) ? data : [];
}

export function updateLiveListing(spaceId: string, body: ListingCatalogUpdate): Promise<MeListing> {
  return publicApi<MeListing>(`/me/listings/spaces/${spaceId}`, { method: 'PUT', body });
}

export function updatePropertyLead(registrationId: string, body: ListingCatalogUpdate & { propertyName?: string; addressLine?: string }): Promise<MeListing> {
  return publicApi<MeListing>(`/me/listings/property-registrations/${registrationId}`, { method: 'PUT', body });
}

export function updateMessLead(registrationId: string, body: ListingCatalogUpdate & { messName?: string; addressLine?: string }): Promise<MeListing> {
  return publicApi<MeListing>(`/me/listings/mess-registrations/${registrationId}`, { method: 'PUT', body });
}

export async function listMySpaceMemberships(): Promise<MySpaceMembership[]> {
  const data = await publicApi<Array<{ spaceId?: string; membershipRole?: MembershipRole }>>('/spaces/my');
  if (!Array.isArray(data)) {
    throw new PublicApiError('Unexpected spaces response', 500);
  }
  return data.map((space) => ({
    spaceId: space.spaceId ?? '',
    membershipRole: space.membershipRole as MembershipRole,
  }));
}
