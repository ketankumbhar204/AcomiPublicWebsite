import { IndianRupee } from 'lucide-react';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { SHOTS } from '../../data/shots';
import { DemoLabel } from '../common/DemoLabel';
import { IconBadge } from '../common/IconBadge';
import { PhoneMock } from '../common/PhoneMock';
import { ProgressBar } from '../product/MetricCard';
import { Container } from '../layout/Container';

const steps = ['Proof', 'Review', 'Approve / Reject / Request update'];

export function MessVendorPaymentsSection() {
  const d = DEMO.dues;
  const meal = DEMO.share.mealPayment;

  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="mess-payments-heading">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-blue uppercase">
              Meal dues
            </p>
            <h2
              id="mess-payments-heading"
              className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.4rem]"
            >
              Know what&apos;s due.
            </h2>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">
              ACOMI records payments made outside the product and helps operators review proofs. It
              is not a payment gateway and does not collect UPI or cards.
            </p>

            <ol className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-navy">
              {steps.map((s, i) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="rounded-lg bg-brand-50 px-3 py-1.5 ring-1 ring-border">{s}</span>
                  {i < steps.length - 1 ? (
                    <span className="text-muted" aria-hidden>
                      →
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>

            <div className="mt-6 rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-md)]">
              <div className="grid grid-cols-2 gap-3">
                <PayTile
                  iconTone="blue"
                  label="Expected"
                  value={d.expected}
                  tone="bg-[#E8F1FF] text-[#1D4ED8]"
                />
                <PayTile
                  iconTone="teal"
                  label="Collected"
                  value={d.collected}
                  tone="bg-[#E7F6EE] text-[#0F6B4C]"
                />
                <PayTile
                  iconTone="violet"
                  label="Under review"
                  value={d.underReview}
                  tone="bg-[#F1EBFF] text-[#6D28D9]"
                />
                <PayTile
                  iconTone="amber"
                  label="Pending"
                  value={d.pending}
                  tone="bg-[#FFF1E0] text-[#B45309]"
                />
              </div>
              <div className="mt-5">
                <ProgressBar
                  segments={[
                    { pct: d.collectedPct, className: 'bg-[#2563EB]' },
                    { pct: 100 - d.collectedPct, className: 'bg-[#BFDBFE]' },
                  ]}
                />
              </div>
              <div className="mt-5 rounded-xl bg-[#FFF8F1] px-3 py-3">
                <p className="text-xs text-muted">
                  {meal.place} · {meal.month}
                </p>
                <p className="mt-1 text-sm font-semibold text-navy">{meal.name}</p>
                <p className="mt-1 text-sm font-semibold tabular-nums text-orange">
                  Meal payment pending {meal.amount}
                </p>
              </div>
            </div>
            <DemoLabel className="mt-4">{DEMO_LABEL}</DemoLabel>
          </div>
          <div className="flex justify-center lg:justify-end">
            <PhoneMock {...SHOTS.messPayments} size="lg" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function PayTile({
  iconTone,
  label,
  value,
  tone,
}: {
  iconTone: 'teal' | 'blue' | 'amber' | 'violet';
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className={`rounded-xl px-3 py-3 ${tone}`}>
      <IconBadge icon={IndianRupee} tone={iconTone} size="sm" />
      <p className="mt-2 text-lg font-semibold tabular-nums">{value}</p>
      <p className="text-[11px] opacity-80">{label}</p>
    </div>
  );
}
