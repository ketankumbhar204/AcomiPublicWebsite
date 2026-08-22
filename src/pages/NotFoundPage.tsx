import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

export function NotFoundPage() {
  useEffect(() => {
    applySeo({
      title: 'Page not found — ACOMI',
      description: 'This page does not exist on the ACOMI public website.',
      path: '/404',
    });
  }, []);

  return (
    <section className="py-24">
      <Container className="text-center">
        <h1 className="text-3xl font-bold text-text">Page not found</h1>
        <p className="mt-3 text-text-secondary">That address is not part of the ACOMI public website.</p>
        <Link to="/" className="mt-8 inline-block text-sm font-semibold text-primary-dark">
          Back to home
        </Link>
      </Container>
    </section>
  );
}
