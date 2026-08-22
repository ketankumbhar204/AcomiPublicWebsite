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
    <section className="bg-background py-24">
      <Container className="max-w-xl text-center">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">404</p>
        <h1 className="mt-3 text-3xl font-bold text-text">Page not found</h1>
        <p className="mt-3 text-text-secondary">The page you opened is not part of this site.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" variant="outline" external={false}>
            Home
          </ButtonLink>
          <ButtonLink href={APP.register}>Get started</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
