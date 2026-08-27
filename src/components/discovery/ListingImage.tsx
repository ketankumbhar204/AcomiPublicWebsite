import { useState } from 'react';

type ListingImageProps = {
  src?: string;
  alt: string;
  className?: string;
};

export function ListingImage({ src, alt, className = '' }: ListingImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <div className={`bg-mint ${className}`} role="img" aria-label={alt} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`bg-mint object-cover ${className}`}
    />
  );
}
