import { publicApi } from '../lib/apiClient';
import { getDiscoverSpaceDetail } from '../data/listings/discoverApi';
import type { DiscoverSpaceCard, DiscoverSpaceDetail, SpaceEnquiryResponse } from './types';

type Paged<T> = {
  content: T[];
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function namesMatch(left: string, right: string): boolean {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

export async function resolveDiscoverSpace(
  listingId: string,
  listingName: string,
  kind: 'places' | 'mess',
): Promise<DiscoverSpaceDetail | null> {
  if (UUID_RE.test(listingId.trim())) {
    try {
      return await getDiscoverSpaceDetail(listingId.trim());
    } catch {
      // Fall through to name search for stale enquire intents.
    }
  }
  const type = kind === 'mess' ? 'MESS' : undefined;
  const page = await publicApi<Paged<DiscoverSpaceCard>>(
    `/spaces/discover?${new URLSearchParams({
      search: listingName.trim(),
      ...(type ? { type } : {}),
      size: '20',
    }).toString()}`,
  );
  const exact =
    page.content.find((item) => namesMatch(item.name, listingName)) ?? page.content[0] ?? null;
  if (!exact) return null;
  return getDiscoverSpaceDetail(exact.spaceId);
}

export async function createSpaceEnquiry(
  spaceId: string,
  email?: string,
): Promise<SpaceEnquiryResponse> {
  return publicApi<SpaceEnquiryResponse>(`/spaces/${spaceId}/enquiries`, {
    method: 'POST',
    body: email ? { email } : {},
  });
}
