import { IndianRupee } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { SHOTS } from '../../data/shots';
import { IconBadge } from '../common/IconBadge';
import { DemoLabel } from '../common/DemoLabel';
import { PhoneMock } from '../common/PhoneMock';
import { ProgressBar } from '../product/MetricCard';
import { Container } from '../layout/Container';

export function PaymentsSection() {
  const { t } = useTranslation();
  const d = DEMO.dues;

  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="payments-heading">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-blue uppercase">
              {t('home.payments.eyebrow')}
            </p>
            <h2
              id="payments-heading"
              className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.4rem]"
            >
              {t('home.payments.title')}
            </h2>
            <div className="mt-6 rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-md)]">
              <div className="grid grid-cols-2 gap-3">
                <PayTile
                  iconTone="blue"
                  label={t('status.expected')}
                  value={d.expected}
                  tone="bg-[#E8F1FF] text-[#1D4ED8]"
                />
                <PayTile
                  iconTone="teal"
                  label={t('status.collected')}
                  value={d.collected}
                  tone="bg-[#E7F6EE] text-[#0F6B4C]"
                />
                <PayTile
                  iconTone="violet"
                  label={t('status.underReview')}
                  value={d.underReview}
                  tone="bg-[#F1EBFF] text-[#6D28D9]"
                />
                <PayTile
                  iconTone="amber"
                  label={t('status.pending')}
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
              <ul className="mt-5 space-y-2.5 text-sm">
                {d.rows.map((r) => (
                  <li key={r.name} className="flex justify-between">
                    <span className="text-navy">{r.name}</span>
                    <span className="font-semibold tabular-nums">{r.amount}</span>
                  </li>
                ))}
              </ul>
            </div>
            <DemoLabel className="mt-4">{DEMO_LABEL}</DemoLabel>
          </div>
          <div className="flex justify-center lg:justify-end">
            <PhoneMock {...SHOTS.payments} size="lg" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function PayTile({
  label,
  value,
  tone,
  iconTone,
}: {
  label: string;
  value: string;
  tone: string;
  iconTone: 'teal' | 'blue' | 'amber' | 'violet';
}) {
  return (
    <div className={`rounded-2xl px-4 py-4 ${tone}`}>
      <IconBadge icon={IndianRupee} tone={iconTone} size="sm" />
      <p className="mt-3 text-xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 text-xs font-medium opacity-80">{label}</p>
    </div>
  );
}
