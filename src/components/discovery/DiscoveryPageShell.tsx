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
    <section className="bg-[#F4F7F8] py-5 sm:py-6">
      <div className="w-full px-3 sm:px-4">
        <p className="text-[11px] font-semibold tracking-[0.18em] text-primary uppercase">{eyebrow}</p>
        <h1 className="mt-2 text-[1.85rem] font-semibold tracking-tight text-navy sm:text-[2.2rem]">{title}</h1>
        <p className="mt-2 text-[14px] text-text-secondary sm:text-[15px]">{description}</p>

        <div className="mt-5 grid grid-cols-1 items-start gap-4 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside className="hidden min-h-[calc(100dvh-8rem)] rounded-2xl border border-[#8fd4b0] bg-[#d6f3e4] p-4 lg:block">
            {filters}
          </aside>

          <div className="min-w-0">
            {search}
            <div className="mt-4 min-w-0">
              {toolbar}
              {results}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
