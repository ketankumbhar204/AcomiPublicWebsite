import type { ReactNode } from 'react';

type DemoLabelProps = {
  children?: ReactNode;
  className?: string;
};

export function DemoLabel({ children = 'Illustrative product data', className = '' }: DemoLabelProps) {
  return (
    <p className={`text-[10px] font-semibold tracking-[0.14em] text-muted uppercase ${className}`}>
      {children}
    </p>
  );
}
