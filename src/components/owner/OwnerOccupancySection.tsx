import { BedDouble } from 'lucide-react';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { SHOTS } from '../../data/shots';
import { DemoLabel } from '../common/DemoLabel';
import { PhoneMock } from '../common/PhoneMock';
import { MetricCard, ProgressBar } from '../product/MetricCard';
import { Container } from '../layout/Container';

export function OwnerOccupancySection() {
  const { lodging } = DEMO;
  const b = lodging.beds;

  return (
    <section
      className="border-t border-border bg-[#F7F8FA] py-12 sm:py-14"
      aria-labelledby="owner-occupancy-heading"
    >
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
              Occupancy
            </p>
            <h2
              id="owner-occupancy-heading"
              className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.4rem]"
            >
              Know who&apos;s staying.
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">
              Buildings, floors, rooms and beds. Occupied, vacant and reserved. Allocate, reserve,
              move in, transfer, vacate.
            </p>

            <div className="mt-6 rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-md)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <BedDouble className="h-4 w-4" aria-hidden />
                {lodging.name}
              </div>
              <p className="mt-4 text-4xl font-semibold tracking-tight tabular-nums text-navy">
                {b.occupied}
                <span className="text-xl text-muted"> / {b.total}</span>
              </p>
              <p className="mt-1 text-sm text-muted">occupied</p>
              <div className="mt-5">
                <ProgressBar
                  segments={[
                    { pct: lodging.occupancyPct, className: 'bg-[#0F6B4C]' },
                    { pct: lodging.vacantPct, className: 'bg-[#B8DCCB]' },
                    { pct: lodging.reservedPct, className: 'bg-[#F59E0B]' },
                  ]}
                />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <MetricCard label="Occupied" value={b.occupied} tone="teal" />
                <MetricCard label="Vacant" value={b.vacant} tone="blue" />
                <MetricCard label="Reserved" value={b.reserved} tone="amber" />
              </div>
              <ul className="mt-5 divide-y divide-border">
                {lodging.members.map((m) => (
                  <li key={m.name} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <span className="font-medium text-navy">{m.name}</span>
                    <span className="text-muted">
                      {m.room} · {m.bed}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <DemoLabel className="mt-4">{DEMO_LABEL}</DemoLabel>
          </div>

          <div className="flex justify-center lg:justify-end">
            <PhoneMock {...SHOTS.occupancy} caption="Occupancy" size="lg" />
          </div>
        </div>
      </Container>
    </section>
  );
}
