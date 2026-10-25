import { useCallback, useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { favoritesApi } from '../auth/favoritesApi';
import type { DiscoverSpaceCard } from '../auth/types';
import { RequireAuth } from '../components/auth/RequireAuth';
import { ActionButton } from '../components/common/ActionButton';
import { EnquireDialog } from '../components/discovery/EnquireDialog';
import { MessCard } from '../components/discovery/MessCard';
import { PropertyCard } from '../components/discovery/PropertyCard';
import { Container } from '../components/layout/Container';
import { useFavorites, type FavoriteKind } from '../context/FavoritesContext';
import { toMessListing, toPropertyListing } from '../data/listings/mapDiscoverListing';
import type { ListingSection } from '../data/listings/listingInfo';
import { applySeo } from '../lib/seo';

type FavoriteFilter = 'all' | 'places' | 'meals';

const RESULTS_GRID =
  'mt-4 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(min(100%,19.25rem),1fr))]';

function dedupe(rows: DiscoverSpaceCard[]): DiscoverSpaceCard[] {
  const seen = new Set<string>();
  return rows.filter((row) => {
    if (!row.spaceId || seen.has(row.spaceId)) return false;
    seen.add(row.spaceId);
    return true;
  });
}

export function FavoritesPage() {
  return (
    <RequireAuth>
      <FavoritesView />
    </RequireAuth>
  );
}

function FavoritesView() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { savedIds, isSaved, toggleFavorite, refreshFavorites } = useFavorites();
  const [items, setItems] = useState<DiscoverSpaceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FavoriteFilter>('all');
  const [enquire, setEnquire] = useState<{ id: string; name: string; kind: FavoriteKind } | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      await refreshFavorites();
      setItems(dedupe(await favoritesApi.list()));
    } catch {
      setError(t('favorites.loadFailed', { defaultValue: 'Could not load favorites.' }));
    } finally {
      setLoading(false);
    }
  }, [refreshFavorites, t]);

  useEffect(() => {
    applySeo({
      title: t('favorites.title', { defaultValue: 'Favorites' }),
      description: t('favorites.subtitle', {
        defaultValue: 'Places and mess listings saved to your ACOMI account.',
      }),
      path: '/favorites',
    });
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState === 'visible') void load();
    }
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [load]);

  const savedCards = items.filter((item) => savedIds.has(item.spaceId));
  const visible = savedCards.filter((item) => {
    if (filter === 'meals') return item.type === 'MESS';
    if (filter === 'places') return item.type !== 'MESS';
    return true;
  });
  const present = new Set(items.map((item) => item.spaceId));
  const missingIds = !loading && !error && filter === 'all'
    ? [...savedIds].filter((id) => !present.has(id))
    : [];

  return (
    <section className="bg-background py-8 sm:py-10">
      <Container>
        <h1 className="text-2xl font-semibold tracking-tight text-navy">
          {t('favorites.title', { defaultValue: 'Favorites' })}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {t('favorites.subtitle', {
            defaultValue: 'Places and mess listings saved to your ACOMI account.',
          })}
        </p>
        <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label={t('favorites.title', { defaultValue: 'Favorites' })}>
          <FilterChip label={t('favorites.all', { defaultValue: 'All' })} selected={filter === 'all'} onClick={() => setFilter('all')} />
          <FilterChip label={t('nav.places', { defaultValue: 'Places' })} selected={filter === 'places'} onClick={() => setFilter('places')} />
          <FilterChip label={t('nav.meals', { defaultValue: 'Meals' })} selected={filter === 'meals'} onClick={() => setFilter('meals')} />
        </div>

        {loading && items.length === 0 ? (
          <p className="mt-8 text-sm text-text-secondary">{t('auth.pleaseWait')}</p>
        ) : null}

        {error && items.length === 0 ? (
          <div className="mt-8 rounded-[24px] border border-black/5 bg-white px-6 py-10 text-center">
            <p className="text-sm text-text-secondary">{error}</p>
            <div className="mt-4 flex justify-center">
              <ActionButton
                variant="ghost"
                onClick={() => {
                  setLoading(true);
                  void load();
                }}
              >
                {t('discovery.retry', { defaultValue: 'Retry' })}
              </ActionButton>
            </div>
          </div>
        ) : null}

        {!loading && !error && visible.length === 0 && missingIds.length === 0 ? (
          <div className="mt-8 rounded-[24px] border border-black/5 bg-white px-6 py-14 text-center">
            <Heart aria-hidden className="mx-auto h-7 w-7 text-coral" />
            <h2 className="mt-3 text-xl font-semibold text-navy">
              {t('favorites.empty', { defaultValue: 'No favorites yet' })}
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              {t('favorites.emptyHint', {
                defaultValue: 'Tap the heart on a PG, hostel, co-living, rental, or mess listing to save it here.',
              })}
            </p>
          </div>
        ) : null}

        {visible.length > 0 || missingIds.length > 0 ? (
          <div className={RESULTS_GRID}>
            {visible.map((card) => {
              if (card.type === 'MESS') {
                const listing = toMessListing(card);
                if (!listing) return null;
                return (
                  <MessCard
                    key={card.spaceId}
                    listing={listing}
                    saved={isSaved(card.spaceId)}
                    onSelect={() => navigate(`/meals/${card.spaceId}`)}
                    onOpenSection={(section) => navigate(listingSectionPath('meals', card.spaceId, section))}
                    onToggleSave={() => saveToggle(toggleFavorite, card.spaceId, listing.name, 'meals')}
                    onEnquire={() => setEnquire({ id: card.spaceId, name: listing.name, kind: 'meals' })}
                  />
                );
              }
              const listing = toPropertyListing(card);
              if (!listing) return null;
              return (
                <PropertyCard
                  key={card.spaceId}
                  listing={listing}
                  saved={isSaved(card.spaceId)}
                  onSelect={() => navigate(`/places/${card.spaceId}`)}
                  onOpenSection={(section) => navigate(listingSectionPath('places', card.spaceId, section))}
                  onToggleSave={() => saveToggle(toggleFavorite, card.spaceId, listing.name, 'places')}
                  onEnquire={() => setEnquire({ id: card.spaceId, name: listing.name, kind: 'places' })}
                />
              );
            })}
            {missingIds.map((id) => (
              <article key={id} className="rounded-2xl border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
                <p className="text-sm font-semibold text-navy">
                  {t('favorites.unavailable', { defaultValue: 'This listing is no longer available.' })}
                </p>
                <button
                  type="button"
                  className="mt-3 text-sm font-semibold text-coral"
                  onClick={() => saveToggle(toggleFavorite, id, '', 'places')}
                >
                  {t('favorites.removeSaved', { defaultValue: 'Remove from favorites' })}
                </button>
              </article>
            ))}
          </div>
        ) : null}
      </Container>
      <EnquireDialog
        open={enquire != null}
        listingId={enquire?.id ?? ''}
        listingName={enquire?.name ?? ''}
        listingKind={enquire?.kind === 'meals' ? 'mess' : 'places'}
        onClose={() => setEnquire(null)}
      />
    </section>
  );
}

function listingSectionPath(kind: 'places' | 'meals', id: string, section: ListingSection) {
  const base = kind === 'meals' ? `/meals/${id}` : `/places/${id}`;
  return `${base}?section=${section}`;
}

function saveToggle(
  toggleFavorite: (item: { id: string; kind: FavoriteKind; name: string; detail: string }) => void,
  id: string,
  name: string,
  kind: FavoriteKind,
) {
  toggleFavorite({ id, kind, name, detail: '' });
}

function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
        selected ? 'border-primary bg-primary text-white' : 'border-black/10 bg-white text-navy'
      }`}
    >
      {label}
    </button>
  );
}
