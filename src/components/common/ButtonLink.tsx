import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export type ButtonVariant = 'primary' | 'ghost' | 'ghostDark' | 'outline' | 'onDark';

export const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

export const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-register text-white hover:bg-register-hover focus-visible:ring-register shadow-sm',
  ghost:
    'bg-white text-primary ring-1 ring-primary/30 hover:bg-soft focus-visible:ring-primary',
  ghostDark:
    'bg-transparent text-white ring-1 ring-white/70 hover:bg-white/10 focus-visible:ring-white',
  outline:
    'bg-white text-primary ring-1 ring-primary hover:bg-soft focus-visible:ring-primary',
  onDark:
    'bg-accent text-cta-band hover:brightness-95 focus-visible:ring-white shadow-sm',
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
};

export function ButtonLink({
  href,
  children,
  variant = 'primary',
  className = '',
  external = true,
}: ButtonLinkProps) {
  const cls = `${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${className}`;

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
