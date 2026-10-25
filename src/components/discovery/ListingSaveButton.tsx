import { Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFavorites, type FavoriteKind } from '../../context/FavoritesContext';

type ListingSaveButtonProps = {
  id: string;
  name: string;
  kind: FavoriteKind;
  detail?: string;
};

export function ListingSaveButton({ id, name, kind, detail = '' }: ListingSaveButtonProps) {
  const { t } = useTranslation();
  const { isSaved, toggleFavorite } = useFavorites();
  const saved = isSaved(id);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={t(saved ? 'discovery.unsave' : 'discovery.save', { name })}
      onClick={() => toggleFavorite({ id, kind, name, detail })}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-navy shadow-[0_2px_8px_rgba(15,23,42,0.12)]"
    >
      <Heart aria-hidden className={`h-4 w-4 ${saved ? 'fill-coral text-coral' : ''}`} />
    </button>
  );
}
