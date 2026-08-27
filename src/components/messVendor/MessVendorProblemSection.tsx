import { DEMO, DEMO_LABEL } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';
import { ProgressBar } from '../product/MetricCard';
import { Container } from '../layout/Container';

const mealColors = ['bg-[#128C7E]', 'bg-[#D97706]', 'bg-[#7C3AED]'];
const locTones = [
  'bg-[#E7F6EE] text-[#0F6B4C]',
  'bg-[#FFF1E0] text-[#D97706]',
  'bg-[#E8F1FF] text-[#2563EB]',
];

export function MessVendorProblemSection() {
  const d = DEMO.mess.breakfastDetail;

  return (
    <section className="bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="mess-problem-heading">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2
              id="mess-problem-heading"
              className="max-w-xl text-[1.7rem] leading-[1.15] font-semibold tracking-tight text-navy sm:text-[2.1rem]"
            >
              Still in notebooks, spreadsheets and WhatsApp.
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-text-secondary">
              How many plates for lunch? Who has not responded? What is on today&apos;s menu?
            </p>
          </div>

          <div>
            <article className="rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-orange uppercase">
                {DEMO.mess.type}
              </p>
              <h3 className="mt-2 text-[1.35rem] font-semibold text-navy">How many plates?</h3>
              <ul className="mt-5 space-y-3">
                {DEMO.mess.meals.map((m, i) => (
                  <li key={m.name}>
                    <div className="mb-1 flex items-baseline justify-between text-sm">
                      <span className="font-medium text-navy">{m.name}</span>
                      <span className="font-semibold tabular-nums">
                        {m.prepare} <span className="font-medium text-muted">/ {m.expected}</span>
                      </span>
                    </div>
                    <ProgressBar
                      segments={[
                        {
                          pct: Math.round((m.prepare / m.expected) * 100),
                          className: mealColors[i],
                        },
                      ]}
                    />
                  </li>
                ))}
              </ul>
              <div className="mt-5 grid grid-cols-3 gap-2">
                {d.locations.map((loc, i) => (
                  <div key={loc.name} className={`rounded-xl px-2 py-3 text-center ${locTones[i]}`}>
                    <p className="text-lg font-semibold tabular-nums">{loc.plates}</p>
                    <p className="text-[11px] opacity-80">{loc.name}</p>
                  </div>
                ))}
              </div>
            </article>
            <DemoLabel className="mt-4">{DEMO_LABEL}</DemoLabel>
          </div>
        </div>
      </Container>
    </section>
  );
}
