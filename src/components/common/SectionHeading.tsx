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
  align = 'left',
  id,
}: SectionHeadingProps) {
  const alignCls = align === 'center' ? 'mx-auto text-center' : 'text-left';
  return (
    <div className={`max-w-3xl ${alignCls}`}>
      {eyebrow ? (
        <p className="mb-2 text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">{eyebrow}</p>
      ) : null}
      <h2 id={id} className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]">
        {title}
      </h2>
      {description ? <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">{description}</p> : null}
    </div>
  );
}
