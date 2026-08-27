import { RemovableChip } from './FilterChip';

export type ActiveFilter = {
  id: string;
  label: string;
  onRemove: () => void;
};

type ActiveFilterChipsProps = {
  filters: ActiveFilter[];
  onClearAll: () => void;
};

export function ActiveFilterChips({ filters, onClearAll }: ActiveFilterChipsProps) {
  if (filters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter) => (
        <RemovableChip key={filter.id} label={filter.label} onRemove={filter.onRemove} />
      ))}
      <button
        type="button"
        onClick={onClearAll}
        className="text-[12px] font-semibold text-primary underline-offset-2 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
