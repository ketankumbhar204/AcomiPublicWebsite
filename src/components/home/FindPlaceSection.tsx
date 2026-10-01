import { useTranslation } from 'react-i18next';
import { ButtonLink } from '../common/ButtonLink';
import { Container } from '../layout/Container';
import { DiscoveryCategoryCard } from './DiscoveryCategoryCard';

const TYPES = [
  {
    key: 'pg',
    type: 'PG',
    image: '/assets/illustrations/places/pg-illustration.webp',
  },
  {
    key: 'hostel',
    type: 'HOSTEL',
    image: '/assets/illustrations/places/hostel-illustration.webp',
  },
  {
    key: 'coliving',
    type: 'CO_LIVING',
    image: '/assets/illustrations/places/co-living-illustration.webp',
  },
  {
    key: 'rental',
    type: 'RENTAL',
    image: '/assets/illustrations/places/rental-illustration.webp',
  },
] as const;

export function FindPlaceSection() {
  const { t } = useTranslation();
  const illustration = t('home.findPlace.illustration');

  return (
    <section className="bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="find-place-heading">
      <Container>
        <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
          {t('home.findPlace.eyebrow')}
        </p>
        <h2
          id="find-place-heading"
          className="mt-2 max-w-3xl text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.4rem]"
        >
          {t('home.findPlace.title')}
        </h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text-secondary">{t('home.findPlace.body')}</p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {TYPES.map((type) => {
            const name = t(`home.findPlace.types.${type.key}.name`);
            return (
              <li key={type.key}>
                <DiscoveryCategoryCard
                  href={`/places?types=${type.type}`}
                  imageSrc={type.image}
                  imageAlt={t('home.findPlace.illustrationAlt', { name, defaultValue: `Illustration of a ${name}` })}
                  illustrationLabel={illustration}
                  name={name}
                  line={t(`home.findPlace.types.${type.key}.line`)}
                />
              </li>
            );
          })}
        </ul>
        <div className="mt-8">
          <ButtonLink href="/places" external={false}>
            {t('home.findPlace.cta')}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
