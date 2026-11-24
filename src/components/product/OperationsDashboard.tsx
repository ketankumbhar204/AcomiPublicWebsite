import { useTranslation } from 'react-i18next';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';

type OperationsDashboardProps = {
  compact?: boolean;
};

export function OperationsDashboard({ compact = false }: OperationsDashboardProps) {
  const { t } = useTranslation();
  const { lodging, mess, dues } = DEMO;
  const b = lodging.beds;

  return (
    <div className="overflow-hidden rounded-xl bg-[#F3FAF6] text-left">
      <div className="flex items-center justify-between border-b border-border/80 bg-white px-3 py-2.5 sm:px-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-primary uppercase">{t('product.ops.todaysOperations')}</p>
          <p className="truncate text-sm font-bold text-text">{lodging.name}</p>
        </div>
        <span className="rounded-full bg-soft px-2 py-0.5 text-[10px] font-semibold text-primary">{t('product.ops.ownerView')}</span>
      </div>

      <div className={`space-y-3 ${compact ? 'p-3' : 'p-3 sm:p-4'}`}>
        <section className="rounded-xl bg-white p-3 ring-1 ring-border">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xs font-semibold text-text">{t('product.ops.occupancy')}</h3>
            <p className="text-xs font-bold tabular-nums text-primary">
              {t('product.ops.occupiedOf', { occupied: b.occupied, total: b.total })}
            </p>
          </div>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-brand-50">
            <span className="bg-primary" style={{ width: `${lodging.occupancyPct}%` }} />
            <span className="bg-[#c7e8d6]" style={{ width: `${lodging.vacantPct}%` }} />
            <span className="bg-warning" style={{ width: `${lodging.reservedPct}%` }} />
          </div>
          <dl className="mt-2 grid grid-cols-3 gap-2 text-center">
            <Mini label={t('status.occupied')} value={b.occupied} hint={`${lodging.occupancyPct}%`} />
            <Mini label={t('status.vacant')} value={b.vacant} hint={`${lodging.vacantPct}%`} />
            <Mini label={t('status.reserved')} value={b.reserved} hint={`${lodging.reservedPct}%`} />
          </dl>
          {compact ? null : (
            <ul className="mt-3 space-y-1.5">
              {lodging.members.map((m) => (
                <li key={m.name} className="flex items-center justify-between gap-2 rounded-lg bg-brand-50 px-2 py-1.5">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-text">{m.name}</p>
                    <p className="text-[10px] text-muted">
                      {m.room} · {m.bed}
                    </p>
                  </div>
                  <span className="text-[10px] font-semibold text-primary">{m.status}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl bg-white p-3 ring-1 ring-border">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xs font-semibold text-text">{t('product.ops.paymentSummary')}</h3>
            <p className="text-[10px] text-muted">{t('product.ops.thisMonth')}</p>
          </div>
          <dl className="mt-2 grid grid-cols-2 gap-2">
            <Pay label={t('status.expected')} value={dues.expected} />
            <Pay label={t('status.collected')} value={dues.collected} />
            <Pay label={t('status.underReview')} value={dues.underReview} />
            <Pay label={t('status.pending')} value={dues.pending} />
          </dl>
        </section>

        <section className="rounded-xl bg-[#f4fafc] p-3 ring-1 ring-[#c9e4ec]">
          <h3 className="text-xs font-semibold text-text">{t('product.ops.todaysMealHeadcount')}</h3>
          <ul className="mt-2 space-y-2">
            {mess.meals.map((m) => (
              <li key={m.name}>
                <div className="flex items-end justify-between">
                  <span className="text-xs font-semibold text-text">{m.name}</span>
                  <span className="text-xs font-bold tabular-nums text-text">
                    {m.prepare} <span className="font-medium text-muted">/ {m.expected}</span>
                  </span>
                </div>
                <p className="text-[10px] text-muted">{t('product.ops.mealsPrepareExpected')}</p>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white">
                  <div
                    className="bar-fill h-full rounded-full bg-meal"
                    style={{ width: `${Math.round((m.prepare / m.expected) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-text-secondary">{t('product.ops.noResponseCount', { count: mess.noResponse })}</p>
        </section>
      </div>
      <DemoLabel className="px-4 pb-3">{DEMO_LABEL}</DemoLabel>
    </div>
  );
}

export function MessOperationsCard() {
  const { t } = useTranslation();
  const { mess } = DEMO;

  return (
    <article className="rounded-2xl border border-[#c9e4ec] bg-[#0b5f7a] p-4 text-white shadow-[0_18px_40px_rgba(11,95,122,0.28)]">
      <p className="text-[10px] font-semibold tracking-[0.16em] text-[#b8e6f3] uppercase">{t('product.ops.mealOperations')}</p>
      <h3 className="mt-1 text-base font-bold">{mess.name}</h3>
      <p className="mt-2 text-sm text-white/80">
        {t('product.ops.customers')} <span className="font-bold tabular-nums text-white">{mess.customers}</span>
      </p>
      <p className="mt-3 text-[11px] font-semibold text-[#b8e6f3]">{t('product.ops.todaysHeadcount')}</p>
      <ul className="mt-1.5 space-y-1 text-sm">
        {mess.meals.map((m) => (
          <li key={m.name} className="flex justify-between">
            <span>{m.name}</span>
            <span className="font-bold tabular-nums">{m.prepare}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-white/75">
        {mess.poll} · {t('product.ops.noResponseCount', { count: mess.noResponse })}
      </p>
      <p className="mt-2 text-[10px] text-white/50">{t('product.ops.noBuildingsHint')}</p>
    </article>
  );
}

function Mini({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div>
      <dt className="text-[10px] text-muted">{label}</dt>
      <dd className="text-sm font-bold tabular-nums text-text">
        {value} <span className="font-medium text-muted">{hint}</span>
      </dd>
    </div>
  );
}

function Pay({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-brand-50 px-2 py-1.5">
      <dt className="text-[10px] text-muted">{label}</dt>
      <dd className="text-sm font-bold tabular-nums text-text">{value}</dd>
    </div>
  );
}
