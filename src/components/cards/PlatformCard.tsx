import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type PlatformCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
};

export function PlatformCard({ icon: Icon, title, description, action }: PlatformCardProps) {
  return (
    <article className="flex flex-col rounded-2xl border border-border/90 bg-surface p-8 shadow-sm">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-soft text-primary-dark ring-1 ring-primary/20">
        <Icon className="h-6 w-6" strokeWidth={2} aria-hidden />
      </div>
      <h3 className="mt-5 text-xl font-semibold text-text">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </article>
  );
}
