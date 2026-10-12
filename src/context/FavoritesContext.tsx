import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { readStored, writeStored } from '../lib/storage';

const STORAGE_KEY = 'acomi.favorites';

export type FavoriteKind = 'places' | 'meals';

export type FavoriteListing = {
  id: string;
  kind: FavoriteKind;
  name: string;
  detail: string;
};

type FavoritesValue = {
  favorites: FavoriteListing[];
  isSaved: (id: string) => boolean;
  toggleFavorite: (item: FavoriteListing) => void;
};

const FavoritesContext = createContext<FavoritesValue | null>(null);

function isFavorite(value: unknown): value is FavoriteListing {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<FavoriteListing>;
  return (
    typeof item.id === 'string' &&
    item.id.length > 0 &&
    (item.kind === 'places' || item.kind === 'meals') &&
    typeof item.name === 'string' &&
    typeof item.detail === 'string'
  );
}

function readFavorites(): FavoriteListing[] {
  const raw = readStored(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isFavorite) : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteListing[]>(readFavorites);

  const isSaved = useCallback((id: string) => favorites.some((item) => item.id === id), [favorites]);

  const toggleFavorite = useCallback((item: FavoriteListing) => {
    setFavorites((current) => {
      const next = current.some((row) => row.id === item.id)
        ? current.filter((row) => row.id !== item.id)
        : [item, ...current];
      writeStored(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ favorites, isSaved, toggleFavorite }),
    [favorites, isSaved, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesValue {
  const value = useContext(FavoritesContext);
  if (!value) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return value;
}
