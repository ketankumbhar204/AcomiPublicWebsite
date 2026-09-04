import { BedDouble, Building2, Home, Users, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../layout/Container';

export function SpaceTypesSection() {
  const { t } = useTranslation();

  const types = [
    {
      name: t('home.spaceTypes.types.mess.name'),
      line: t('home.spaceTypes.types.mess.line'),
      Icon: UtensilsCrossed,
      tone: 'bg-[#FFF8F1] text-orange',
    },
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
    <section className="bg-white py-12 sm:py-14" aria-labelledby="types-heading">
      <Container>
        <h2
          id="types-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          {t('home.spaceTypes.title')}
        </h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {types.map((item) => (
            <li
              key={item.name}
              className={`rounded-[20px] border border-black/5 p-5 shadow-[var(--shadow-sm)] ${item.tone}`}
            >
              <item.Icon className="h-8 w-8" strokeWidth={1.7} aria-hidden />
              <p className="mt-4 text-lg font-semibold text-navy">{item.name}</p>
              <p className="mt-1 text-sm text-text-secondary">{item.line}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
