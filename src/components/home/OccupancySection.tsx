import { BedDouble } from 'lucide-react';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { SHOTS } from '../../data/shots';
import { DemoLabel } from '../common/DemoLabel';
import { PhoneMock } from '../common/PhoneMock';
import { MetricCard, ProgressBar } from '../product/MetricCard';
import { Container } from '../layout/Container';

export function OccupancySection() {
  const b = DEMO.lodging.beds;

  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="occupancy-heading">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">Occupancy</p>
            <h2 id="occupancy-heading" className="mt-2 text-[2rem] font-semibold tracking-tight text-text sm:text-[2.4rem]">
              Know who&apos;s staying.
            </h2>
            <div className="mt-8 rounded-2xl border border-black/5 bg-[#F3FAF6] p-6 shadow-[0_10px_28px_rgba(11,28,22,0.05)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <BedDouble className="h-4 w-4" />
                {DEMO.lodging.name}
              </div>
              <p className="mt-4 text-4xl font-semibold tracking-tight tabular-nums text-text">
                {b.occupied}
                <span className="text-xl text-muted"> / {b.total}</span>
              </p>
              <p className="mt-1 text-sm text-muted">occupied</p>
              <div className="mt-5">
                <ProgressBar
                  segments={[
                    { pct: DEMO.lodging.occupancyPct, className: 'bg-[#0F6B4C]' },
                    { pct: DEMO.lodging.vacantPct, className: 'bg-[#B8DCCB]' },
                    { pct: DEMO.lodging.reservedPct, className: 'bg-[#F59E0B]' },
                  ]}
                />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <MetricCard label="Occupied" value={b.occupied} tone="teal" />
                <MetricCard label="Vacant" value={b.vacant} tone="teal" />
                <MetricCard label="Reserved" value={b.reserved} tone="amber" />
              </div>
              <ul className="mt-5 divide-y divide-[#DCE8E2]">
                {DEMO.lodging.members.map((m) => (
                  <li key={m.name} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="font-medium text-text">{m.name}</span>
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
            <PhoneMock {...SHOTS.occupancy} size="lg" />
          </div>
        </div>
      </Container>
    </section>
  );
}
