import { DEMO, DEMO_LABEL } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';
import { Container } from '../layout/Container';

export function OwnerProblemSection() {
  const b = DEMO.lodging.beds;

  return (
    <section className="bg-[#F7F8FA] py-12 sm:py-14" aria-labelledby="owner-problem-heading">
      <Container>
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2
              id="owner-problem-heading"
              className="max-w-xl text-[1.7rem] leading-[1.15] font-semibold tracking-tight text-navy sm:text-[2.1rem]"
            >
              Still in notebooks, spreadsheets and WhatsApp.
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-text-secondary">
              Which beds are free? Who has paid? Which complaints are open? Across one property or
              several?
            </p>
          </div>

          <div>
            <article className="rounded-[24px] border border-black/5 bg-white p-6 shadow-[var(--shadow-sm)]">
              <p className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
                {DEMO.lodging.type}
              </p>
              <h3 className="mt-2 text-[1.35rem] font-semibold text-navy">Who&apos;s staying?</h3>
              <div className="mt-5 grid grid-cols-3 gap-2">
                <Stat n={b.occupied} l="Occupied" tone="bg-[#E7F6EE] text-[#0F6B4C]" />
                <Stat n={b.vacant} l="Vacant" tone="bg-[#E8F1FF] text-[#2563EB]" />
                <Stat n={b.reserved} l="Reserved" tone="bg-[#FFF1E0] text-[#D97706]" />
              </div>
              <ul className="mt-5 space-y-2">
                {DEMO.lodging.members.map((m) => (
                  <li key={m.name} className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-navy">{m.name}</span>
                    <span className="text-muted">
                      {m.room} · {m.bed}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
            <DemoLabel className="mt-4">{DEMO_LABEL}</DemoLabel>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Stat({ n, l, tone }: { n: number; l: string; tone: string }) {
  return (
    <div className={`rounded-xl px-2 py-3 text-center ${tone}`}>
      <p className="text-xl font-semibold tabular-nums">{n}</p>
      <p className="text-[11px] opacity-80">{l}</p>
    </div>
  );
}
