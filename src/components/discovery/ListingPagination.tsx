type ListingPaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

export function ListingPagination({ page, pageCount, onPageChange }: ListingPaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <nav aria-label="Listing pages" className="mt-8 flex flex-wrap justify-center gap-1.5">
      {Array.from({ length: pageCount }, (_, index) => {
        const next = index + 1;
        const current = next === page;
        return (
          <button
            key={next}
            type="button"
            onClick={() => onPageChange(next)}
            aria-current={current ? 'page' : undefined}
            className={`min-w-9 rounded-lg px-3 py-2 text-[13px] font-semibold ${
              current ? 'bg-register text-white' : 'bg-white text-navy ring-1 ring-border hover:bg-soft'
            }`}
          >
            {next}
          </button>
        );
      })}
    </nav>
  );
}
