type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <section className="border-b border-border/80 bg-white pt-16 pb-12 sm:pt-20 sm:pb-16">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-dark">
          {eyebrow}
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-text sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-secondary">{description}</p>
      </div>
    </section>
  );
}
