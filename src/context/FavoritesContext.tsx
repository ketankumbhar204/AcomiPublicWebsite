import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { favoritesApi } from '../auth/favoritesApi';
import {
  favoriteIdsAfterRollback,
  favoriteIdsAfterToggle,
  shouldHydrateFavorites,
} from '../auth/favoriteToggle';
import { PublicApiError } from '../lib/apiClient';
import { useAuth } from '../auth/AuthProvider';

export type FavoriteKind = 'places' | 'meals';

export type FavoriteListing = {
  id: string;
  kind: FavoriteKind;
  name: string;
  detail: string;
};

type FavoritesValue = {
  count: number;
  savedIds: ReadonlySet<string>;
  isSaved: (id: string) => boolean;
  toggleFavorite: (item: FavoriteListing) => void;
  refreshFavorites: () => Promise<void>;
};

const FavoritesContext = createContext<FavoritesValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { user, isBootstrapping, openAuth } = useAuth();
  const userId = user?.id ?? null;
  const [ids, setIds] = useState<ReadonlySet<string>>(() => new Set());
  const [notice, setNotice] = useState<string | null>(null);
  const idsRef = useRef<string[]>([]);
  const userIdRef = useRef<string | null>(null);
  const stampRef = useRef(0);
  const pendingRef = useRef(0);
  const noticeTimer = useRef<number | null>(null);

  const replaceIds = useCallback((next: readonly string[]) => {
    idsRef.current = [...next];
    setIds(new Set(next));
  }, []);

  const showNotice = useCallback((message: string) => {
    setNotice(message);
    if (noticeTimer.current != null) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 4000);
  }, []);

  const refreshFavorites = useCallback(async () => {
    const requestUserId = userIdRef.current;
    if (!requestUserId) {
      replaceIds([]);
      return;
    }
    const requestStamp = stampRef.current;
    const loaded = await favoritesApi.ids();
    if (pendingRef.current > 0) return;
    if (!shouldHydrateFavorites(requestStamp, stampRef.current, requestUserId, userIdRef.current)) {
      return;
    }
    replaceIds(loaded);
  }, [replaceIds]);

  useEffect(() => {
    userIdRef.current = userId;
    if (isBootstrapping) return undefined;
    stampRef.current += 1;
    if (!userId) {
      replaceIds([]);
      return undefined;
    }
    const requestUserId = userId;
    const requestStamp = stampRef.current;
    void favoritesApi
      .ids()
      .then((loaded) => {
        if (pendingRef.current > 0) return;
        if (!shouldHydrateFavorites(requestStamp, stampRef.current, requestUserId, userIdRef.current)) {
          return;
        }
        replaceIds(loaded);
      })
      .catch(() => undefined);
    return undefined;
  }, [isBootstrapping, replaceIds, userId]);

  useEffect(() => {
    function onFocus() {
      if (userIdRef.current) {
        void refreshFavorites().catch(() => undefined);
      }
    }
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [refreshFavorites]);

  const isSaved = useCallback((id: string) => ids.has(id), [ids]);

  const toggleFavorite = useCallback(
    (item: FavoriteListing) => {
      if (!userIdRef.current) {
        openAuth('login');
        return;
      }
      const requestUserId = userIdRef.current;
      const planned = favoriteIdsAfterToggle(idsRef.current, item.id);
      const requestStamp = ++stampRef.current;
      pendingRef.current += 1;
      replaceIds(planned.ids);
      const request = planned.wantSaved ? favoritesApi.add(item.id) : favoritesApi.remove(item.id);
      void request
        .catch((error: unknown) => {
          if (!shouldHydrateFavorites(requestStamp, stampRef.current, requestUserId, userIdRef.current)) {
            return;
          }
          replaceIds(favoriteIdsAfterRollback(idsRef.current, item.id, planned.wantSaved));
          if (error instanceof PublicApiError && error.status === 401) {
            openAuth('login');
            return;
          }
          showNotice(
            t('favorites.updateFailed', { defaultValue: 'Could not update favorites. Please try again.' }),
          );
        })
        .finally(() => {
          pendingRef.current = Math.max(0, pendingRef.current - 1);
        });
    },
    [openAuth, replaceIds, showNotice, t],
  );

  const value = useMemo(
    () => ({ count: ids.size, savedIds: ids, isSaved, toggleFavorite, refreshFavorites }),
    [ids, isSaved, refreshFavorites, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
      {notice ? (
        <div
          role="status"
          className="fixed bottom-4 left-1/2 z-[80] max-w-sm -translate-x-1/2 rounded-lg bg-navy px-4 py-3 text-sm text-white shadow-lg"
        >
          {notice}
        </div>
      ) : null}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesValue {
  const value = useContext(FavoritesContext);
  if (!value) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return value;
}
