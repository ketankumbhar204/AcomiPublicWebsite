type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  id?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  id,
}: SectionHeadingProps) {
  const alignCls = align === 'center' ? 'text-center mx-auto' : 'text-left';
  return (
    <div className={`max-w-3xl ${alignCls}`}>
      {eyebrow ? (
        <p className="mb-3 text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 id={id} className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-lg leading-relaxed text-text-secondary">{description}</p>
      ) : null}
    </div>
  );
}
