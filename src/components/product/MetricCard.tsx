import type { LucideIcon } from 'lucide-react';

type Tone = 'teal' | 'blue' | 'amber' | 'violet';

const tones: Record<Tone, { wrap: string; icon: string; value: string }> = {
  teal: { wrap: 'bg-[#F3FAF6]', icon: 'text-[#128C7E] bg-[#D8F3E3]', value: 'text-[#0F6B4C]' },
  blue: { wrap: 'bg-[#F4F8FF]', icon: 'text-[#2563EB] bg-[#DBEAFE]', value: 'text-[#1D4ED8]' },
  amber: { wrap: 'bg-[#FFF8F1]', icon: 'text-[#D97706] bg-[#FFEDD5]', value: 'text-[#B45309]' },
  violet: { wrap: 'bg-[#F7F4FF]', icon: 'text-[#7C3AED] bg-[#EDE9FE]', value: 'text-[#6D28D9]' },
};

type MetricCardProps = {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  tone?: Tone;
};

export function MetricCard({ label, value, icon: Icon, tone = 'teal' }: MetricCardProps) {
  const t = tones[tone];
  return (
    <div className={`rounded-2xl border border-black/5 p-4 shadow-[0_8px_24px_rgba(11,28,22,0.04)] ${t.wrap}`}>
      {Icon ? (
        <span className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg ${t.icon}`}>
          <Icon className="h-4 w-4" strokeWidth={2} />
        </span>
      ) : null}
      <p className={`text-2xl font-semibold tracking-tight tabular-nums ${t.value}`}>{value}</p>
      <p className="mt-1 text-xs font-medium text-muted">{label}</p>
    </div>
  );
}

export function ProgressBar({
  segments,
}: {
  segments: Array<{ pct: number; className: string }>;
}) {
  return (
    <div className="flex h-2 overflow-hidden rounded-full bg-[#E8F0EC]">
      {segments.map((s, i) => (
        <span key={i} className={`bar-fill ${s.className}`} style={{ width: `${s.pct}%` }} />
      ))}
    </div>
  );
}
