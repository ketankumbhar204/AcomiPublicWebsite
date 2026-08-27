import { BedDouble, Building2, Home, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Container } from '../layout/Container';

const types: Array<{ name: string; line: string; Icon: LucideIcon; tone: string }> = [
  { name: 'PG', line: 'Rooms · beds · members', Icon: BedDouble, tone: 'bg-mint text-primary' },
  {
    name: 'HOSTEL',
    line: 'Accommodation · occupancy',
    Icon: Building2,
    tone: 'bg-mint text-primary',
  },
  {
    name: 'CO-LIVING',
    line: 'Shared accommodation',
    Icon: Users,
    tone: 'bg-[#F7F4FF] text-purple',
  },
  { name: 'RENTAL', line: 'Units · tenants', Icon: Home, tone: 'bg-[#F4F8FF] text-blue' },
];

export function OwnerSpaceTypesSection() {
  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="owner-types-heading">
      <Container>
        <h2
          id="owner-types-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          One product. Four property types.
        </h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">
          Space type is chosen once. The layout follows the property.
        </p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
