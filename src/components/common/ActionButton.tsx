import type { ReactNode } from 'react';
import type { ButtonVariant } from './ButtonLink';
import { BUTTON_BASE, BUTTON_VARIANTS } from './ButtonLink';

type ActionButtonProps = {
  onClick: () => void;
  children: ReactNode;
  variant?: ButtonVariant;
  className?: string;
};

/**
 * Same styling as ButtonLink, for CTAs that open a dialog instead of navigating.
 */
export function ActionButton({
  onClick,
  children,
  variant = 'primary',
  className = '',
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
