import { useTranslation } from 'react-i18next';
import { DEMO_LABEL } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';
import { OccupancyCard, MealHeadcountCard, PaymentSummaryCard, PeopleCard } from '../product/VisualCards';
import { Container } from '../layout/Container';

export function HeroMetricStrip({ className = '' }: { className?: string }) {
  const { t } = useTranslation();

  return (
    <section className={`bg-white pb-12 sm:pb-16 ${className}`} aria-labelledby="at-a-glance-heading">
      <Container>
        <h2
          id="at-a-glance-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          {t('home.atAGlance.title')}
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text-secondary">{t('home.atAGlance.body')}</p>
        <DemoLabel className="mt-3">{DEMO_LABEL}</DemoLabel>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <OccupancyCard />
          <MealHeadcountCard />
          <PaymentSummaryCard />
          <PeopleCard />
        </div>
      </Container>
    </section>
  );
}
