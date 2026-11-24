import type { ReactNode } from 'react';

type DiscoveryPageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  search: ReactNode;
  filters?: ReactNode;
  /** Places keeps filters in a drawer so the listing grid can use the full width. */
  hideSidebar?: boolean;
  toolbar: ReactNode;
  results: ReactNode;
};

export function DiscoveryPageShell({
  eyebrow,
  title,
  description,
  search,
  filters,
  hideSidebar = false,
  toolbar,
  results,
}: DiscoveryPageShellProps) {
  return (
    <section className="bg-[#F4F7F8] py-3 sm:py-4">
      <div className="w-full px-3 sm:px-4">
        <header className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-primary uppercase">
            {eyebrow}
          </p>
          <div className="mt-0.5 flex min-w-0 flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2">
            <h1 className="text-base font-semibold tracking-tight text-navy sm:text-lg">{title}</h1>
            <span className="hidden text-text-muted sm:inline" aria-hidden>
              ·
            </span>
            <p className="max-w-3xl text-[12px] leading-snug text-text-secondary sm:text-[13px]">
              {description}
            </p>
          </div>
        </header>

        <div
          className={
            hideSidebar
              ? 'mt-3 min-w-0'
              : 'mt-3 grid grid-cols-1 items-start gap-3 lg:grid-cols-[240px_minmax(0,1fr)]'
          }
        >
          {hideSidebar ? null : (
            <aside className="hidden min-h-[calc(100dvh-7rem)] rounded-2xl border border-border bg-white p-4 lg:block">
              {filters}
            </aside>
          )}

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
