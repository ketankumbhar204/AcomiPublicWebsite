import { publicApi } from '../lib/apiClient';
import type { DiscoverSpaceCard } from './types';

export type FavoriteState = {
  spaceId: string;
  favorited: boolean;
};

export const favoritesApi = {
  list: () => publicApi<DiscoverSpaceCard[]>('/me/favorites'),
  ids: () => publicApi<string[]>('/me/favorites/ids'),
  add: (spaceId: string) => publicApi<FavoriteState>(`/me/favorites/${spaceId}`, { method: 'PUT' }),
  remove: (spaceId: string) => publicApi<FavoriteState>(`/me/favorites/${spaceId}`, { method: 'DELETE' }),
};
