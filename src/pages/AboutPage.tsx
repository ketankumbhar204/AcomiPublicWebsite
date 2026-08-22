import { useEffect } from 'react';
import { FinalCta } from '../components/home/FinalCta';
import { PageHero } from '../components/common/PageHero';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

export function AboutPage() {
  useEffect(() => {
    applySeo({
      title: 'About ACOMI',
      description: 'ACOMI is operations software for occupancy, members, meals, and dues.',
      path: '/about',
    });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="About"
        title="About ACOMI"
        description="ACOMI brings accommodation and meal operations into one product for owners and operators."
      />
      <section className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <p className="text-lg leading-relaxed text-text-secondary">
            ACOMI stands for Accommodation + Meals. It is designed to help operators manage the operational side of a
            space from one place — occupancy, members, meals, dues, complaints, and inventory.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">
            Supported space types are PG, Mess, Hostel, Co-living, and Rental. Mess is meal-first and does not use
            bed and room structure. Members join by invitation; ACOMI is not a marketplace for finding a PG.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-text-secondary">
            Use the product at app.acomi.in, or on Android. This website is the public introduction — not the signed-in
            application.
          </p>
        </Container>
      </section>
      <FinalCta />
    </>
  );
}
