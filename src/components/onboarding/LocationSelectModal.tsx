import { useEffect, useState } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { locationsApi, type LocationRecord } from '../../api/locationsApi';
import { ActionButton } from '../common/ActionButton';
import { Modal } from '../common/Modal';
import { inputClasses } from '../form/Field';

const SEARCH_DEBOUNCE_MS = 300;

export type SelectedLocation = {
  state: string;
  district: string;
  cityTaluka: string;
  location: string;
  pincode: string;
};

type LocationRankingContext = {
  state?: string;
  district?: string;
  taluk?: string;
};

type LocationSelectModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (selected: SelectedLocation) => void;
  applyOnSelect?: boolean;
  confirmLabel?: string;
  rankingContext?: LocationRankingContext;
};

type LoadState = 'idle' | 'loading' | 'error';

function areaKey(record: LocationRecord): string {
  return [record.location, record.pincode, record.cityTaluka, record.district].join('|');
}

function displayState(state: string): string {
  return state
    .toLowerCase()
    .replace(/\b([a-z])/g, (letter) => letter.toUpperCase());
}

function contextLine(record: LocationRecord): string {
  return `${record.district} · ${displayState(record.state)}`;
}

export function LocationSelectModal({
  open,
  onClose,
  onConfirm,
  applyOnSelect = false,
  confirmLabel,
  rankingContext,
}: LocationSelectModalProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [searchResults, setSearchResults] = useState<LocationRecord[]>([]);
  const [searchState, setSearchState] = useState<LoadState>('idle');
  const [selected, setSelected] = useState<LocationRecord | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    setSearch('');
    setDebouncedSearch('');
    setSearchResults([]);
    setSearchState('idle');
    setSelected(null);
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [open, search]);

  useEffect(() => {
    if (!open || selected) {
      return;
    }
    if (debouncedSearch.length < 2) {
      setSearchResults([]);
      setSearchState('idle');
      return;
    }
    let active = true;
    setSearchState('loading');
    locationsApi
      .search(debouncedSearch, {
        state: rankingContext?.state,
        district: rankingContext?.district,
        taluk: rankingContext?.taluk,
      })
      .then((next) => {
        if (active) {
          setSearchResults(next);
          setSearchState('idle');
        }
      })
      .catch(() => {
        if (active) {
          setSearchState('error');
        }
      });
    return () => {
      active = false;
    };
  }, [debouncedSearch, open, rankingContext?.district, rankingContext?.state, rankingContext?.taluk, selected]);

  const showResults = !selected && debouncedSearch.length >= 2;

  const handleSearchChange = (value: string) => {
    setSelected(null);
    setSearch(value);
  };

  const handleSelect = (record: LocationRecord) => {
    if (applyOnSelect) {
      onConfirm(record);
      return;
    }
    setSelected(record);
    setSearch(record.location);
    setSearchResults([]);
  };

  const canConfirm = Boolean(selected?.location && selected.pincode);

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeOnBackdrop
      labelledBy="location-select-title"
      describedBy="location-select-description"
      className="max-w-[400px]"
    >
      <div className="px-5 pt-5 pb-5 sm:px-6 sm:pt-6">
        <button
          type="button"
          onClick={onClose}
          aria-label={t('common.close')}
          className="absolute top-3.5 right-3.5 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-soft hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>

        <h2
          id="location-select-title"
          className="pr-10 text-[1.25rem] leading-tight font-semibold tracking-tight text-navy"
        >
          {t('locationSelect.title', { defaultValue: 'Choose a location' })}
        </h2>
        <p id="location-select-description" className="sr-only">
          {t('locationSelect.description', {
            defaultValue: 'Search an area, city or pincode to find places nearby.',
          })}
        </p>

        <div className="mt-4">
          <label htmlFor="location-search" className="sr-only">
            {t('locationSelect.searchLabel', { defaultValue: 'Search' })}
          </label>
          <div className="relative">
            <Search
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted"
            />
            <input
              id="location-search"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder={t('locationSelect.searchPlaceholder', {
                defaultValue: 'Search area, city or pincode',
              })}
              className={`${inputClasses(false)} pl-9`}
              autoComplete="off"
            />
          </div>
        </div>

        {selected ? (
          <div className="mt-3 flex items-start gap-3 rounded-2xl border border-primary/15 bg-[#E7F4EE] px-3.5 py-3">
            <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-primary">
              <MapPin className="h-4 w-4" strokeWidth={2} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-[14px] font-semibold text-navy">{selected.location}</span>
              <span className="mt-0.5 block text-[12px] text-text-secondary">{contextLine(selected)}</span>
              <span className="block text-[12px] text-muted">{selected.pincode}</span>
            </span>
          </div>
        ) : null}

        {showResults ? (
          <ul className="mt-3 max-h-64 overflow-auto rounded-2xl border border-black/[0.06] bg-white py-1">
            {searchState === 'loading' ? (
              <li className="px-3.5 py-2.5 text-[13px] text-muted">
                {t('locationSelect.searching', { defaultValue: 'Searching…' })}
              </li>
            ) : searchState === 'error' ? (
              <li className="px-3.5 py-2.5 text-[13px] text-danger">
                {t('locationSelect.searchFailed', { defaultValue: 'Could not search locations.' })}
              </li>
            ) : searchResults.length === 0 ? (
              <li className="px-3.5 py-2.5 text-[13px] text-muted">
                {t('locationSelect.noResults', { defaultValue: 'No matching locations.' })}
              </li>
            ) : (
              searchResults.map((record) => (
                <li key={areaKey(record)}>
                  <button
                    type="button"
                    onClick={() => handleSelect(record)}
                    className="flex w-full flex-col items-start px-3.5 py-2.5 text-left hover:bg-soft"
                  >
                    <span className="text-[14px] font-semibold text-navy">{record.location}</span>
                    <span className="text-[12px] text-text-secondary">{contextLine(record)}</span>
                    <span className="text-[12px] text-muted">{record.pincode}</span>
                  </button>
                </li>
              ))
            )}
          </ul>
        ) : null}

        {applyOnSelect ? null : (
          <div className="mt-5">
            <ActionButton
              onClick={() => {
                if (canConfirm && selected) {
                  onConfirm(selected);
                }
              }}
              disabled={!canConfirm}
              className="w-full"
            >
              {confirmLabel ?? t('locationSelect.continue', { defaultValue: 'See places' })}
            </ActionButton>
          </div>
        )}
      </div>
    </Modal>
  );
}
