type ListingCardTitleProps = {
  name: string;
};

/** Shared Places and Mess card title: dark type plus a short green accent rule. */
export function ListingCardTitle({ name }: ListingCardTitleProps) {
  return (
    <h2 className="listing-card-title">
      <span className="block line-clamp-2 text-[17px] leading-[1.25] font-semibold tracking-tight text-navy">
        {name}
      </span>
    </h2>
  );
}
