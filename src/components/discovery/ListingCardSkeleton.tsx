export function ListingCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-[24px] border border-black/5 bg-white shadow-[var(--shadow-sm)]"
      aria-hidden
    >
      <div className="aspect-[4/3] animate-pulse bg-mint" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded-full bg-soft" />
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-soft" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-soft" />
        <div className="h-6 w-28 animate-pulse rounded-full bg-soft" />
      </div>
    </div>
  );
}
