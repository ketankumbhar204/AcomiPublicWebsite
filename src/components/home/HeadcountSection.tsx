import { UtensilsCrossed } from 'lucide-react';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { SHOTS } from '../../data/shots';
import { IconBadge } from '../common/IconBadge';
import { DemoLabel } from '../common/DemoLabel';
import { PhoneMock } from '../common/PhoneMock';
import { ProgressBar } from '../product/MetricCard';
import { Container } from '../layout/Container';

const mealColors = ['bg-[#128C7E]', 'bg-[#D97706]', 'bg-[#7C3AED]'];
const locTones = ['bg-[#E7F6EE] text-[#0F6B4C]', 'bg-[#FFF1E0] text-[#D97706]', 'bg-[#E8F1FF] text-[#2563EB]'];
const menuTones = ['bg-[#E7F6EE] text-[#0F6B4C]', 'bg-[#FFF1E0] text-[#D97706]', 'bg-[#F1EBFF] text-[#6D28D9]'];

export function HeadcountSection() {
  const d = DEMO.mess.breakfastDetail;

  return (
    <section className="border-y border-border bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="headcount-heading">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-orange uppercase">Mess · Headcount</p>
            <h2
              id="headcount-heading"
              className="mt-2 text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.4rem]"
            >
              Know how many plates to prepare.
            </h2>
            <div className="mt-6 rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-md)]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <IconBadge icon={UtensilsCrossed} tone="amber" />
                  <p className="text-sm font-semibold text-navy">
                    {DEMO.mess.name} · {DEMO.mess.customers}
                  </p>
                </div>
                <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                  Today — {d.date}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <Tile n={d.expected} l="Expected" tone="bg-[#E8F1FF] text-[#1D4ED8]" />
                <Tile n={d.prepare} l="To prepare" tone="bg-[#FFF1E0] text-[#B45309]" />
                <Tile n={d.noResponse} l="No response" tone="bg-[#FFE8EE] text-[#BE123C]" />
              </div>

              <div className="mt-5 space-y-3">
                {DEMO.mess.meals.map((m, i) => (
                  <div key={m.name}>
                    <div className="mb-1.5 flex items-baseline justify-between text-sm">
                      <span className="font-medium text-navy">{m.name}</span>
                      <span className="font-semibold tabular-nums">
                        {m.prepare}
                        <span className="font-medium text-muted"> / {m.expected}</span>
                      </span>
                    </div>
                    <ProgressBar
                      segments={[{ pct: Math.round((m.prepare / m.expected) * 100), className: mealColors[i] }]}
                    />
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {d.locations.map((loc, i) => (
                  <Tile key={loc.name} n={loc.plates} l={loc.name} tone={locTones[i]} />
                ))}
              </div>

              <ul className="mt-5 space-y-2">
                {d.options.map((o, i) => (
                  <li
                    key={o.name}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold ${menuTones[i]}`}
                  >
                    <span>{o.name}</span>
                    <span className="tabular-nums">{o.count}</span>
                  </li>
                ))}
              </ul>
            </div>
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

function Tile({ n, l, tone }: { n: number; l: string; tone: string }) {
  return (
    <div className={`rounded-xl px-2 py-3 text-center ${tone}`}>
      <p className="text-lg font-semibold tabular-nums">{n}</p>
      <p className="text-[11px] opacity-80">{l}</p>
    </div>
  );
}
