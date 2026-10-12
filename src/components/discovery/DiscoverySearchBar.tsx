import { ChevronDown, MapPin, Search, SlidersHorizontal, X } from 'lucide-react';
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
  onOpenFilters?: () => void;
  filtersOpen?: boolean;
  activeFilterCount?: number;
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
  onOpenFilters,
  filtersOpen = false,
  activeFilterCount = 0,
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
      <div className={onOpenFilters ? 'flex gap-2 sm:contents' : 'sm:w-44 sm:shrink-0'}>
      {onOpenFilters ? (
        <button
          type="button"
          onClick={onOpenFilters}
          aria-haspopup="dialog"
          aria-expanded={filtersOpen}
          aria-label={
            activeFilterCount > 0
              ? t('discovery.filterButtonActive', {
                  count: activeFilterCount,
                  defaultValue: 'Filter, {{count}} active',
                })
              : t('discovery.filterButton', { defaultValue: 'Filter' })
          }
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-3.5 text-[13px] font-semibold text-navy transition hover:bg-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <SlidersHorizontal aria-hidden className="h-4 w-4 text-register" />
          <span>
            {t('discovery.filterButton', { defaultValue: 'Filter' })}
            {activeFilterCount > 0 ? <span className="text-register"> · {activeFilterCount}</span> : null}
          </span>
        </button>
      ) : null}
      <div className={onOpenFilters ? 'min-w-0 flex-1 sm:w-44 sm:flex-none sm:shrink-0' : undefined}>
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
    </div>
  );
}
