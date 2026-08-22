import { DEMO, DEMO_LABEL } from '../../data/demo';
import { SHOTS } from '../../data/shots';
import { DemoLabel } from '../common/DemoLabel';
import { PhoneMock } from '../common/PhoneMock';
import { Container } from '../layout/Container';

export function MessSection() {
  return (
    <section className="border-t border-border bg-[#F7FBF9] py-16 sm:py-20" aria-labelledby="mess-heading">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">Mess</p>
            <h2 id="mess-heading" className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Know how many people are eating.
            </h2>
            <p className="mt-6 text-5xl font-bold tabular-nums text-text">{DEMO.mess.customers}</p>
            <p className="mt-1 text-sm text-muted">Customers</p>
            <ul className="mt-6 max-w-xs space-y-2">
              {DEMO.mess.meals.map((m) => (
                <li key={m.name} className="flex items-baseline justify-between">
                  <span className="text-sm text-text">{m.name}</span>
                  <span className="text-xl font-bold tabular-nums text-text">
                    {m.prepare}
                    <span className="text-sm font-medium text-muted"> / {m.expected}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-text-secondary">Prepare the right quantity every day.</p>
            <DemoLabel className="mt-4">{DEMO_LABEL}</DemoLabel>
          </div>
          <div className="flex justify-center lg:justify-end">
            <PhoneMock {...SHOTS.mess} size="lg" />
          </div>
        </div>
      </Container>
    </section>
  );
}
