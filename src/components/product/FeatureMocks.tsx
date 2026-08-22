import type { ReactNode } from 'react';
import { DEMO, DEMO_LABEL } from '../../data/demo';
import { DemoLabel } from '../common/DemoLabel';

export function OccupancyMock() {
  const { lodging } = DEMO;
  const b = lodging.beds;
  return (
    <Panel title="Occupancy" space={lodging.name}>
      <p className="text-2xl font-bold tabular-nums text-text">
        {b.occupied} / {b.total} <span className="text-sm font-medium text-muted">occupied</span>
      </p>
      <dl className="mt-3 grid grid-cols-3 gap-2">
        <Chip label="Occupied" value={b.occupied} />
        <Chip label="Vacant" value={b.vacant} />
        <Chip label="Reserved" value={b.reserved} />
      </dl>
      <ul className="mt-3 space-y-1.5">
        {lodging.members.map((m) => (
          <li key={m.name} className="flex justify-between rounded-lg bg-brand-50 px-2.5 py-2 text-sm">
            <span className="font-semibold text-text">{m.name}</span>
            <span className="text-muted">
              {m.room} · {m.bed}
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function MembersMock() {
  return (
    <Panel title="Members" space={DEMO.lodging.name}>
      <ul className="space-y-2">
        {DEMO.lodging.members.map((m) => (
          <li key={m.name} className="rounded-xl bg-brand-50 px-3 py-2.5">
            <p className="font-semibold text-text">{m.name}</p>
            <p className="text-xs text-muted">
              Tenant · {m.room} · {m.bed}
            </p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function DuesMock() {
  const d = DEMO.dues;
  return (
    <Panel title="Payment summary" space="This month">
      <dl className="grid grid-cols-2 gap-2">
        <Chip label="Expected" value={d.expected} />
        <Chip label="Collected" value={d.collected} />
        <Chip label="Under review" value={d.underReview} />
        <Chip label="Pending" value={d.pending} />
      </dl>
      <p className="mt-3 text-xs text-text-secondary">Proof → review → approve / reject / request update</p>
    </Panel>
  );
}

export function HeadcountMock() {
  return (
    <Panel title="Today's meal headcount" space={DEMO.mess.name} meal>
      <ul className="space-y-2.5">
        {DEMO.mess.meals.map((m) => (
          <li key={m.name}>
            <div className="flex justify-between text-sm">
              <span className="font-semibold">{m.name}</span>
              <span className="font-bold tabular-nums">
                {m.prepare} / {m.expected}
              </span>
            </div>
            <p className="text-[10px] text-muted">Meals to prepare / Expected</p>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-text-secondary">{DEMO.mess.noResponse} no response</p>
    </Panel>
  );
}

export function MealsMock() {
  const d = DEMO.mess.breakfastDetail;
  return (
    <Panel title="Breakfast menu" space={DEMO.mess.name} meal>
      <ul className="space-y-2">
        {d.options.map((o) => (
          <li key={o.name} className="flex justify-between rounded-lg bg-white/60 px-3 py-2 text-sm">
            <span>{o.name}</span>
            <span className="font-bold tabular-nums">{o.count}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export function ComplaintsMock() {
  const c = DEMO.complaints;
  return (
    <Panel title="Open issues" space="Today">
      <div className="space-y-2">
        <Issue title={c.lodging.title} meta={`${c.lodging.detail} · ${c.lodging.status}`} />
        <Issue title={c.mess.title} meta={`${c.mess.detail} · ${c.mess.status}`} />
      </div>
    </Panel>
  );
}

function Panel({
  title,
  space,
  children,
  meal,
}: {
  title: string;
  space: string;
  children: ReactNode;
  meal?: boolean;
}) {
  return (
    <div className={`w-full max-w-md rounded-2xl p-5 shadow-[0_16px_40px_rgba(11,28,22,0.08)] ring-1 ${meal ? 'bg-[#f4fafc] ring-[#c9e4ec]' : 'bg-white ring-border'}`}>
      <p className={`text-[10px] font-semibold tracking-[0.14em] uppercase ${meal ? 'text-meal' : 'text-primary'}`}>
        {space}
      </p>
      <h3 className="mt-1 text-lg font-bold text-text">{title}</h3>
      <div className="mt-4">{children}</div>
      <DemoLabel className="mt-4">{DEMO_LABEL}</DemoLabel>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg bg-brand-50 px-2.5 py-2">
      <p className="text-[10px] text-muted">{label}</p>
      <p className="text-sm font-bold tabular-nums text-text">{value}</p>
    </div>
  );
}

function Issue({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="rounded-xl bg-brand-50 px-3 py-2.5">
      <p className="text-sm font-semibold text-text">{title}</p>
      <p className="text-xs text-muted">{meta}</p>
    </div>
  );
}
