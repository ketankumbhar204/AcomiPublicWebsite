import { useTranslation } from 'react-i18next';
import { resolveListingCover } from '../../data/listings/representativeImage';
import { ListingImage } from './ListingImage';

type ListingCoverProps = {
  listingId?: string | null;
  spaceType?: string | null;
  listingImageUrl?: string | null;
  className?: string;
  compact?: boolean;
};

export function RepresentativeImageBadge({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  return (
    <span
      className={`pointer-events-none absolute rounded-md bg-[rgba(15,23,42,0.72)] font-medium tracking-wide text-white ${
        compact ? 'bottom-1.5 right-1.5 px-1.5 py-0.5 text-[9px]' : 'bottom-2 right-2 px-2 py-0.5 text-[10px]'
      }`}
      aria-hidden
    >
      {t('discovery.representativeImage')}
    </span>
  );
}

export function ListingCover({
  listingId,
  spaceType,
  listingImageUrl,
  className = '',
  compact = false,
}: ListingCoverProps) {
  const { t } = useTranslation();
  const cover = resolveListingCover({ listingId, spaceType, listingImageUrl });
  const categoryLabel = t(`discovery.representativeCategory.${cover.category}`);
  const alt =
    cover.kind === 'representative'
      ? t('discovery.representativeImageAria', { category: categoryLabel })
      : '';

  return (
    <div className={`relative h-full w-full ${className}`}>
      <ListingImage src={cover.url} alt={alt} className="h-full w-full" />
      {cover.kind === 'representative' ? (
        <RepresentativeImageBadge compact={compact} />
      ) : null}
    </div>
  );
}
