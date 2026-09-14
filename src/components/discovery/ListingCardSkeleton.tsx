type ListingCardSkeletonProps = {
  count?: number;
};

export function ListingCardSkeleton({ count = 8 }: ListingCardSkeletonProps) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[var(--shadow-sm)]"
        >
          <div className="aspect-[4/3] animate-pulse bg-soft" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-soft" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-soft" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-soft" />
          </div>
        </div>
      ))}
    </div>
  );
}
