import { ArrowRight, CalendarDays, Settings2, UserPlus, Warehouse } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { IconBadge } from '../common/IconBadge';
import { Container } from '../layout/Container';

type Step = {
  n: string;
  title: string;
  line: string;
  Icon: LucideIcon;
  tone: 'teal' | 'blue' | 'violet' | 'amber';
};

const steps: Step[] = [
  {
    n: '01',
    title: 'Create your space',
    line: 'PG, hostel, co-living or rental.',
    Icon: Warehouse,
    tone: 'teal',
  },
  {
    n: '02',
    title: 'Set up the property',
    line: 'Buildings, rooms and beds. Quick Setup or manual builder.',
    Icon: Settings2,
    tone: 'blue',
  },
  {
    n: '03',
    title: 'Add your people',
    line: 'Add a member record, or invite a mobile number.',
    Icon: UserPlus,
    tone: 'violet',
  },
  {
    n: '04',
    title: 'Run the day',
    line: 'Occupancy, payments and issues.',
    Icon: CalendarDays,
    tone: 'amber',
  },
];

const pgFlow = [
  'Create PG',
  'Configure rooms/beds',
  'Add residents',
  'Track occupancy',
  'Track payments',
];

export function OwnerHowItWorksSection() {
  return (
    <section
      className="border-t border-border bg-[#F7F8FA] py-12 sm:py-14"
      aria-labelledby="owner-hiw-heading"
    >
      <Container>
        <h2
          id="owner-hiw-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          How it works
        </h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li
              key={s.n}
              className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]"
            >
              <IconBadge icon={s.Icon} tone={s.tone} />
              <p className="mt-4 text-[11px] font-semibold tracking-[0.14em] text-muted">{s.n}</p>
              <p className="mt-1 text-lg font-semibold text-navy">{s.title}</p>
              <p className="mt-2 text-sm text-text-secondary">{s.line}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 flex flex-wrap items-center gap-1.5 rounded-2xl bg-white px-4 py-3 text-xs font-semibold text-navy">
          <span className="mr-1 text-[11px] tracking-[0.12em] text-muted">PG</span>
          {pgFlow.map((s, i) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              {s}
              {i < pgFlow.length - 1 ? (
                <ArrowRight className="h-3 w-3 text-muted" aria-hidden />
              ) : null}
            </span>
          ))}
        </p>
      </Container>
    </section>
  );
}
