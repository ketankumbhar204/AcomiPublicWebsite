import { DEMO, DEMO_LABEL } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';

type OperationsDashboardProps = {
  compact?: boolean;
};

export function OperationsDashboard({ compact = false }: OperationsDashboardProps) {
  const { lodging, mess, dues } = DEMO;
  const b = lodging.beds;

  return (
    <div className="overflow-hidden rounded-xl bg-[#F3FAF6] text-left">
      <div className="flex items-center justify-between border-b border-border/80 bg-white px-3 py-2.5 sm:px-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-primary uppercase">Today&apos;s operations</p>
          <p className="truncate text-sm font-bold text-text">{lodging.name}</p>
        </div>
        <span className="rounded-full bg-soft px-2 py-0.5 text-[10px] font-semibold text-primary">Owner view</span>
      </div>

      <div className={`space-y-3 ${compact ? 'p-3' : 'p-3 sm:p-4'}`}>
        <section className="rounded-xl bg-white p-3 ring-1 ring-border">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xs font-semibold text-text">Occupancy</h3>
            <p className="text-xs font-bold tabular-nums text-primary">
              {b.occupied} / {b.total} occupied
            </p>
          </div>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-brand-50">
            <span className="bg-primary" style={{ width: `${lodging.occupancyPct}%` }} />
            <span className="bg-[#c7e8d6]" style={{ width: `${lodging.vacantPct}%` }} />
            <span className="bg-warning" style={{ width: `${lodging.reservedPct}%` }} />
          </div>
          <dl className="mt-2 grid grid-cols-3 gap-2 text-center">
            <Mini label="Occupied" value={b.occupied} hint={`${lodging.occupancyPct}%`} />
            <Mini label="Vacant" value={b.vacant} hint={`${lodging.vacantPct}%`} />
            <Mini label="Reserved" value={b.reserved} hint={`${lodging.reservedPct}%`} />
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
            <h3 className="text-xs font-semibold text-text">Payment summary</h3>
            <p className="text-[10px] text-muted">This month</p>
          </div>
          <dl className="mt-2 grid grid-cols-2 gap-2">
            <Pay label="Expected" value={dues.expected} />
            <Pay label="Collected" value={dues.collected} />
            <Pay label="Under review" value={dues.underReview} />
            <Pay label="Pending" value={dues.pending} />
          </dl>
        </section>

        <section className="rounded-xl bg-[#f4fafc] p-3 ring-1 ring-[#c9e4ec]">
          <h3 className="text-xs font-semibold text-text">Today&apos;s meal headcount</h3>
          <ul className="mt-2 space-y-2">
            {mess.meals.map((m) => (
              <li key={m.name}>
                <div className="flex items-end justify-between">
                  <span className="text-xs font-semibold text-text">{m.name}</span>
                  <span className="text-xs font-bold tabular-nums text-text">
                    {m.prepare} <span className="font-medium text-muted">/ {m.expected}</span>
                  </span>
                </div>
                <p className="text-[10px] text-muted">Meals to prepare / Expected</p>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white">
                  <div
                    className="bar-fill h-full rounded-full bg-meal"
                    style={{ width: `${Math.round((m.prepare / m.expected) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] text-text-secondary">{mess.noResponse} no response</p>
        </section>
      </div>
      <DemoLabel className="px-4 pb-3">{DEMO_LABEL}</DemoLabel>
    </div>
  );
}

export function MessOperationsCard() {
  const { mess } = DEMO;

  return (
    <article className="rounded-2xl border border-[#c9e4ec] bg-[#0b5f7a] p-4 text-white shadow-[0_18px_40px_rgba(11,95,122,0.28)]">
      <p className="text-[10px] font-semibold tracking-[0.16em] text-[#b8e6f3] uppercase">Meal operations</p>
      <h3 className="mt-1 text-base font-bold">{mess.name}</h3>
      <p className="mt-2 text-sm text-white/80">
        Customers <span className="font-bold tabular-nums text-white">{mess.customers}</span>
      </p>
      <p className="mt-3 text-[11px] font-semibold text-[#b8e6f3]">Today&apos;s headcount</p>
      <ul className="mt-1.5 space-y-1 text-sm">
        {mess.meals.map((m) => (
          <li key={m.name} className="flex justify-between">
            <span>{m.name}</span>
            <span className="font-bold tabular-nums">{m.prepare}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-white/75">
        {mess.poll} · {mess.noResponse} no response
      </p>
      <p className="mt-2 text-[10px] text-white/50">No buildings, rooms, or beds — customers and plates.</p>
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
