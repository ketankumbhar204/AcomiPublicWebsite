type PriceRangeFilterProps = {
  id: string;
  minBound: number;
  maxBound: number;
  minValue: number | null;
  maxValue: number | null;
  step?: number;
  format: (value: number) => string;
  onChange: (min: number | null, max: number | null) => void;
};

export function PriceRangeFilter({
  id,
  minBound,
  maxBound,
  minValue,
  maxValue,
  step = 100,
  format,
  onChange,
}: PriceRangeFilterProps) {
  const min = minValue ?? minBound;
  const max = maxValue ?? maxBound;
  const span = maxBound - minBound || 1;
  const minPct = ((min - minBound) / span) * 100;
  const maxPct = ((max - minBound) / span) * 100;

  const emit = (nextMin: number, nextMax: number) => {
    onChange(nextMin <= minBound ? null : nextMin, nextMax >= maxBound ? null : nextMax);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[12px] font-medium text-navy">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
      <div className="relative mt-3 h-6">
        <div className="absolute top-1/2 h-1.5 w-full -translate-y-1/2 rounded-full bg-white/70" />
        <div
          className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-register"
          style={{ left: `${minPct}%`, width: `${Math.max(maxPct - minPct, 0)}%` }}
        />
        <label className="sr-only" htmlFor={`${id}-min`}>
          Minimum
        </label>
        <input
          id={`${id}-min`}
          type="range"
          min={minBound}
          max={maxBound}
          step={step}
          value={min}
          onChange={(event) => emit(Math.min(Number(event.target.value), max), max)}
          className="dual-range z-[1]"
        />
        <label className="sr-only" htmlFor={`${id}-max`}>
          Maximum
        </label>
        <input
          id={`${id}-max`}
          type="range"
          min={minBound}
          max={maxBound}
          step={step}
          value={max}
          onChange={(event) => emit(min, Math.max(Number(event.target.value), min))}
          className="dual-range z-[2]"
        />
      </div>
    </div>
  );
}
