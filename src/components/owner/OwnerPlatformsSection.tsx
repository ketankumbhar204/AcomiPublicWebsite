import { Monitor, Smartphone } from 'lucide-react';
import { APP } from '../../constants/links';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';
import { IconBadge } from '../common/IconBadge';
import { BrowserChrome } from '../product/BrowserChrome';
import { Container } from '../layout/Container';

export function OwnerPlatformsSection() {
  return (
    <section
      className="border-t border-border bg-[#F7F8FA] py-12 sm:py-14"
      aria-labelledby="owner-platforms-heading"
    >
      <Container>
        <h2
          id="owner-platforms-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          Use ACOMI on the web or Android.
        </h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">
          The same product. Sign in with an Indian mobile number and password.
        </p>
        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:gap-12">
          <div className="grid gap-3">
            <article className="rounded-[20px] border border-black/5 bg-mint p-5 shadow-[var(--shadow-sm)]">
              <IconBadge icon={Monitor} tone="teal" />
              <h3 className="mt-3 text-lg font-semibold text-navy">Web</h3>
              <p className="mt-1 text-sm text-text-secondary">app.acomi.in</p>
              <a href={APP.web} className="mt-3 inline-block text-sm font-semibold text-primary">
                Open web app
              </a>
            </article>
            <article className="rounded-[20px] border border-black/5 bg-[#F4F8FF] p-5 shadow-[var(--shadow-sm)]">
              <IconBadge icon={Smartphone} tone="blue" />
              <h3 className="mt-3 text-lg font-semibold text-navy">Android</h3>
              <p className="mt-1 text-sm text-text-secondary">ACOMI Android app</p>
            </article>
          </div>
          <BrowserChrome url="app.acomi.in">
            <OwnerDashboardMock />
          </BrowserChrome>
        </div>
      </Container>
    </section>
  );
}

/*
 * The shared OperationsDashboard also carries a meal-headcount panel, which belongs
 * to a mess space. Modules are per space, so a lodging-only owner sees occupancy and
 * payments — same panels, same data, mess module omitted.
 */
function OwnerDashboardMock() {
  const { lodging, dues } = DEMO;
  const b = lodging.beds;

  return (
    <div className="overflow-hidden rounded-xl bg-[#F3FAF6] text-left">
      <div className="flex items-center justify-between border-b border-border/80 bg-white px-3 py-2.5 sm:px-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.14em] text-primary uppercase">
            Today&apos;s operations
          </p>
          <p className="truncate text-sm font-bold text-text">{lodging.name}</p>
        </div>
        <span className="rounded-full bg-soft px-2 py-0.5 text-[10px] font-semibold text-primary">
          Owner view
        </span>
      </div>

      <div className="space-y-3 p-3">
        <section className="rounded-xl bg-white p-3 ring-1 ring-border">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xs font-semibold text-text">Occupancy</h3>
            <p className="text-xs font-bold tabular-nums text-primary">
              {b.occupied} / {b.total} occupied
            </p>
          </div>
          <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-brand-50">
            <span className="bg-primary" style={{ width: `${lodging.occupancyPct}%` }} />
            <span className="bg-[#c7e8d6]" style={{ width: `${lodging.vacantPct}%` }} />
            <span className="bg-warning" style={{ width: `${lodging.reservedPct}%` }} />
          </div>
          <dl className="mt-2 grid grid-cols-3 gap-2 text-center">
            <Mini label="Occupied" value={b.occupied} hint={`${lodging.occupancyPct}%`} />
            <Mini label="Vacant" value={b.vacant} hint={`${lodging.vacantPct}%`} />
            <Mini label="Reserved" value={b.reserved} hint={`${lodging.reservedPct}%`} />
          </dl>
          <ul className="mt-3 space-y-1.5">
            {lodging.members.map((m) => (
              <li
                key={m.name}
                className="flex items-center justify-between gap-2 rounded-lg bg-brand-50 px-2 py-1.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-text">{m.name}</p>
                  <p className="text-[10px] text-muted">
                    {m.room} · {m.bed}
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-primary">{m.status}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl bg-white p-3 ring-1 ring-border">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xs font-semibold text-text">Payment summary</h3>
            <p className="text-[10px] text-muted">This month</p>
          </div>
          <dl className="mt-2 grid grid-cols-2 gap-2">
            <Pay label="Expected" value={dues.expected} />
            <Pay label="Collected" value={dues.collected} />
            <Pay label="Under review" value={dues.underReview} />
            <Pay label="Pending" value={dues.pending} />
          </dl>
        </section>
      </div>
      <DemoLabel className="px-4 pb-3">{DEMO_LABEL}</DemoLabel>
    </div>
  );
}

function Mini({ label, value, hint }: { label: string; value: number; hint: string }) {
  return (
    <div>
      <dt className="text-[10px] text-muted">{label}</dt>
      <dd className="text-sm font-bold tabular-nums text-text">
        {value} <span className="font-medium text-muted">{hint}</span>
      </dd>
    </div>
  );
}

function Pay({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-brand-50 px-2 py-1.5">
      <dt className="text-[10px] text-muted">{label}</dt>
      <dd className="text-sm font-bold tabular-nums text-text">{value}</dd>
    </div>
  );
}
