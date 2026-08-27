import { ChefHat, Soup, UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Container } from '../layout/Container';

const types: Array<{ name: string; line: string; Icon: LucideIcon; tone: string }> = [
  {
    name: 'MESS',
    line: 'Customers · menu · headcount',
    Icon: UtensilsCrossed,
    tone: 'bg-[#FFF8F1] text-orange',
  },
  {
    name: 'TIFFIN',
    line: 'Daily meals · participation',
    Icon: Soup,
    tone: 'bg-[#FFF1E0] text-orange',
  },
  {
    name: 'MEAL SERVICE',
    line: 'Menu · plates · kitchen',
    Icon: ChefHat,
    tone: 'bg-[#E7F6EE] text-primary',
  },
];

export function MessVendorServiceTypesSection() {
  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="mess-types-heading">
      <Container>
        <h2
          id="mess-types-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          One product. Food operations.
        </h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">
          Space type is chosen once. The layout follows the mess.
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
