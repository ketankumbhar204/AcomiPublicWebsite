import { ArrowRight, CalendarDays, Settings2, UserPlus, Warehouse } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { IconBadge } from '../common/IconBadge';
import { Container } from '../layout/Container';

type Step = {
  n: string;
  title: string;
  line: string;
  Icon: LucideIcon;
  tone: 'teal' | 'blue' | 'violet' | 'amber';
};

export function OwnerHowItWorksSection() {
  const { t } = useTranslation();
  const steps: Step[] = [
    { n: '01', title: t('owner.howItWorks.steps.create.title'), line: t('owner.howItWorks.steps.create.line'), Icon: Warehouse, tone: 'teal' },
    { n: '02', title: t('owner.howItWorks.steps.setUp.title'), line: t('owner.howItWorks.steps.setUp.line'), Icon: Settings2, tone: 'blue' },
    { n: '03', title: t('owner.howItWorks.steps.addPeople.title'), line: t('owner.howItWorks.steps.addPeople.line'), Icon: UserPlus, tone: 'violet' },
    { n: '04', title: t('owner.howItWorks.steps.runDay.title'), line: t('owner.howItWorks.steps.runDay.line'), Icon: CalendarDays, tone: 'amber' },
  ];
  const pgFlow = Array.from({ length: 5 }, (_, i) => t(`home.howItWorks.flow.pg.${i}`));

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
          {t('home.howItWorks.title')}
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
