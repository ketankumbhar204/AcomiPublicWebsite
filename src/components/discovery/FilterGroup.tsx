import type { ReactNode } from 'react';

type FilterGroupProps = {
  legend: string;
  layout?: 'wrap' | 'stack';
  children: ReactNode;
};

export function FilterGroup({ legend, layout = 'wrap', children }: FilterGroupProps) {
  return (
    <fieldset>
      <legend className="text-[11px] font-semibold tracking-[0.16em] text-muted uppercase">{legend}</legend>
      <div className={layout === 'stack' ? 'mt-3 flex flex-col gap-2' : 'mt-3 flex flex-wrap gap-2'}>
        {children}
      </div>
    </fieldset>
  );
}
