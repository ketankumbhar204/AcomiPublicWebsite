import { useEffect } from 'react';
import { FinalCta } from '../components/home/FinalCta';
import { PageHero } from '../components/common/PageHero';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

export function AboutPage() {
  useEffect(() => {
    applySeo({
      title: 'About ACOMI',
      description: 'ACOMI means Accommodation + Meals. Operations software for occupancy, headcount, members, and dues.',
      path: '/about',
    });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="About"
        title="Accommodation + Meals"
        description="ACOMI is operations software for owners — not a listing site, not a payment gateway."
      />
      <section className="bg-background py-16 sm:py-20">
        <Container className="max-w-3xl space-y-6 text-lg leading-relaxed text-text-secondary">
          <p>
            ACOMI helps operators run a space: who lives there or eats there, occupancy when beds exist, daily meal
            headcount when food is served, dues with payment proofs, and complaints.
          </p>
          <p>
            Supported types are PG, Mess, Hostel, Co-living, and Rental. Mess is meal-first. Lodging is occupancy-first.
            Members join by invitation.
          </p>
          <p>Use the product at app.acomi.in or on Android. This website is the public introduction.</p>
        </Container>
      </section>
      <FinalCta />
    </>
  );
}
