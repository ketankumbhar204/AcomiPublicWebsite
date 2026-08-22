import type { CSSProperties } from 'react';

type PhoneMockProps = {
  src: string;
  alt: string;
  caption?: string;
  size?: 'heroSide' | 'hero' | 'sm' | 'md' | 'lg';
  tilt?: number;
  priority?: boolean;
  className?: string;
};

const widths = {
  heroSide: 'w-[160px] sm:w-[180px]',
  hero: 'w-[210px] sm:w-[236px] lg:w-[252px]',
  sm: 'w-[188px] sm:w-[208px]',
  md: 'w-[220px] sm:w-[244px]',
  lg: 'w-[236px] sm:w-[268px]',
};

export function PhoneMock({
  src,
  alt,
  caption,
  size = 'md',
  tilt = 0,
  priority = false,
  className = '',
}: PhoneMockProps) {
  return (
    <figure className={`${widths[size]} ${className}`}>
      <div
        className={`phone-device overflow-hidden rounded-[32px] border border-[#c8d4ce] bg-white p-[9px] shadow-[0_4px_10px_rgba(11,28,22,0.06),0_22px_48px_rgba(11,28,22,0.16)] ${
          tilt ? 'lg:[transform:rotate(var(--phone-tilt))]' : ''
        }`}
        style={tilt ? ({ '--phone-tilt': `${tilt}deg` } as CSSProperties) : undefined}
      >
        <img
          src={src}
          alt={alt}
          width={390}
          height={844}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="block aspect-[390/844] h-auto w-full rounded-[24px] bg-[#eef4f1] object-cover object-top"
        />
      </div>
      {caption ? (
        <figcaption className="mt-4 text-center text-sm font-medium text-text-secondary">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
