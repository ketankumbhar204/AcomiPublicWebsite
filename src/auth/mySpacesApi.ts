import { PublicApiError, publicApi } from '../lib/apiClient';
import type { MembershipRole, MySpaceMembership } from './types';

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
