import { useEffect } from 'react';
import { BedDouble, Building2, Home, Hotel, UtensilsCrossed } from 'lucide-react';
import { FinalCta } from '../components/home/FinalCta';
import { PageHero } from '../components/common/PageHero';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

const audiences = [
  {
    icon: Home,
    title: 'PG owners',
    body: 'Paying Guest operators who need occupancy, members, meals when food is included, dues, and complaints in one space.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Mess operators',
    body: 'Meal-first operations: customers, menus, headcount, and meal billing. Accommodation structure is not used for Mess spaces.',
  },
  {
    icon: Hotel,
    title: 'Hostel operators',
    body: 'Hostel-style beds and rooms, member records, occupancy lifecycle, and day-to-day dues and issues.',
  },
  {
    icon: Building2,
    title: 'Co-living operators',
    body: 'Shared accommodation with occupancy, members, and the same operational modules as other lodging spaces.',
  },
  {
    icon: BedDouble,
    title: 'Rental operators',
    body: 'Flats and rooms — occupancy and members without turning ACOMI into a listing marketplace.',
  },
];

export function WhoItsForPage() {
  useEffect(() => {
    applySeo({
      title: "Who ACOMI is for",
      description:
        'Built for PG, mess, hostel, co-living, and rental owners — not a PG marketplace.',
      path: '/who-its-for',
    });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Who it's for"
        title="Built for owners of Indian shared living"
        description="ACOMI sells to operators. Tenants, meal customers, and staff join by invitation. This site is not for people looking for a PG."
      />
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2">
            {audiences.map((a) => {
              const Icon = a.icon;
              return (
                <article key={a.title} className="rounded-2xl border border-border bg-white p-8 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-soft text-primary-dark ring-1 ring-primary/20">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-text">{a.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{a.body}</p>
                </article>
              );
            })}
          </div>
        </Container>
      </section>
      <FinalCta />
    </>
  );
}
