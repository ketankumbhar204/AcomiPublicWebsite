import { BedDouble, Building2, Home, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../layout/Container';

export function OwnerSpaceTypesSection() {
  const { t } = useTranslation();

  const types: Array<{ name: string; line: string; Icon: LucideIcon; tone: string }> = [
    {
      name: t('home.spaceTypes.types.pg.name'),
      line: t('home.spaceTypes.types.pg.line'),
      Icon: BedDouble,
      tone: 'bg-mint text-primary',
    },
    {
      name: t('home.spaceTypes.types.hostel.name'),
      line: t('home.spaceTypes.types.hostel.line'),
      Icon: Building2,
      tone: 'bg-mint text-primary',
    },
    {
      name: t('home.spaceTypes.types.coliving.name'),
      line: t('home.spaceTypes.types.coliving.line'),
      Icon: Users,
      tone: 'bg-[#F7F4FF] text-purple',
    },
    {
      name: t('home.spaceTypes.types.rental.name'),
      line: t('home.spaceTypes.types.rental.line'),
      Icon: Home,
      tone: 'bg-[#F4F8FF] text-blue',
    },
  ];

  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="owner-types-heading">
      <Container>
        <h2
          id="owner-types-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          {t('owner.spaceTypes.title')}
        </h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">
          {t('owner.spaceTypes.subtitle')}
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {types.map((type) => (
            <li
              key={type.name}
              className={`rounded-[20px] border border-black/5 p-5 shadow-[var(--shadow-sm)] ${type.tone}`}
            >
              <type.Icon className="h-8 w-8" strokeWidth={1.7} aria-hidden />
              <p className="mt-4 text-lg font-semibold text-navy">{type.name}</p>
              <p className="mt-1 text-sm text-text-secondary">{type.line}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
