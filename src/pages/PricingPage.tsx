import { useEffect } from 'react';
import { APP } from '../constants/links';
import { ButtonLink } from '../components/common/ButtonLink';
import { FinalCta } from '../components/home/FinalCta';
import { PageHero } from '../components/common/PageHero';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

export function PricingPage() {
  useEffect(() => {
    applySeo({
      title: 'Pricing — ACOMI',
      description: 'Create an ACOMI space to get started. Public plan prices are not listed on this site.',
      path: '/pricing',
    });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="No public price list"
        description="ACOMI does not publish plans, rupee amounts, free-trial length, or cancel-anytime terms on this website. Create a space and use the product."
      />
      <section className="bg-background py-16 sm:py-20">
        <Container className="max-w-3xl">
          <div className="rounded-3xl bg-white p-8 ring-1 ring-border sm:p-10">
            <h2 className="text-xl font-bold text-text">What you can do today</h2>
            <ul className="mt-5 space-y-3 text-sm leading-relaxed text-text-secondary">
              <li>Create a PG, mess, hostel, co-living, or rental space.</li>
              <li>Invite members by Indian mobile number — no public listings.</li>
              <li>Run occupancy or meal headcount, plus dues proofs and complaints, on web and Android.</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={APP.register}>Get started</ButtonLink>
              <ButtonLink href="/how-it-works" variant="ghost" external={false}>
                How it works
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>
      <FinalCta />
    </>
  );
}
