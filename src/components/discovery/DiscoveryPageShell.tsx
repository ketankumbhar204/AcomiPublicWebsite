import type { ReactNode } from 'react';

type DiscoveryPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  search: ReactNode;
  filters: ReactNode;
  toolbar: ReactNode;
  results: ReactNode;
};

export function DiscoveryPageShell({
  eyebrow,
  title,
  description,
  search,
  filters,
  toolbar,
  results,
}: DiscoveryPageShellProps) {
  return (
    <section className="bg-[#F4F7F8] py-3 sm:py-4">
      <div className="w-full px-3 sm:px-4">
        <header className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-primary uppercase">
            {eyebrow}
          </p>
          <h1 className="text-base font-semibold tracking-tight text-navy sm:text-lg">{title}</h1>
          <span className="hidden text-text-muted sm:inline" aria-hidden>
            ·
          </span>
          <p className="w-full text-[12px] text-text-secondary sm:w-auto sm:text-[13px]">
            {description}
          </p>
        </header>

        <div className="mt-3 grid grid-cols-1 items-start gap-3 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden min-h-[calc(100dvh-7rem)] rounded-2xl border border-border bg-white p-4 lg:block">
            {filters}
          </aside>

          <div className="min-w-0">
            {search}
            <div className="mt-3 min-w-0">
              {toolbar}
              {results}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
