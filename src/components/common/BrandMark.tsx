type BrandMarkProps = {
  size?: number;
  className?: string;
};

export function BrandMark({ size = 36, className = '' }: BrandMarkProps) {
  return (
    <img
      src="/brand/logo.png"
      alt="ACOMI"
      width={size}
      height={size}
      className={`rounded-xl shadow-sm ${className}`}
    />
  );
}
