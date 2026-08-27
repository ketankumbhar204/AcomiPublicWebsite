import { CircleAlert, Package, UserRound, Users } from 'lucide-react';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';
import { IconBadge } from '../common/IconBadge';
import { Container } from '../layout/Container';

const roles = ['Owner', 'Manager', 'Customer', 'Staff'];

const pipeline = [
  { label: 'Open', cls: 'bg-[#FFF1F2] text-[#BE123C]' },
  { label: 'In progress', cls: 'bg-[#FFF8F1] text-[#B45309]' },
  { label: 'Resolved', cls: 'bg-mint text-primary' },
];

export function MessVendorOperationsSection() {
  const issue = DEMO.complaints.mess;

  return (
    <section
      className="border-t border-border bg-[#F7F8FA] py-12 sm:py-14"
      aria-labelledby="mess-operations-heading"
    >
      <Container>
        <h2
          id="mess-operations-heading"
          className="text-[2rem] leading-[1.1] font-semibold tracking-tight text-navy sm:text-[2.25rem]"
        >
          Run the kitchen day.
        </h2>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-text-secondary">
          Customers and roles. Open issues. Stock on hand.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <article className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-2.5">
              <IconBadge icon={Users} tone="amber" size="sm" />
              <h3 className="text-sm font-semibold text-navy">Customers</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {DEMO.mess.customersList.map((c) => (
                <li key={c.name} className="flex items-start gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF1E0] text-orange">
                    <UserRound className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-navy">{c.name}</span>
                    <span className="text-xs text-muted">
                      {c.breakfast ? 'Breakfast' : '—'} · {c.lunch ? 'Lunch' : '—'} ·{' '}
                      {c.dinner ? 'Dinner' : '—'}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {roles.map((r) => (
                <li
                  key={r}
                  className="rounded-full bg-[#FFF1E0] px-2.5 py-0.5 text-[11px] font-semibold text-orange"
                >
                  {r}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-2.5">
              <IconBadge icon={CircleAlert} tone="coral" size="sm" />
              <h3 className="text-sm font-semibold text-navy">Complaints</h3>
            </div>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {pipeline.map((s) => (
                <li
                  key={s.label}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${s.cls}`}
                >
                  {s.label}
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-2xl bg-[#F8FBFA] px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy">{issue.title}</p>
                  <p className="mt-0.5 text-xs text-muted">{issue.detail}</p>
                </div>
                <span className="shrink-0 rounded-full bg-[#FFF1F2] px-2.5 py-0.5 text-[11px] font-semibold text-[#BE123C]">
                  {issue.status}
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs text-text-secondary">
              Food quality and service issues — with comments.
            </p>
          </article>

          <article className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-2.5">
              <IconBadge icon={Package} tone="violet" size="sm" />
              <h3 className="text-sm font-semibold text-navy">Inventory</h3>
            </div>
            <ul className="mt-4 space-y-2">
              {DEMO.inventory.mess.map((r) => (
                <li
                  key={r.name}
                  className="flex items-center justify-between gap-3 rounded-xl bg-[#F8FBFA] px-3 py-2 text-sm"
                >
                  <span className="font-medium text-navy">{r.name}</span>
                  <span className={r.status === 'Low' ? 'text-orange' : 'text-muted'}>{r.status}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-text-secondary">Kitchen stock for the mess.</p>
          </article>
        </div>
        <DemoLabel className="mt-4">{DEMO_LABEL}</DemoLabel>
      </Container>
    </section>
  );
}
