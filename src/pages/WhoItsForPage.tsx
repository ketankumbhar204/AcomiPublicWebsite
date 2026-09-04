import { useEffect } from 'react';
import { BedDouble, Building2, Home, Users, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { FinalCta } from '../components/home/FinalCta';
import { OwnerMemberSection } from '../components/home/OwnerMemberSection';
import { PageHero, PageSectionHead } from '../components/common/PageHero';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

export function WhoItsForPage() {
  const { t } = useTranslation();

  const audiences = [
    {
      title: t('whoItsForPage.audiences.mess.title'),
      domain: t('whoItsForPage.audiences.mess.domain'),
      body: t('whoItsForPage.audiences.mess.body'),
      Icon: UtensilsCrossed,
      tone: 'bg-[#FFF8F1] text-orange',
    },
    {
      title: t('whoItsForPage.audiences.pg.title'),
      domain: t('whoItsForPage.audiences.pg.domain'),
      body: t('whoItsForPage.audiences.pg.body'),
      Icon: BedDouble,
      tone: 'bg-mint text-primary',
    },
    {
      title: t('whoItsForPage.audiences.hostel.title'),
      domain: t('whoItsForPage.audiences.hostel.domain'),
      body: t('whoItsForPage.audiences.hostel.body'),
      Icon: Building2,
      tone: 'bg-mint text-primary',
    },
    {
      title: t('whoItsForPage.audiences.coliving.title'),
      domain: t('whoItsForPage.audiences.coliving.domain'),
      body: t('whoItsForPage.audiences.coliving.body'),
      Icon: Users,
      tone: 'bg-[#F7F4FF] text-purple',
    },
    {
      title: t('whoItsForPage.audiences.rental.title'),
      domain: t('whoItsForPage.audiences.rental.domain'),
      body: t('whoItsForPage.audiences.rental.body'),
      Icon: Home,
      tone: 'bg-[#F4F8FF] text-blue',
    },
  ];

  useEffect(() => {
    applySeo({
      title: t('whoItsForPage.seo.title'),
      description: t('whoItsForPage.seo.description'),
      path: '/who-its-for',
    });
  }, [t]);

  return (
    <>
      <PageHero
        eyebrow={t('whoItsForPage.eyebrow')}
        title={t('whoItsForPage.title')}
        description={t('whoItsForPage.description')}
      />
      <section className="bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="audiences-heading">
        <Container>
          <PageSectionHead id="audiences-heading" title={t('whoItsForPage.operatorsTitle')} />
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
}: {
  title: string;
  domain: string;
  body: string;
  Icon: typeof UtensilsCrossed;
  tone: string;
}) {
  return (
    <article className={`rounded-[20px] border border-black/5 p-6 shadow-[var(--shadow-sm)] ${tone}`}>
      <Icon className="h-8 w-8" strokeWidth={1.7} aria-hidden />
      <p className="mt-4 text-[11px] font-semibold tracking-[0.14em] uppercase opacity-70">{domain}</p>
      <h2 className="mt-1 text-lg font-semibold text-navy">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{body}</p>
    </article>
  );
}
