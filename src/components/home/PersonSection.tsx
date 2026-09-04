import { BedDouble, CalendarDays, ClipboardList, UserRound, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { SHOTS } from '../../data/shots';
import { DemoLabel } from '../common/DemoLabel';
import { PhoneMock } from '../common/PhoneMock';
import { Container } from '../layout/Container';

export function PersonSection() {
  const { t } = useTranslation();

  return (
    <section className="border-t border-border bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="people-heading">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-purple uppercase">
              {t('home.person.eyebrow')}
            </p>
            <h2
              id="people-heading"
              className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.4rem]"
            >
              {t('home.person.title')}
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <article className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-purple uppercase">
                  {t('home.person.messCustomers')}
                </p>
                <ul className="mt-4 space-y-3">
                  {DEMO.mess.customersList.map((c) => (
                    <li key={c.name} className="flex items-start gap-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EDE9FE] text-purple">
                        <UserRound className="h-4 w-4" aria-hidden />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-navy">{c.name}</span>
                        <span className="text-xs text-muted">
                          {t('home.person.breakfast')} {c.breakfast ? '✓' : '×'} · {t('home.person.lunch')}{' '}
                          {c.lunch ? '✓' : '×'} · {t('home.person.dinner')} {c.dinner ? '✓' : '×'}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
              <article className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
                  {t('home.person.pgTenants')}
                </p>
                <ul className="mt-4 space-y-3">
                  {DEMO.lodging.members.map((m) => (
                    <li key={m.name} className="flex items-start gap-3">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D8F3E3] text-primary">
                        <UserRound className="h-4 w-4" aria-hidden />
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-navy">{m.name}</span>
                        <span className="text-xs text-muted">
                          {m.room} · {m.bed}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MiniAction Icon={BedDouble} label={t('home.person.allocate')} tone="text-primary" />
              <MiniAction Icon={CalendarDays} label={t('home.person.reserve')} tone="text-primary" />
              <MiniAction Icon={UtensilsCrossed} label={t('home.person.menu')} tone="text-orange" />
              <MiniAction Icon={ClipboardList} label={t('home.person.poll')} tone="text-orange" />
            </div>
            <DemoLabel className="mt-4">{DEMO_LABEL}</DemoLabel>
          </div>
          <div className="flex justify-center lg:justify-end">
            <PhoneMock {...SHOTS.members} size="lg" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function MiniAction({
  Icon,
  label,
  tone,
}: {
  Icon: typeof BedDouble;
  label: string;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-black/5 bg-white px-3 py-2.5 text-xs font-semibold text-navy shadow-[var(--shadow-sm)]">
      <Icon className={`h-4 w-4 ${tone}`} aria-hidden />
      {label}
    </div>
  );
}
