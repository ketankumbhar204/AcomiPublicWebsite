import { ChefHat, Soup, UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../layout/Container';

export function MessVendorServiceTypesSection() {
  const { t } = useTranslation();
  const types: Array<{ name: string; line: string; Icon: LucideIcon; tone: string }> = [
    { name: t('home.spaceTypes.types.mess.name'), line: t('home.spaceTypes.types.mess.line'), Icon: UtensilsCrossed, tone: 'bg-[#FFF8F1] text-orange' },
    { name: t('messVendor.serviceTypes.tiffin.name'), line: t('messVendor.serviceTypes.tiffin.line'), Icon: Soup, tone: 'bg-[#FFF1E0] text-orange' },
    { name: t('messVendor.serviceTypes.mealService.name'), line: t('messVendor.serviceTypes.mealService.line'), Icon: ChefHat, tone: 'bg-[#E7F6EE] text-primary' },
  ];

  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="mess-types-heading">
      <Container>
        <h2
          id="mess-types-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          {t('messVendor.serviceTypes.title')}
        </h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">
          {t('messVendor.serviceTypes.subtitle')}
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
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
  );
}
