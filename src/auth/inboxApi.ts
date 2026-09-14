import { publicApi } from '../lib/apiClient';
import type { SpaceEnquiryResponse, UserNotification, UserNotificationList } from './types';

type Paged<T> = {
  content: T[];
};

export function listMyNotifications(page = 0, size = 20): Promise<UserNotificationList> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  return publicApi<UserNotificationList>(`/notifications/me?${params.toString()}`);
}

export function markMyNotificationRead(notificationId: string): Promise<UserNotification> {
  return publicApi<UserNotification>(`/notifications/${notificationId}/read`, { method: 'POST' });
}

export function listMyEnquiries(page = 0, size = 20): Promise<Paged<SpaceEnquiryResponse>> {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  return publicApi<Paged<SpaceEnquiryResponse>>(`/enquiries/me?${params.toString()}`);
}

export function isSafeEnquiryId(value: string | null | undefined): value is string {
  if (!value) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
