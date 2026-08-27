import { Search } from 'lucide-react';
import { FIELD_INPUT_BASE } from '../form/Field';

type ListingSearchProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export function ListingSearch({ id, label, value, onChange, placeholder }: ListingSearchProps) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted"
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className={`${FIELD_INPUT_BASE} border-border py-3.5 pr-4 pl-11 shadow-[var(--shadow-sm)] focus:border-register`}
      />
    </div>
  );
}
