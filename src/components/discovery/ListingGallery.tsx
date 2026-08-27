import { useState } from 'react';
import { ListingImage } from './ListingImage';

type ListingGalleryProps = {
  images: string[];
  name: string;
};

export function ListingGallery({ images, name }: ListingGalleryProps) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];

  return (
    <div>
      <div className="overflow-hidden rounded-[24px] border border-black/5 bg-white shadow-[var(--shadow-sm)]">
        <ListingImage src={current} alt={`${name} photo`} className="aspect-[16/10] w-full" />
      </div>
      {images.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
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
