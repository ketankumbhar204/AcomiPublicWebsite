import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'ghost' | 'ghostDark' | 'outline';

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
};

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary-hover focus-visible:ring-primary',
  ghost:
    'bg-white text-text ring-1 ring-border hover:bg-slate-50 focus-visible:ring-primary-dark',
  ghostDark:
    'bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15 focus-visible:ring-white',
  outline:
    'bg-transparent text-primary-dark ring-2 ring-primary/40 hover:bg-soft focus-visible:ring-primary',
};

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  className = '',
  external = true,
}: ButtonLinkProps) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${variants[variant]} ${className}`;

  if (!external) {
    return (
      <Link to={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={cls}>
      {children}
    </a>
  );
}
