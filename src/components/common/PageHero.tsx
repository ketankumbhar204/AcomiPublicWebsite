import type { ReactNode } from 'react';
import { Container } from '../layout/Container';

type PageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section
      className="bg-[radial-gradient(ellipse_at_top_left,rgba(184,240,200,0.28),transparent_46%)] bg-white pt-10 pb-10 sm:pt-14 sm:pb-12"
    >
      <Container>
        <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.6rem]">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-secondary sm:text-[16px]">
          {description}
        </p>
        {children}
      </Container>
    </section>
  );
}

type PageSectionHeadProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  eyebrowClass?: string;
};

export function PageSectionHead({
  id,
  eyebrow,
  title,
  intro,
  eyebrowClass = 'text-primary',
}: PageSectionHeadProps) {
  return (
    <div>
      {eyebrow ? (
        <p className={`text-[11px] font-semibold tracking-[0.16em] uppercase ${eyebrowClass}`}>{eyebrow}</p>
      ) : null}
      <h2
        id={id}
        className={`${eyebrow ? 'mt-2' : ''} text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]`}
      >
        {title}
      </h2>
      {intro ? <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-text-secondary">{intro}</p> : null}
    </div>
  );
}
