import { MapPin, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SORT_OPTIONS } from '../../data/listings/defaults';
import type { PropertySort } from '../../data/listings/types';
import { FIELD_INPUT_BASE } from '../form/Field';

type DiscoverySearchBarProps = {
  searchId: string;
  searchLabel: string;
  searchValue: string;
  searchPlaceholder: string;
  onSearchChange: (value: string) => void;
  city: string;
  sortId: string;
  sortValue: PropertySort;
  onSortChange: (value: PropertySort) => void;
};

export function DiscoverySearchBar({
  searchId,
  searchLabel,
  searchValue,
  searchPlaceholder,
  onSearchChange,
  city,
  sortId,
  sortValue,
  onSortChange,
}: DiscoverySearchBarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-black/5 bg-white p-2 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <label htmlFor={searchId} className="sr-only">
          {searchLabel}
        </label>
        <Search
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
        />
        <input
          id={searchId}
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          autoComplete="off"
          className={`${FIELD_INPUT_BASE} border-transparent py-2.5 pr-3 pl-10 shadow-none focus:border-register`}
        />
      </div>
      <p className="inline-flex items-center gap-1.5 rounded-xl bg-soft px-3 py-2.5 text-[13px] font-medium text-navy sm:shrink-0">
        <MapPin aria-hidden className="h-4 w-4 text-register" />
        {city}
      </p>
      <div className="sm:w-48">
        <label htmlFor={sortId} className="sr-only">
          {t('discovery.sortLabel')}
        </label>
        <select
          id={sortId}
          value={sortValue}
          onChange={(event) => onSortChange(event.target.value as PropertySort)}
          className={`${FIELD_INPUT_BASE} border-transparent py-2.5 text-[13px] shadow-none focus:border-register`}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {t(`discovery.sort.${option.id}`)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
