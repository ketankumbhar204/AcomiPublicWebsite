type ListingCardSkeletonProps = {
  count?: number;
  gridClassName?: string;
  compact?: boolean;
};

export function ListingCardSkeleton({
  count = 6,
  gridClassName = 'mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
  compact = false,
}: ListingCardSkeletonProps) {
  return (
    <div className={gridClassName} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[var(--shadow-sm)]"
        >
          <div className="relative aspect-[4/3] animate-pulse bg-soft">
            <div className="absolute top-3 left-3 h-6 w-14 rounded-md bg-white/80" />
            <div className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80" />
          </div>
          <div className={`@container flex flex-1 flex-col ${compact ? 'p-3' : 'p-3.5'}`}>
            <div className="h-5 w-4/5 animate-pulse rounded bg-soft" />
            <div className="mt-1.5 h-4 w-3/5 animate-pulse rounded bg-soft" />
            <div className={`h-5 w-2/5 animate-pulse rounded bg-soft ${compact ? 'mt-1.5' : 'mt-3'}`} />
            <div className={`rounded-2xl bg-[#EAF8F2] ${compact ? 'mt-1.5 p-2' : 'mt-2 p-2.5'}`}>
              <div className="mb-1 h-3 w-28 animate-pulse rounded bg-white" />
              <div className={`grid grid-cols-2 ${compact ? 'gap-1.5' : 'gap-2'}`}>
                {Array.from({ length: 6 }, (_, chip) => (
                  <div key={chip} className={`animate-pulse rounded-xl bg-white ${compact ? 'h-9' : 'h-10'}`} />
                ))}
              </div>
            </div>
            <div className={`mt-auto flex flex-col gap-2 @min-[260px]:flex-row ${compact ? 'pt-2' : 'pt-3'}`}>
              <div className="h-10 w-full animate-pulse rounded-lg bg-soft @min-[260px]:w-24" />
              <div className="h-10 w-full animate-pulse rounded-lg bg-soft @min-[260px]:flex-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
