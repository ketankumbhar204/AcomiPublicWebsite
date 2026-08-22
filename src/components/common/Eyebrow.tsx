type EyebrowProps = {
  children: string;
  className?: string;
};

export function Eyebrow({ children, className = '' }: EyebrowProps) {
  return (
    <p className={`text-[11px] font-semibold tracking-[0.18em] text-primary uppercase ${className}`}>
      {children}
    </p>
  );
}
