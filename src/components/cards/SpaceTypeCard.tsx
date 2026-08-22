import type { LucideIcon } from 'lucide-react';

type SpaceTypeCardProps = {
  icon: LucideIcon;
  label: string;
  description: string;
  note?: string;
};

export function SpaceTypeCard({ icon: Icon, label, description, note }: SpaceTypeCardProps) {
  return (
    <article className="rounded-2xl border border-border/90 bg-surface p-6 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-soft text-primary-dark ring-1 ring-primary/20">
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-text">{label}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
      {note ? <p className="mt-3 text-xs font-medium text-primary-dark">{note}</p> : null}
    </article>
  );
}
