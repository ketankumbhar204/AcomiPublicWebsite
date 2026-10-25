import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';

export function FavoritesMenu() {
  const { t } = useTranslation();
  const { count } = useFavorites();
  const { pathname } = useLocation();
  const badge = count > 9 ? '9+' : String(count);
  const active = pathname === '/favorites';

  return (
    <Link
      to="/favorites"
      aria-current={active ? 'page' : undefined}
      aria-label={
        count > 0
          ? t('favorites.openCount', { count, defaultValue: 'Favorites, {{count}} saved' })
          : t('favorites.open', { defaultValue: 'Favorites' })
      }
      className={`relative inline-flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-soft hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
        active ? 'bg-soft text-text' : 'text-text-secondary'
      }`}
    >
      <Heart className={`h-5 w-5 ${count > 0 ? 'fill-coral text-coral' : ''}`} aria-hidden />
      {count > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 min-w-4 rounded-full bg-coral px-1 text-center text-[10px] leading-4 font-bold text-white">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}
