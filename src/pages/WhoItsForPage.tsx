import { useEffect } from 'react';
import { FinalCta } from '../components/home/FinalCta';
import { PageHero } from '../components/common/PageHero';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

const audiences = [
  {
    title: 'PG owners',
    domain: 'Lodging',
    body: 'Paying Guest operators: occupancy, tenants, optional meals when food is included, dues, complaints.',
  },
  {
    title: 'Mess operators',
    domain: 'Meals',
    body: 'Meal-first: customers, menus, breakfast/lunch/dinner participation, daily headcount, meal billing. No rooms or beds.',
    meal: true,
  },
  {
    title: 'Hostel operators',
    domain: 'Lodging',
    body: 'Hostel beds and rooms, occupancy lifecycle, members, dues, and issues.',
  },
  {
    title: 'Co-living operators',
    domain: 'Lodging',
    body: 'Shared units, occupancy, members, optional meals, dues.',
  },
  {
    title: 'Rental operators',
    domain: 'Lodging',
    body: 'Flats and rooms as units — occupancy and tenants. Not a listing marketplace. Meals are not required.',
  },
];

export function WhoItsForPage() {
  useEffect(() => {
    applySeo({
      title: "Who ACOMI is for",
      description:
        'Equal weight for PG and Mess operators, plus hostel, co-living, and rental. Not a PG marketplace.',
      path: '/who-its-for',
    });
  }, []);

  return (
    <>
      <PageHero
        eyebrow="Who it's for"
        title="Sold to owners. Used by invited people."
        description="ACOMI is for operators of Indian shared living and messes. Tenants, meal customers, and staff join by invitation. This site is not for people looking for a PG."
      />
      <section className="bg-background py-16 sm:py-20">
        <Container>
          <div className="grid gap-5 lg:grid-cols-2">
            {audiences.map((a) => (
              <article
                key={a.title}
                className={`rounded-3xl p-8 ${a.meal ? 'bg-[#0b5f7a] text-white lg:col-span-2' : 'bg-white ring-1 ring-border'}`}
              >
                <p
                  className={`text-[11px] font-semibold tracking-[0.16em] uppercase ${a.meal ? 'text-[#b8e6f3]' : 'text-primary'}`}
                >
                  {a.domain}
                </p>
                <h2 className="mt-2 text-xl font-bold">{a.title}</h2>
                <p className={`mt-2 text-sm leading-relaxed ${a.meal ? 'text-white/75' : 'text-text-secondary'}`}>
                  {a.body}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <FinalCta />
    </>
  );
}
