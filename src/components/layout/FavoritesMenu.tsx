import { useEffect, useRef, useState } from 'react';
import { Heart, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';

export function FavoritesMenu() {
  const { t } = useTranslation();
  const { favorites, toggleFavorite } = useFavorites();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const count = favorites.length;
  const badge = count > 9 ? '9+' : String(count);

  useEffect(() => {
    if (!open) return undefined;
    function onDocClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition hover:bg-soft hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        aria-label={
          count > 0
            ? t('favorites.openCount', { count, defaultValue: 'Favorites, {{count}} saved' })
            : t('favorites.open', { defaultValue: 'Favorites' })
        }
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
      >
        <Heart className={`h-5 w-5 ${count > 0 ? 'fill-coral text-coral' : ''}`} />
        {count > 0 ? (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 rounded-full bg-coral px-1 text-[10px] leading-4 font-bold text-white">
            {badge}
          </span>
        ) : null}
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label={t('favorites.title', { defaultValue: 'Favorites' })}
          className="absolute right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-white shadow-lg"
        >
          <div className="border-b border-border px-4 py-3 text-sm font-semibold text-navy">
            {t('favorites.title', { defaultValue: 'Favorites' })}
          </div>
          {favorites.length === 0 ? (
            <p className="px-4 py-6 text-sm text-text-secondary">
              {t('favorites.empty', {
                defaultValue: 'No favorites yet. Tap the heart on a place or mess.',
              })}
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto">
              {favorites.map((item) => (
                <li key={item.id} className="flex items-stretch border-b border-border last:border-b-0">
                  <Link
                    to={`/${item.kind}/${item.id}`}
                    className="min-w-0 flex-1 px-4 py-3 hover:bg-soft"
                    onClick={() => setOpen(false)}
                  >
                    <p className="truncate text-sm font-semibold text-navy">{item.name}</p>
                    <p className="mt-0.5 truncate text-xs text-text-secondary">
                      {t(item.kind === 'places' ? 'nav.places' : 'nav.meals', {
                        defaultValue: item.kind === 'places' ? 'Places' : 'Meals',
                      })}
                      {item.detail ? ` · ${item.detail}` : ''}
                    </p>
                  </Link>
                  <button
                    type="button"
                    className="inline-flex w-11 shrink-0 items-center justify-center text-coral hover:bg-soft"
                    aria-label={t('favorites.remove', {
                      name: item.name,
                      defaultValue: 'Remove {{name}} from favorites',
                    })}
                    onClick={() => toggleFavorite(item)}
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
