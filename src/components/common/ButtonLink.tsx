import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

type Variant = 'primary' | 'ghost' | 'ghostDark' | 'outline' | 'onDark';

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
};

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover focus-visible:ring-primary shadow-sm',
  ghost:
    'bg-white text-primary ring-1 ring-primary/30 hover:bg-soft focus-visible:ring-primary',
  ghostDark:
    'bg-transparent text-white ring-1 ring-white/70 hover:bg-white/10 focus-visible:ring-white',
  outline:
    'bg-white text-primary ring-1 ring-primary hover:bg-soft focus-visible:ring-primary',
  onDark:
    'bg-accent text-cta-band hover:brightness-95 focus-visible:ring-white shadow-sm',
};

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  className = '',
  external = true,
}: ButtonLinkProps) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${variants[variant]} ${className}`;

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
