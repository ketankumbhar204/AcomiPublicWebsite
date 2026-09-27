import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { resolveListingCover } from '../../data/listings/representativeImage';
import { RepresentativeImageBadge } from './ListingCover';
import { ListingImage } from './ListingImage';

type ListingGalleryProps = {
  listingId: string;
  spaceType?: string | null;
  images: string[];
  name: string;
};

export function ListingGallery({ listingId, spaceType, images, name }: ListingGalleryProps) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const cover = resolveListingCover({
    listingId,
    spaceType,
    listingImageUrl: images[0],
  });
  const gallery = cover.kind === 'listing' && images.length > 0 ? images : [cover.url];
  const current = gallery[index] ?? gallery[0];
  const categoryLabel = t(`discovery.representativeCategory.${cover.category}`);
  const alt =
    cover.kind === 'representative'
      ? t('discovery.representativeImageAria', { category: categoryLabel })
      : `${name} photo`;

  return (
    <div>
      <div className="relative overflow-hidden rounded-[24px] border border-black/5 bg-white shadow-[var(--shadow-sm)]">
        <ListingImage src={current} alt={alt} className="aspect-[16/10] w-full" />
        {cover.kind === 'representative' ? (
          <RepresentativeImageBadge />
        ) : null}
      </div>
      {gallery.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {gallery.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border ${
                i === index ? 'border-register ring-2 ring-register/30' : 'border-black/5'
              }`}
            >
              <ListingImage src={src} alt="" className="h-full w-full" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
