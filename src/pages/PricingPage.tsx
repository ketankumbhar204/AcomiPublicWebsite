import { useEffect } from 'react';
import { CalendarDays, UserPlus, Warehouse } from 'lucide-react';
import { useUserType } from '../context/UserTypeContext';
import { ActionButton } from '../components/common/ActionButton';
import { ButtonLink } from '../components/common/ButtonLink';
import { FinalCta } from '../components/home/FinalCta';
import { PageHero, PageSectionHead } from '../components/common/PageHero';
import { IconBadge } from '../components/common/IconBadge';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

const items = [
  {
    title: 'Create a space',
    line: 'Create a mess, PG, hostel, co-living, or rental space.',
    Icon: Warehouse,
    tone: 'teal' as const,
    bg: 'bg-mint',
  },
  {
    title: 'Invite members',
    line: 'Invite by Indian mobile number — no public listings.',
    Icon: UserPlus,
    tone: 'violet' as const,
    bg: 'bg-[#F7F4FF]',
  },
  {
    title: 'Run the day',
    line: 'Occupancy or meal headcount, plus dues proofs and complaints, on web and Android.',
    Icon: CalendarDays,
    tone: 'amber' as const,
    bg: 'bg-[#FFF8F1]',
  },
];

export function PricingPage() {
  const { openUserTypeModal } = useUserType();

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
        title="No public price list."
        description="ACOMI does not publish plans, rupee amounts, free-trial length, or cancel-anytime terms on this website. Create a space and use the product."
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <ActionButton onClick={openUserTypeModal}>Get started</ActionButton>
          <ButtonLink href="/how-it-works" variant="ghost" external={false}>
            How it works
          </ButtonLink>
        </div>
      </PageHero>
      <section className="bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="today-heading">
        <Container>
          <PageSectionHead id="today-heading" title="What you can do today." />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {items.map((item) => (
              <article
                key={item.title}
                className={`rounded-[20px] border border-black/5 p-6 shadow-[var(--shadow-sm)] ${item.bg}`}
              >
                <IconBadge icon={item.Icon} tone={item.tone} />
                <h2 className="mt-4 text-lg font-semibold text-navy">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{item.line}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
      <FinalCta />
    </>
  );
}
