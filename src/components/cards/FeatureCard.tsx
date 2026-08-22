import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  emphasized?: boolean;
};

export function FeatureCard({ icon: Icon, title, description, href, emphasized = true }: FeatureCardProps) {
  const body = (
    <>
      <div className="pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full bg-gradient-to-br from-primary/15 to-transparent blur-2xl transition group-hover:from-primary/25" />
      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-emerald-50 text-primary-dark ring-1 ring-primary/20">
        <Icon className="h-5 w-5" strokeWidth={2} aria-hidden />
      </div>
      <h3 className="relative mt-4 text-lg font-semibold text-text">{title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-text-secondary">{description}</p>
    </>
  );

  const cls = `group relative overflow-hidden rounded-2xl border border-border/80 bg-surface p-6 shadow-sm transition hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${
    emphasized ? '' : 'opacity-95'
  }`;

  if (href) {
    return (
      <Link to={href} className={cls}>
        {body}
      </Link>
    );
  }

  return <article className={cls}>{body}</article>;
}
