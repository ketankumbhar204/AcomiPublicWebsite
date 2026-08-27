type FilterChipProps = {
  pressed?: boolean;
  onClick: () => void;
  children: string;
};

export function FilterChip({ pressed = false, onClick, children }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-[12px] font-medium transition ${
        pressed
          ? 'border-register bg-register-soft text-primary'
          : 'border-border bg-white text-text-secondary hover:border-register/40'
      }`}
    >
      {children}
    </button>
  );
}

type RemovableChipProps = {
  label: string;
  onRemove: () => void;
};

export function RemovableChip({ label, onRemove }: RemovableChipProps) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1 rounded-full border border-register/30 bg-register-soft px-3 py-1.5 text-[12px] font-medium text-primary"
      aria-label={`Remove ${label} filter`}
    >
      {label}
      <span aria-hidden>×</span>
    </button>
  );
}
