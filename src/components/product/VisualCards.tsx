import { BedDouble, IndianRupee, Users, UtensilsCrossed } from 'lucide-react';
import { DEMO } from '../../data/demo';
import { IconBadge } from '../common/IconBadge';
import { ProgressBar } from './MetricCard';

const mealColors = ['bg-[#128C7E]', 'bg-[#D97706]', 'bg-[#7C3AED]'];
const locTones = ['bg-[#E7F6EE] text-[#0F6B4C]', 'bg-[#FFF1E0] text-[#D97706]', 'bg-[#E8F1FF] text-[#2563EB]'];

export function OccupancyCard() {
  const b = DEMO.lodging.beds;

  return (
    <article className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-2">
        <IconBadge icon={BedDouble} tone="teal" />
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-primary uppercase">Occupancy</p>
          <p className="text-sm font-semibold text-navy">Know who&apos;s staying</p>
        </div>
      </div>
      <div className="mt-5 flex items-center gap-5">
        <OccupancyDonut occupied={b.occupied} total={b.total} />
        <div className="grid flex-1 grid-cols-3 gap-2">
          <Mini n={b.occupied} l="Occupied" tone="bg-[#E7F6EE] text-[#0F6B4C]" />
          <Mini n={b.vacant} l="Vacant" tone="bg-[#E8F1FF] text-[#2563EB]" />
          <Mini n={b.reserved} l="Reserved" tone="bg-[#FFF1E0] text-[#D97706]" />
        </div>
      </div>
    </article>
  );
}

export function MealHeadcountCard() {
  const d = DEMO.mess.breakfastDetail;

  return (
    <article className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-2">
        <IconBadge icon={UtensilsCrossed} tone="amber" />
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-orange uppercase">Meals + Headcount</p>
          <p className="text-sm font-semibold text-navy">Know how many plates</p>
        </div>
      </div>
      <ul className="mt-5 space-y-2.5">
        {DEMO.mess.meals.map((m, i) => (
          <li key={m.name}>
            <div className="mb-1 flex items-baseline justify-between text-xs">
              <span className="font-medium text-text">{m.name}</span>
              <span className="font-semibold tabular-nums text-navy">
                {m.prepare} <span className="font-medium text-muted">/ {m.expected}</span>
              </span>
            </div>
            <ProgressBar
              segments={[{ pct: Math.round((m.prepare / m.expected) * 100), className: mealColors[i] }]}
            />
          </li>
        ))}
      </ul>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {d.locations.map((loc, i) => (
          <div key={loc.name} className={`rounded-xl px-2 py-2 text-center ${locTones[i]}`}>
            <p className="text-sm font-semibold tabular-nums">{loc.plates}</p>
            <p className="text-[10px] opacity-80">{loc.name}</p>
          </div>
        ))}
      </div>
    </article>
  );
}

export function PaymentSummaryCard() {
  const d = DEMO.dues;

  return (
    <article className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-2">
        <IconBadge icon={IndianRupee} tone="blue" />
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-blue uppercase">Payments</p>
          <p className="text-sm font-semibold text-navy">Know what&apos;s due</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <PayTile label="Expected" value={d.expected} tone="bg-[#E8F1FF] text-[#1D4ED8]" />
        <PayTile label="Collected" value={d.collected} tone="bg-[#E7F6EE] text-[#0F6B4C]" />
        <PayTile label="Review" value={d.underReview} tone="bg-[#F1EBFF] text-[#6D28D9]" />
        <PayTile label="Pending" value={d.pending} tone="bg-[#FFF1E0] text-[#B45309]" />
      </div>
    </article>
  );
}

export function PeopleCard() {
  const people = [
    { initials: 'RS', tone: 'bg-[#E7F6EE] text-primary' },
    { initials: 'AP', tone: 'bg-[#E8F1FF] text-blue' },
    { initials: 'SJ', tone: 'bg-[#F1EBFF] text-purple' },
  ];

  return (
    <article className="rounded-[20px] border border-black/5 bg-white p-5 shadow-[var(--shadow-sm)]">
      <div className="flex items-center gap-2">
        <IconBadge icon={Users} tone="violet" />
        <div>
          <p className="text-[11px] font-semibold tracking-[0.14em] text-purple uppercase">People</p>
          <p className="text-sm font-semibold text-navy">Tenants + Customers</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Mini n={DEMO.lodging.beds.occupied} l="PG residents" tone="bg-[#E7F6EE] text-[#0F6B4C]" />
        <Mini n={DEMO.mess.customers} l="MESS customers" tone="bg-[#F1EBFF] text-[#6D28D9]" />
      </div>
      <div className="mt-4 flex items-center gap-2">
        {people.map((p) => (
          <span
            key={p.initials}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold ${p.tone}`}
          >
            {p.initials}
          </span>
        ))}
      </div>
    </article>
  );
}

function OccupancyDonut({ occupied, total }: { occupied: number; total: number }) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const pct = occupied / total;

  return (
    <svg viewBox="0 0 72 72" className="h-[72px] w-[72px] shrink-0" aria-hidden>
      <circle cx="36" cy="36" r={r} fill="none" stroke="#E8F0EC" strokeWidth="8" />
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke="#0F6B4C"
        strokeWidth="8"
        strokeDasharray={`${c * pct} ${c}`}
        strokeLinecap="round"
        transform="rotate(-90 36 36)"
      />
      <text x="36" y="38" textAnchor="middle" fontSize="13" fontWeight="700" fill="#0F6B4C">
        {occupied}
      </text>
    </svg>
  );
}

function Mini({ n, l, tone }: { n: number; l: string; tone: string }) {
  return (
    <div className={`rounded-xl px-2 py-2 text-center ${tone}`}>
      <p className="text-lg font-semibold tabular-nums">{n}</p>
      <p className="text-[10px] opacity-80">{l}</p>
    </div>
  );
}

function PayTile({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className={`rounded-xl px-3 py-2.5 ${tone}`}>
      <p className="text-[10px] font-medium opacity-80">{label}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums">{value}</p>
    </div>
  );
}
