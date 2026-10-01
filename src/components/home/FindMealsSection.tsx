import { useTranslation } from 'react-i18next';
import { ButtonLink } from '../common/ButtonLink';
import { Container } from '../layout/Container';
import { DiscoveryCategoryCard } from './DiscoveryCategoryCard';

const TYPES = [
  {
    key: 'mess',
    image: '/assets/illustrations/meals/meal-thali-illustration.webp',
  },
  {
    key: 'tiffin',
    image: '/assets/illustrations/meals/tiffin-illustration.webp',
  },
  {
    key: 'mealService',
    image: '/assets/illustrations/meals/food-service-illustration.webp',
  },
] as const;

export function FindMealsSection() {
  const { t } = useTranslation();
  const illustration = t('home.findPlace.illustration');

  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="find-meals-heading">
      <Container>
        <p className="text-[11px] font-semibold tracking-[0.16em] text-orange uppercase">
          {t('home.findMeals.eyebrow')}
        </p>
        <h2
          id="find-meals-heading"
          className="mt-2 max-w-3xl text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.4rem]"
        >
          {t('home.findMeals.title')}
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text-secondary">{t('home.findMeals.body')}</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TYPES.map((type) => {
            const name = t(`home.findMeals.types.${type.key}.name`);
            return (
              <li key={type.key}>
                <DiscoveryCategoryCard
                  href="/meals"
                  imageSrc={type.image}
                  imageAlt={t('home.findMeals.illustrationAlt', {
                    name,
                    defaultValue: `Illustration of ${name}`,
                  })}
                  illustrationLabel={illustration}
                  name={name}
                  line={t(`home.findMeals.types.${type.key}.line`)}
                />
              </li>
            );
          })}
        </ul>
        <div className="mt-8">
          <ButtonLink href="/meals" external={false}>
            {t('home.findMeals.cta')}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
