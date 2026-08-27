import { ActionButton } from '../common/ActionButton';

type ListingEmptyProps = {
  title: string;
  description: string;
  onClear: () => void;
};

export function ListingEmpty({ title, description, onClear }: ListingEmptyProps) {
  return (
    <div className="rounded-[24px] border border-black/5 bg-white px-6 py-14 text-center shadow-[var(--shadow-sm)]">
      <h2 className="text-xl font-semibold tracking-tight text-navy">{title}</h2>
      <p className="mt-2 text-[15px] text-text-secondary">{description}</p>
      <div className="mt-6 flex justify-center">
        <ActionButton onClick={onClear} variant="ghost">
          Clear filters
        </ActionButton>
      </div>
    </div>
  );
}
