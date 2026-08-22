type PhoneScreenshotProps = {
  src: string;
  alt: string;
  caption?: string;
  priority?: boolean;
  className?: string;
};

export function PhoneScreenshot({ src, alt, caption, priority = false, className = '' }: PhoneScreenshotProps) {
  return (
    <figure className={`w-[260px] shrink-0 sm:w-[280px] ${className}`}>
      <img
        src={src}
        alt={alt}
        width={1080}
        height={1920}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className="w-full rounded-2xl border border-border/80 bg-white shadow-lg shadow-slate-900/8"
      />
      {caption ? (
        <figcaption className="mt-3 text-center text-sm font-medium text-text-secondary">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
