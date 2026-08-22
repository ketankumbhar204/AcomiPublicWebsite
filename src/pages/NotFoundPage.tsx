import { useEffect } from 'react';
import { APP } from '../constants/links';
import { ButtonLink } from '../components/common/ButtonLink';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

export function NotFoundPage() {
  useEffect(() => {
    applySeo({
      title: 'Page not found — ACOMI',
      description: 'That page is not on the ACOMI public website.',
      path: '/404',
    });
  }, []);

  return (
    <section className="bg-[radial-gradient(ellipse_at_top_left,rgba(184,240,200,0.28),transparent_46%)] bg-white py-20 sm:py-24">
      <Container className="max-w-xl text-center">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">404</p>
        <h1 className="mt-3 text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.4rem]">
          Page not found.
        </h1>
        <p className="mt-3 text-[15px] text-text-secondary">The page you opened is not part of this site.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="ghost" external={false}>
            Home
          </ButtonLink>
          <ButtonLink href={APP.register}>Get started</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
