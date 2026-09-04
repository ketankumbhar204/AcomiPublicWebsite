import { useTranslation } from 'react-i18next';
import { OccupancyCard, MealHeadcountCard, PaymentSummaryCard, PeopleCard } from '../product/VisualCards';
import { Container } from '../layout/Container';

export function HeroMetricStrip() {
  const { t } = useTranslation();

  return (
    <section className="bg-white pb-12 sm:pb-16" aria-label={t('a11y.atAGlance')}>
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <OccupancyCard />
          <MealHeadcountCard />
          <PaymentSummaryCard />
          <PeopleCard />
        </div>
      </Container>
    </section>
  );
}
