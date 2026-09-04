import { useEffect } from 'react';
import { CalendarDays, UserPlus, Warehouse } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUserType } from '../context/UserTypeContext';
import { ActionButton } from '../components/common/ActionButton';
import { ButtonLink } from '../components/common/ButtonLink';
import { FinalCta } from '../components/home/FinalCta';
import { PageHero, PageSectionHead } from '../components/common/PageHero';
import { IconBadge } from '../components/common/IconBadge';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

export function PricingPage() {
  const { t } = useTranslation();
  const { openUserTypeModal } = useUserType();

  const items = [
    {
      title: t('pricingPage.items.create.title'),
      line: t('pricingPage.items.create.line'),
      Icon: Warehouse,
      tone: 'teal' as const,
      bg: 'bg-mint',
    },
    {
      title: t('pricingPage.items.invite.title'),
      line: t('pricingPage.items.invite.line'),
      Icon: UserPlus,
      tone: 'violet' as const,
      bg: 'bg-[#F7F4FF]',
    },
    {
      title: t('pricingPage.items.runDay.title'),
      line: t('pricingPage.items.runDay.line'),
      Icon: CalendarDays,
      tone: 'amber' as const,
      bg: 'bg-[#FFF8F1]',
    },
  ];

  useEffect(() => {
    applySeo({
      title: t('pricingPage.seo.title'),
      description: t('pricingPage.seo.description'),
      path: '/pricing',
    });
  }, [t]);

  return (
    <>
      <PageHero
        eyebrow={t('pricingPage.eyebrow')}
        title={t('pricingPage.title')}
        description={t('pricingPage.description')}
      >
        <div className="mt-6 flex flex-wrap gap-3">
          <ActionButton onClick={openUserTypeModal}>{t('nav.getStarted')}</ActionButton>
          <ButtonLink href="/how-it-works" variant="ghost" external={false}>
            {t('nav.howItWorks')}
          </ButtonLink>
        </div>
      </PageHero>
      <section className="bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="today-heading">
        <Container>
          <PageSectionHead id="today-heading" title={t('pricingPage.todayTitle')} />
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
