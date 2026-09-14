import { formatInr } from '../../data/listings/query';

type ListingPriceProps = {
  amount: number | null;
  suffix?: string;
  fallback: string;
  size?: 'card' | 'detail';
};

export function ListingPrice({ amount, suffix, fallback, size = 'card' }: ListingPriceProps) {
  if (amount == null) {
    return (
      <span className={size === 'detail' ? 'text-[15px] font-medium text-muted' : 'text-[13px] font-medium text-muted'}>
        {fallback}
      </span>
    );
  }
  return (
    <>
      {formatInr(amount)}
      {suffix ? <span className="ml-1 text-[12px] font-medium text-muted">{suffix}</span> : null}
    </>
  );
}
