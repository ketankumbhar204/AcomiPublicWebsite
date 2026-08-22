import { DEMO, DEMO_LABEL } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';

export function DayDashboard() {
  const { lodging, mess, dues } = DEMO;
  const b = lodging.beds;

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between border-b border-[#e6eee9] px-5 py-3.5">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] text-primary uppercase">Today</p>
          <p className="text-sm font-semibold text-text">Sunrise operations</p>
        </div>
        <span className="text-[10px] font-semibold text-muted">Owner view</span>
      </div>

      <div className="grid divide-y divide-[#e6eee9] lg:grid-cols-[1.1fr_0.9fr] lg:divide-x lg:divide-y-0">
        <div className="p-5 sm:p-6">
          <p className="text-[11px] font-semibold text-muted">Occupancy · {lodging.name}</p>
          <p className="mt-2 text-4xl font-bold tracking-tight tabular-nums text-text">
            {b.occupied}
            <span className="text-xl font-semibold text-muted"> / {b.total}</span>
          </p>
          <p className="mt-1 text-sm text-text-secondary">occupied</p>
          <div className="mt-4 flex h-1.5 overflow-hidden rounded-full bg-[#eef5f1]">
            <span className="bg-primary" style={{ width: `${lodging.occupancyPct}%` }} />
            <span className="bg-[#b8dccb]" style={{ width: `${lodging.vacantPct}%` }} />
            <span className="bg-warning" style={{ width: `${lodging.reservedPct}%` }} />
          </div>
          <p className="mt-3 text-xs text-muted">
            Occupied {b.occupied} · Vacant {b.vacant} · Reserved {b.reserved}
          </p>
          <ul className="mt-5 space-y-2.5 border-t border-[#e6eee9] pt-4">
            {lodging.members.map((m) => (
              <li key={m.name} className="flex justify-between gap-3 text-sm">
                <span className="font-medium text-text">{m.name}</span>
                <span className="text-muted">
                  {m.room} · {m.bed}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 sm:p-6">
          <p className="text-[11px] font-semibold text-muted">Meal headcount · {mess.name}</p>
          <ul className="mt-4 space-y-3.5">
            {mess.meals.map((m) => (
              <li key={m.name}>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-text">{m.name}</span>
                  <span className="text-lg font-bold tabular-nums text-text">
                    {m.prepare}
                    <span className="text-sm font-medium text-muted"> / {m.expected}</span>
                  </span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-[#eef5f1]">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${Math.round((m.prepare / m.expected) * 100)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted">Meals to prepare / Expected</p>
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-[#e6eee9] sm:grid-cols-4">
        <Due label="Expected" value={dues.expected} />
        <Due label="Collected" value={dues.collected} />
        <Due label="Under review" value={dues.underReview} />
        <Due label="Pending" value={dues.pending} />
      </div>
      <DemoLabel className="px-5 py-2.5">{DEMO_LABEL}</DemoLabel>
    </div>
  );
}

function Due({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-[#e6eee9] px-4 py-3.5 not-first:border-l">
      <p className="text-[10px] text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-bold tabular-nums text-text sm:text-base">{value}</p>
    </div>
  );
}
