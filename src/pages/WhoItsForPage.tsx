import { useEffect } from 'react';
import { BedDouble, Building2, Home, Users, UtensilsCrossed } from 'lucide-react';
import { FinalCta } from '../components/home/FinalCta';
import { OwnerMemberSection } from '../components/home/OwnerMemberSection';
import { PageHero, PageSectionHead } from '../components/common/PageHero';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

const audiences = [
  {
    title: 'PG owners',
    domain: 'Lodging',
    body: 'Paying Guest operators: occupancy, tenants, optional meals when food is included, dues, complaints.',
    Icon: BedDouble,
    tone: 'bg-mint text-primary',
  },
  {
    title: 'Mess operators',
    domain: 'Meals',
    body: 'Meal-first: customers, menus, breakfast/lunch/dinner participation, daily headcount, meal billing. No rooms or beds.',
    Icon: UtensilsCrossed,
    tone: 'bg-[#FFF8F1] text-orange',
  },
  {
    title: 'Hostel operators',
    domain: 'Lodging',
    body: 'Hostel beds and rooms, occupancy lifecycle, members, dues, and issues.',
    Icon: Building2,
    tone: 'bg-mint text-primary',
  },
  {
    title: 'Co-living operators',
    domain: 'Lodging',
    body: 'Shared units, occupancy, members, optional meals, dues.',
    Icon: Users,
    tone: 'bg-[#F7F4FF] text-purple',
  },
  {
    title: 'Rental operators',
    domain: 'Lodging',
    body: 'Flats and rooms as units — occupancy and tenants. Not a listing marketplace. Meals are not required.',
    Icon: Home,
    tone: 'bg-[#F4F8FF] text-blue',
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
      <section className="bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="audiences-heading">
        <Container>
          <PageSectionHead id="audiences-heading" title="Operators, by space type." />
          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {audiences.slice(0, 2).map((a) => (
              <AudienceCard key={a.title} {...a} />
            ))}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {audiences.slice(2).map((a) => (
              <AudienceCard key={a.title} {...a} />
            ))}
          </div>
        </Container>
      </section>
      <OwnerMemberSection />
      <FinalCta />
    </>
  );
}

function AudienceCard({
  title,
  domain,
  body,
  Icon,
  tone,
}: (typeof audiences)[number]) {
  return (
    <article className={`rounded-[20px] border border-black/5 p-6 shadow-[var(--shadow-sm)] ${tone}`}>
      <Icon className="h-8 w-8" strokeWidth={1.7} aria-hidden />
      <p className="mt-4 text-[11px] font-semibold tracking-[0.14em] uppercase opacity-70">{domain}</p>
      <h2 className="mt-1 text-lg font-semibold text-navy">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{body}</p>
    </article>
  );
}
