import { useEffect, type ReactNode } from 'react';
import { BedDouble, Building2, Home, Monitor, Smartphone, UserRound, Users, UtensilsCrossed } from 'lucide-react';
import { FinalCta } from '../components/home/FinalCta';
import { PageHero, PageSectionHead } from '../components/common/PageHero';
import { IconBadge } from '../components/common/IconBadge';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

const types = [
  { name: 'PG', line: 'Rooms · beds · members', Icon: BedDouble, tone: 'bg-mint text-primary' },
  { name: 'MESS', line: 'Customers · menu · headcount', Icon: UtensilsCrossed, tone: 'bg-[#FFF8F1] text-orange' },
  { name: 'HOSTEL', line: 'Accommodation · occupancy', Icon: Building2, tone: 'bg-mint text-primary' },
  { name: 'CO-LIVING', line: 'Shared accommodation', Icon: Users, tone: 'bg-[#F7F4FF] text-purple' },
  { name: 'RENTAL', line: 'Units · tenants', Icon: Home, tone: 'bg-[#F4F8FF] text-blue' },
];

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
        title="Accommodation + Meals."
        description="ACOMI is operations software for owners — not a listing site, not a payment gateway."
      />

      <section className="bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="about-heading">
        <Container>
          <PageSectionHead
            id="about-heading"
            title="What ACOMI helps you run."
            intro="Who lives there or eats there, occupancy when beds exist, daily meal headcount when food is served, dues with payment proofs, and complaints."
          />
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <article className="rounded-[24px] border border-black/5 bg-mint p-6 shadow-[var(--shadow-sm)]">
              <IconBadge icon={BedDouble} tone="teal" />
              <h2 className="mt-4 text-[1.35rem] font-semibold text-navy">Accommodation</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Lodging is occupancy-first. PG, hostel, co-living, and rental start from property, rooms, and people.
              </p>
            </article>
            <article className="rounded-[24px] border border-black/5 bg-[#FFF8F1] p-6 shadow-[var(--shadow-sm)]">
              <IconBadge icon={UtensilsCrossed} tone="amber" />
              <h2 className="mt-4 text-[1.35rem] font-semibold text-navy">Meals</h2>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                Mess is meal-first. Customers, menus, participation, and kitchen headcount — no rooms or beds.
              </p>
            </article>
          </div>
        </Container>
      </section>

      <section className="bg-white py-12 sm:py-14" aria-labelledby="types-heading">
        <Container>
          <PageSectionHead id="types-heading" title="Supported space types." />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {types.map((t) => (
              <li
                key={t.name}
                className={`rounded-[20px] border border-black/5 p-5 shadow-[var(--shadow-sm)] ${t.tone}`}
              >
                <t.Icon className="h-8 w-8" strokeWidth={1.7} aria-hidden />
                <p className="mt-4 text-lg font-semibold text-navy">{t.name}</p>
                <p className="mt-1 text-sm text-text-secondary">{t.line}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-[#F7F8FA] py-12 sm:py-14">
        <Container>
          <div className="grid gap-4 sm:grid-cols-3">
            <Fact icon={<IconBadge icon={UserRound} tone="teal" />} title="Owners first" line="Members join by invitation." />
            <Fact icon={<IconBadge icon={Monitor} tone="blue" />} title="Web" line="Use the product at app.acomi.in." />
            <Fact icon={<IconBadge icon={Smartphone} tone="violet" />} title="Android" line="The same product on site." />
          </div>
          <p className="mt-8 max-w-2xl text-sm leading-relaxed text-text-secondary">
            This website is the public introduction.
          </p>
        </Container>
      </section>
      <FinalCta />
    </>
  );
}

function Fact({ icon, title, line }: { icon: ReactNode; title: string; line: string }) {
  return (
    <article className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
      {icon}
      <h3 className="mt-4 text-lg font-semibold text-navy">{title}</h3>
      <p className="mt-1 text-sm text-text-secondary">{line}</p>
    </article>
  );
}
