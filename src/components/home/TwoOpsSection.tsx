import { DEMO, DEMO_LABEL } from '../../data/demo';
import { SHOTS } from '../../data/shots';
import { DemoLabel } from '../common/DemoLabel';
import { PhoneMock } from '../common/PhoneMock';
import { Container } from '../layout/Container';

export function TwoOpsSection() {
  const b = DEMO.lodging.beds;

  return (
    <section className="border-t border-border bg-[#F7FBF9] py-20 sm:py-24" aria-labelledby="ops-heading">
      <Container>
        <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
          One platform. Two operations.
        </p>
        <h2 id="ops-heading" className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
          One owner. Two operations.
        </h2>
        <p className="mt-3 max-w-xl text-text-secondary">
          Run accommodation and meal operations from the same ACOMI account.
        </p>

        <div className="mt-14 grid items-center gap-16 lg:grid-cols-2">
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
            <PhoneMock {...SHOTS.occupancy} size="md" />
            <div className="sm:pt-6">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">
                PG · Hostel · Co-living · Rental
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-text">
                Know who is staying where.
              </h3>
              <p className="mt-5 text-4xl font-bold tabular-nums text-text">
                {b.occupied}
                <span className="text-xl font-semibold text-muted"> / {b.total}</span>
              </p>
              <p className="mt-2 text-sm text-muted">
                {b.occupied} occupied · {b.vacant} vacant · {b.reserved} reserved
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
            <PhoneMock {...SHOTS.meals} size="md" />
            <div className="sm:pt-6">
              <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">Mess</p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-text">
                Know how many people are eating.
              </h3>
              <ul className="mt-5 space-y-2">
                {DEMO.mess.meals.map((m) => (
                  <li key={m.name} className="flex items-baseline justify-between gap-6 text-sm">
                    <span className="text-text">{m.name}</span>
                    <span className="text-xl font-bold tabular-nums text-text">
                      {m.prepare}
                      <span className="text-sm font-medium text-muted"> / {m.expected}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <DemoLabel className="mt-10">{DEMO_LABEL}</DemoLabel>
      </Container>
    </section>
  );
}
