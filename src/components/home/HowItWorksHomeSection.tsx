import { ArrowRight, CalendarDays, Settings2, UserPlus, Warehouse } from 'lucide-react';
import { IconBadge } from '../common/IconBadge';
import { Container } from '../layout/Container';

const steps = [
  { n: '01', title: 'Create space', line: 'Mess or PG.', Icon: Warehouse, tone: 'teal' as const },
  { n: '02', title: 'Set up operations', line: 'Rooms or menu.', Icon: Settings2, tone: 'blue' as const },
  { n: '03', title: 'Add people', line: 'Residents or customers.', Icon: UserPlus, tone: 'violet' as const },
  { n: '04', title: 'Run the day', line: 'Occupancy, plates, dues.', Icon: CalendarDays, tone: 'amber' as const },
];

const pg = ['Create PG', 'Configure rooms/beds', 'Add residents', 'Track occupancy', 'Track payments'];
const mess = ['Create Mess', 'Add customers', 'Create menu', 'Collect participation', 'See headcount'];

export function HowItWorksHomeSection() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-t border-border bg-[#F7F8FA] py-12 sm:py-14"
      aria-labelledby="hiw-heading"
    >
      <Container>
        <h2
          id="hiw-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          How it works
        </h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
              <IconBadge icon={s.Icon} tone={s.tone} />
              <p className="mt-4 text-[11px] font-semibold tracking-[0.14em] text-muted">{s.n}</p>
              <p className="mt-1 text-lg font-semibold text-navy">{s.title}</p>
              <p className="mt-2 text-sm text-text-secondary">{s.line}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 grid gap-3 lg:grid-cols-2">
          <Flow label="MESS" steps={mess} />
          <Flow label="PG" steps={pg} />
        </div>
      </Container>
    </section>
  );
}

function Flow({ label, steps }: { label: string; steps: readonly string[] }) {
  return (
    <p className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-white px-4 py-3 text-xs font-semibold text-navy">
      <span className="mr-1 text-[11px] tracking-[0.12em] text-muted">{label}</span>
      {steps.map((s, i) => (
        <span key={s} className="inline-flex items-center gap-1.5">
          {s}
          {i < steps.length - 1 ? <ArrowRight className="h-3 w-3 text-muted" aria-hidden /> : null}
        </span>
      ))}
    </p>
  );
}
