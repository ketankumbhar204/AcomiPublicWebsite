import { BedDouble, Building2, Home, Users, UtensilsCrossed } from 'lucide-react';
import { Container } from '../layout/Container';

const types = [
  { name: 'PG', line: 'Rooms · beds · members', Icon: BedDouble, tone: 'bg-mint text-primary' },
  { name: 'MESS', line: 'Customers · menu · headcount', Icon: UtensilsCrossed, tone: 'bg-[#FFF8F1] text-orange' },
  { name: 'HOSTEL', line: 'Accommodation · occupancy', Icon: Building2, tone: 'bg-mint text-primary' },
  { name: 'CO-LIVING', line: 'Shared accommodation', Icon: Users, tone: 'bg-[#F7F4FF] text-purple' },
  { name: 'RENTAL', line: 'Units · tenants', Icon: Home, tone: 'bg-[#F4F8FF] text-blue' },
];

export function SpaceTypesSection() {
  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="types-heading">
      <Container>
        <h2
          id="types-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          Space types
        </h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
