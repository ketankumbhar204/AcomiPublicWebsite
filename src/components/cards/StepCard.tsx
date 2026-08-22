import type { LucideIcon } from 'lucide-react';

type StepCardProps = {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

export function StepCard({ step, title, description, icon: Icon }: StepCardProps) {
  return (
    <article className="relative rounded-2xl border border-border/90 bg-surface p-8 shadow-sm">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-emerald-50 text-primary-dark ring-1 ring-primary/20">
        <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-primary-dark">Step {step}</p>
      <h3 className="mt-2 text-xl font-bold text-text">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{description}</p>
    </article>
  );
}
