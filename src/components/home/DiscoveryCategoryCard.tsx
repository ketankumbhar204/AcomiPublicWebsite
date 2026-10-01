import { Link } from 'react-router-dom';

type DiscoveryCategoryCardProps = {
  href: string;
  imageSrc: string;
  imageAlt: string;
  illustrationLabel: string;
  name: string;
  line: string;
};

export function DiscoveryCategoryCard({
  href,
  imageSrc,
  imageAlt,
  illustrationLabel,
  name,
  line,
}: DiscoveryCategoryCardProps) {
  return (
    <Link
      to={href}
      className="ui-lift flex h-full flex-col overflow-hidden rounded-[24px] border border-black/5 bg-white text-left shadow-[var(--shadow-sm)]"
    >
      <img src={imageSrc} alt={imageAlt} className="aspect-[16/10] w-full object-cover" />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">{illustrationLabel}</p>
        <h3 className="mt-2 text-lg font-semibold text-navy">{name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{line}</p>
      </div>
    </Link>
  );
}
