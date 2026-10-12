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

export function ListingCover({
  listingId,
  spaceType,
  listingImageUrl,
  className = '',
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
    </div>
  );
}
