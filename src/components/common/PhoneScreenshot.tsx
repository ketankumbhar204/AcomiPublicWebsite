type PhoneScreenshotProps = {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
  className?: string;
};

export function PhoneScreenshot({ src, alt, caption, priority = false, className = '' }: PhoneScreenshotProps) {
  return (
    <figure className={`mx-auto w-full max-w-[280px] ${className}`}>
      <div className="phone-device overflow-hidden rounded-[24px] border border-[#d4e0d9] bg-white p-2 shadow-[0_2px_4px_rgba(11,28,22,0.04),0_10px_28px_rgba(11,28,22,0.10)] transition duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_10px_rgba(11,28,22,0.05),0_16px_36px_rgba(11,28,22,0.12)]">
        <img
          src={src}
          alt={alt}
          width={1080}
          height={1920}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          className="block h-auto w-full rounded-[18px] object-contain"
        />
      </div>
      {caption ? (
        <figcaption className="mt-4 text-center text-sm font-medium text-text-secondary">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
