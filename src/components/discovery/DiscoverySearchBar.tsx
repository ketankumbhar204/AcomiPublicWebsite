import { ChevronDown, MapPin, Search, X } from 'lucide-react';
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
  city?: string;
  locationLabel?: string | null;
  locationPlaceholder?: string;
  onLocationClick?: () => void;
  onLocationClear?: () => void;
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
  locationLabel,
  locationPlaceholder,
  onLocationClick,
  onLocationClear,
  sortId,
  sortValue,
  onSortChange,
}: DiscoverySearchBarProps) {
  const { t } = useTranslation();
  const locationText = locationLabel?.trim() || locationPlaceholder || city;

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-black/5 bg-white p-2 shadow-[var(--shadow-sm)] sm:flex-row sm:items-center">
      {onLocationClick ? (
        <div className="flex min-w-0 items-center gap-1 sm:max-w-[16rem] sm:shrink-0">
          <button
            type="button"
            onClick={onLocationClick}
            aria-haspopup="dialog"
            aria-label={t('places.locationLabel', { defaultValue: 'Location' })}
            className="inline-flex min-w-0 flex-1 items-center gap-1.5 rounded-xl bg-soft px-3 py-2.5 text-left text-[13px] font-medium text-navy transition hover:bg-[#E7F4EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <MapPin aria-hidden className="h-4 w-4 shrink-0 text-register" />
            <span className="min-w-0 flex-1 truncate">{locationText}</span>
            <ChevronDown aria-hidden className="h-3.5 w-3.5 shrink-0 text-muted" />
          </button>
          {locationLabel && onLocationClear ? (
            <button
              type="button"
              onClick={onLocationClear}
              aria-label={t('places.clearLocation', { defaultValue: 'Clear location' })}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted transition hover:bg-soft hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <X aria-hidden className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      ) : locationText ? (
        <p className="inline-flex items-center gap-1.5 rounded-xl bg-soft px-3 py-2.5 text-[13px] font-medium text-navy sm:shrink-0">
          <MapPin aria-hidden className="h-4 w-4 text-register" />
          {locationText}
        </p>
      ) : null}
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
