import type { LucideIcon } from 'lucide-react';

type ProblemCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function ProblemCard({ icon: Icon, title, description }: ProblemCardProps) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-border/90 bg-surface p-6 shadow-sm">
      <div className="absolute top-0 right-0 h-24 w-24 translate-x-6 -translate-y-6 rounded-full bg-rose-500/5" />
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-problem-well text-problem-icon ring-1 ring-rose-100">
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
      </div>
      <h3 className="mt-4 font-semibold text-text">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
    </article>
  );
}
