import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

const BASE =
  'reg-focus inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed';

type ButtonProps = {
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
  className?: string;
};

/** Primary action for the registration flow. Uses the flow's own accent, not the site primary. */
export function CtaButton({
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  children,
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${BASE} bg-register text-white hover:bg-register-hover disabled:bg-register/40 ${className}`}
    >
      {loading ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}

export function SecondaryButton({
  onClick,
  type = 'button',
  disabled = false,
  children,
  className = '',
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${BASE} bg-white text-text-secondary ring-1 ring-border hover:bg-background disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
