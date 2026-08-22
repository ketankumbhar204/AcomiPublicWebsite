import { DEMO, DEMO_LABEL } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';
import { Reveal } from '../common/Reveal';
import { Container } from '../layout/Container';

const steps = ['Payment proof', 'Review', 'Approve / Reject / Request update'];

export function DuesSection() {
  const d = DEMO.dues;

  return (
    <section className="bg-white py-16 sm:py-24" aria-labelledby="dues-heading">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">Payments / dues</p>
            <h2 id="dues-heading" className="mt-3 text-3xl font-bold tracking-tight text-text sm:text-4xl">
              Keep dues and payment proofs in one place.
            </h2>
            <p className="mt-4 text-text-secondary">
              ACOMI records payments made outside the product and helps operators review proofs. It is not a payment
              gateway and does not collect UPI or cards.
            </p>
            <ol className="mt-6 flex flex-wrap items-center gap-2 text-sm font-semibold">
              {steps.map((s, i) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="rounded-lg bg-brand-50 px-3 py-1.5">{s}</span>
                  {i < steps.length - 1 ? <span className="text-muted" aria-hidden>→</span> : null}
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal delayMs={60}>
            <div className="rounded-3xl border border-border bg-brand-50 p-6 sm:p-8">
              <DemoLabel>{DEMO_LABEL}</DemoLabel>
              <dl className="mt-4 grid grid-cols-2 gap-3">
                <Money label="Expected" value={d.expected} />
                <Money label="Collected" value={d.collected} />
                <Money label="Under review" value={d.underReview} />
                <Money label="Pending" value={d.pending} />
              </dl>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Money({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-4 ring-1 ring-border">
      <dt className="text-[11px] text-muted">{label}</dt>
      <dd className="mt-1 text-xl font-bold tabular-nums text-text">{value}</dd>
    </div>
  );
}
