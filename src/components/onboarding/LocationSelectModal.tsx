import { useEffect, useState } from 'react';
import { ChevronDown, Map, MapPin, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { locationsApi, type LocationRecord } from '../../api/locationsApi';
import {
  AUTOCOMPLETE_DEBOUNCE_MS,
  AUTOCOMPLETE_MIN_LENGTH,
  suggestionDetail,
  suggestionKey,
  suggestionTitle,
  suggestionToLocationRecord,
  type LocationAutocompleteSuggestion,
} from '../../data/listings/locationAutocomplete';
import { ActionButton } from '../common/ActionButton';
import { Modal } from '../common/Modal';
import { inputClasses } from '../form/Field';

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
type PickerMode = 'search' | 'browse';

function areaId(record: LocationRecord): string {
  return [record.location, record.pincode, record.cityTaluka, record.district].join('|');
}

function recordDetail(record: LocationRecord): string {
  const place = [record.cityTaluka, record.district].filter(Boolean).join(', ');
  return [place, record.pincode].filter(Boolean).join(' • ');
}

function sameState(record: LocationRecord, state: string): boolean {
  return record.state.trim().toLowerCase() === state.trim().toLowerCase();
}

export function LocationSelectModal({
  open,
  onClose,
  onConfirm,
  confirmLabel,
  rankingContext,
}: LocationSelectModalProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<PickerMode>('search');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [suggestions, setSuggestions] = useState<LocationAutocompleteSuggestion[]>([]);
  const [searchState, setSearchState] = useState<LoadState>('idle');
  const [retryToken, setRetryToken] = useState(0);
  const [searchPick, setSearchPick] = useState<LocationAutocompleteSuggestion | null>(null);
  const [stateName, setStateName] = useState('');
  const [areaPick, setAreaPick] = useState<LocationRecord | null>(null);
  const [states, setStates] = useState<string[]>([]);
  const [browseQuery, setBrowseQuery] = useState('');
  const [debouncedBrowse, setDebouncedBrowse] = useState('');
  const [browseHits, setBrowseHits] = useState<LocationRecord[]>([]);
  const [browseSearchState, setBrowseSearchState] = useState<LoadState>('idle');
  const [browseRetry, setBrowseRetry] = useState(0);
  const [browseLoad, setBrowseLoad] = useState<LoadState>('idle');
  const [stateMenuOpen, setStateMenuOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setMode('search');
    setSearch('');
    setDebouncedSearch('');
    setSuggestions([]);
    setSearchState('idle');
    setSearchPick(null);
    setStateName('');
    setAreaPick(null);
    setStates([]);
    setBrowseQuery('');
    setDebouncedBrowse('');
    setBrowseHits([]);
    setBrowseSearchState('idle');
    setStateMenuOpen(false);
    setBrowseLoad('idle');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setDebouncedSearch(search.trim()), AUTOCOMPLETE_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [open, search]);

  useEffect(() => {
    if (!open || mode !== 'search') return;
    if (debouncedSearch.length < AUTOCOMPLETE_MIN_LENGTH) {
      setSuggestions([]);
      setSearchState('idle');
      return;
    }
    let active = true;
    setSearchState('loading');
    locationsApi
      .autocomplete(debouncedSearch, {
        state: rankingContext?.state,
        district: rankingContext?.district,
      })
      .then((next) => {
        if (!active) return;
        setSuggestions(Array.isArray(next) ? next : []);
        setSearchState('idle');
      })
      .catch(() => {
        if (!active) return;
        setSuggestions([]);
        setSearchState('error');
      });
    return () => {
      active = false;
    };
  }, [debouncedSearch, mode, open, rankingContext?.district, rankingContext?.state, retryToken]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setDebouncedBrowse(browseQuery.trim()), AUTOCOMPLETE_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [browseQuery, open]);

  useEffect(() => {
    if (!open || mode !== 'browse' || !stateName) return;
    if (debouncedBrowse.length < AUTOCOMPLETE_MIN_LENGTH) {
      setBrowseHits([]);
      setBrowseSearchState('idle');
      return;
    }
    let active = true;
    setBrowseSearchState('loading');
    locationsApi
      .search(debouncedBrowse, { state: stateName })
      .then((next) => {
        if (!active) return;
        const rows = Array.isArray(next) ? next : [];
        setBrowseHits(rows.filter((record) => sameState(record, stateName) && record.location));
        setBrowseSearchState('idle');
      })
      .catch(() => {
        if (!active) return;
        setBrowseHits([]);
        setBrowseSearchState('error');
      });
    return () => {
      active = false;
    };
  }, [browseRetry, debouncedBrowse, mode, open, stateName]);

  const enterBrowse = () => {
    setMode('browse');
    setSearchPick(null);
    setStateMenuOpen(false);
    if (states.length > 0) return;
    setBrowseLoad('loading');
    locationsApi
      .listStates()
      .then((next) => {
        setStates(next);
        setBrowseLoad('idle');
      })
      .catch(() => setBrowseLoad('error'));
  };

  const enterSearch = () => {
    setMode('search');
    setStateMenuOpen(false);
    setSuggestions([]);
    setSearchPick(null);
    setSearchState('idle');
  };

  const chooseState = (value: string) => {
    setStateName(value);
    setAreaPick(null);
    setBrowseQuery('');
    setDebouncedBrowse('');
    setBrowseHits([]);
    setBrowseSearchState('idle');
    setStateMenuOpen(false);
  };

  const searchRecord = searchPick ? suggestionToLocationRecord(searchPick) : null;
  const canConfirm = mode === 'search' ? Boolean(searchRecord?.location) : Boolean(areaPick?.location);
  const showResults = mode === 'search' && !searchPick && debouncedSearch.length >= AUTOCOMPLETE_MIN_LENGTH;
  const showBrowseResults = mode === 'browse' && Boolean(stateName) && !areaPick && debouncedBrowse.length >= AUTOCOMPLETE_MIN_LENGTH;

  const confirm = () => {
    if (mode === 'search' && searchRecord?.location) onConfirm(searchRecord);
    if (mode === 'browse' && areaPick?.location) onConfirm(areaPick);
  };

  const tabClass = (active: boolean) =>
    `inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-xl border px-2 text-[13px] ${
      active
        ? 'border-primary bg-[#EAF8F2] font-semibold text-[#075E54]'
        : 'border-black/10 bg-white font-medium text-text-secondary'
    }`;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeOnBackdrop
      labelledBy="location-select-title"
      describedBy="location-select-description"
      className="max-w-[440px]"
    >
      <div className="flex max-h-[80vh] flex-col px-5 pt-5 pb-4 sm:px-6">
        <button
          type="button"
          onClick={onClose}
          aria-label={t('common.close')}
          className="absolute top-3.5 right-3.5 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-soft"
        >
          <X className="h-5 w-5" aria-hidden />
        </button>
        <h2 id="location-select-title" className="pr-10 text-[1.25rem] font-semibold text-navy">
          {t('locationSelect.title')}
        </h2>
        <p id="location-select-description" className="mt-1 text-[14px] text-text-secondary">
          {t('locationSelect.intro')}
        </p>
        <div className="mt-4 flex gap-2" role="tablist" aria-label={t('locationSelect.title')}>
          <button type="button" role="tab" id="location-tab-search" aria-selected={mode === 'search'} className={tabClass(mode === 'search')} onClick={enterSearch}>
            <Search className="h-4 w-4" aria-hidden />
            {t('locationSelect.searchTab')}
          </button>
          <button type="button" role="tab" id="location-tab-browse" aria-selected={mode === 'browse'} className={tabClass(mode === 'browse')} onClick={enterBrowse}>
            <Map className="h-4 w-4" aria-hidden />
            {t('locationSelect.browseTab')}
          </button>
        </div>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
          {mode === 'search' ? (
            <div role="tabpanel" id="location-panel-search" aria-labelledby="location-tab-search">
              <label htmlFor="location-search" className="sr-only">
                {t('locationSelect.searchLabel', { defaultValue: 'Search location' })}
              </label>
              <div className="relative">
                <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  id="location-search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setSearchPick(null);
                  }}
                  placeholder={t('locationSelect.searchPlaceholder')}
                  className={`${inputClasses(false)} location-search-input pr-10 pl-9`}
                  autoComplete="off"
                />
                {search ? (
                  <button
                    type="button"
                    aria-label={t('locationSelect.clearSearch')}
                    onClick={() => {
                      setSearch('');
                      setDebouncedSearch('');
                      setSuggestions([]);
                      setSearchPick(null);
                      setSearchState('idle');
                    }}
                    className="absolute top-1/2 right-2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-soft"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : null}
              </div>

              {searchPick ? (
                <div className="mt-3 flex gap-3 rounded-2xl bg-[#E2F7EC] px-3.5 py-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                  <span>
                    <span className="block text-[14px] font-semibold text-navy">{suggestionTitle(searchPick)}</span>
                    <span className="block text-[12px] text-text-secondary">
                      {[suggestionDetail(searchPick), searchPick.pincode].filter(Boolean).join(' • ')}
                    </span>
                  </span>
                </div>
              ) : null}

              {showResults ? (
                <ul className="mt-3 max-h-64 overflow-auto rounded-2xl border border-black/[0.06] py-1">
                  {searchState === 'loading' ? (
                    <li className="px-3.5 py-2.5 text-[13px] text-muted">{t('locationSelect.searching')}</li>
                  ) : searchState === 'error' ? (
                    <li className="px-3.5 py-2.5 text-[13px] text-danger">
                      <p>{t('locationSelect.searchFailed')}</p>
                      <button type="button" className="mt-2 font-semibold text-primary" onClick={() => setRetryToken((n) => n + 1)}>
                        {t('locationSelect.retry')}
                      </button>
                    </li>
                  ) : suggestions.length === 0 ? (
                    <li className="px-3.5 py-2.5 text-[13px] text-muted">{t('locationSelect.noResults')}</li>
                  ) : (
                    suggestions.map((suggestion, index) => {
                      const title = suggestionTitle(suggestion);
                      if (!title) return null;
                      const detail = [suggestionDetail(suggestion), suggestion.pincode].filter(Boolean).join(' • ');
                      return (
                        <li key={suggestionKey(suggestion, index)}>
                          <button type="button" onClick={() => setSearchPick(suggestion)} className="flex w-full items-start gap-2 px-3.5 py-2.5 text-left hover:bg-[#EAF8F2]">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                            <span>
                              <span className="block text-[14px] font-semibold text-navy">{title}</span>
                              {detail ? <span className="block text-[12px] text-text-secondary">{detail}</span> : null}
                            </span>
                          </button>
                        </li>
                      );
                    })
                  )}
                </ul>
              ) : null}
              <p className="mt-2 text-[11px] text-muted">
                <a href="https://www.geoapify.com/" target="_blank" rel="noreferrer" className="hover:underline">
                  {t('locationSelect.attributionGeoapify')}
                </a>
                {' · '}
                <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="hover:underline">
                  {t('locationSelect.attributionOsm')}
                </a>
              </p>
            </div>
          ) : (
            <div role="tabpanel" id="location-panel-browse" aria-labelledby="location-tab-browse" className="grid gap-3">
              <CascadeField
                label={t('locationSelect.stateLabel')}
                value={stateName}
                placeholder={t('locationSelect.selectState')}
                disabled={false}
                open={stateMenuOpen}
                onToggle={() => setStateMenuOpen((openMenu) => !openMenu)}
                options={states.map((item) => ({ id: item, label: item }))}
                onSelect={chooseState}
              />
              <div className="relative">
                <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  id="location-browse-search"
                  value={browseQuery}
                  disabled={!stateName}
                  onChange={(event) => {
                    setBrowseQuery(event.target.value);
                    setAreaPick(null);
                  }}
                  placeholder={t('locationSelect.searchPlaceholder')}
                  className={`${inputClasses(false)} location-search-input pr-10 pl-9 disabled:cursor-not-allowed disabled:bg-black/[0.03]`}
                  autoComplete="off"
                />
              </div>
              {areaPick ? (
                <div className="flex gap-3 rounded-2xl bg-[#E2F7EC] px-3.5 py-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                  <span>
                    <span className="block text-[14px] font-semibold text-navy">{areaPick.location}</span>
                    <span className="block text-[12px] text-text-secondary">{recordDetail(areaPick)}</span>
                  </span>
                </div>
              ) : null}
              {showBrowseResults ? (
                <ul className="max-h-64 overflow-auto rounded-2xl border border-black/[0.06] py-1">
                  {browseSearchState === 'loading' ? (
                    <li className="px-3.5 py-2.5 text-[13px] text-muted">{t('locationSelect.searching')}</li>
                  ) : browseSearchState === 'error' ? (
                    <li className="px-3.5 py-2.5 text-[13px] text-danger">
                      <p>{t('locationSelect.searchFailed')}</p>
                      <button type="button" className="mt-2 font-semibold text-primary" onClick={() => setBrowseRetry((n) => n + 1)}>
                        {t('locationSelect.retry')}
                      </button>
                    </li>
                  ) : browseHits.length === 0 ? (
                    <li className="px-3.5 py-2.5 text-[13px] text-muted">{t('locationSelect.noResults')}</li>
                  ) : (
                    browseHits.map((record) => (
                      <li key={areaId(record)}>
                        <button type="button" onClick={() => setAreaPick(record)} className="flex w-full items-start gap-2 px-3.5 py-2.5 text-left hover:bg-[#EAF8F2]">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                          <span>
                            <span className="block text-[14px] font-semibold text-navy">{record.location}</span>
                            <span className="block text-[12px] text-text-secondary">{recordDetail(record)}</span>
                          </span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              ) : null}
              {browseLoad === 'loading' ? <p className="text-[13px] text-muted">{t('locationSelect.searching')}</p> : null}
              {browseLoad === 'error' ? (
                <button type="button" className="text-left text-[13px] font-semibold text-primary" onClick={enterBrowse}>
                  {t('locationSelect.retry')}
                </button>
              ) : null}
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <ActionButton variant="outline" onClick={onClose}>
            {t('locationSelect.cancel')}
          </ActionButton>
          <ActionButton onClick={confirm} disabled={!canConfirm}>
            {mode === 'browse' ? t('locationSelect.applyAction') : (confirmLabel ?? t('locationSelect.selectAction'))}
          </ActionButton>
        </div>
      </div>
    </Modal>
  );
}

function CascadeField({
  label,
  value,
  placeholder,
  disabled,
  open,
  onToggle,
  options,
  onSelect,
}: {
  label: string;
  value: string;
  placeholder: string;
  disabled: boolean;
  open: boolean;
  onToggle: () => void;
  options: { id: string; label: string }[];
  onSelect: (id: string) => void;
}) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) setQuery('');
  }
  const needle = query.trim().toLowerCase();
  const visible = needle
    ? options.filter((option) => option.label.toLowerCase().includes(needle))
    : options;

  return (
    <div>
      <p className="mb-1 text-[12px] font-semibold text-text-secondary">{label}</p>
      <div className="relative">
        <input
          value={open ? query : value}
          disabled={disabled}
          aria-expanded={open}
          placeholder={open ? t('locationSelect.searchLabel') : placeholder}
          onFocus={() => {
            if (!disabled && !open) onToggle();
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            if (!disabled && !open) onToggle();
          }}
          className="location-search-input min-h-11 w-full rounded-xl border border-black/10 px-3 pr-9 text-[14px] text-navy outline-none focus:border-primary disabled:cursor-not-allowed disabled:bg-black/[0.03] disabled:text-muted"
        />
        <button
          type="button"
          disabled={disabled}
          aria-label={placeholder}
          onClick={onToggle}
          className="absolute top-1/2 right-2 -translate-y-1/2 text-muted disabled:cursor-not-allowed"
        >
          <ChevronDown className="h-4 w-4" aria-hidden />
        </button>
      </div>
      {open && !disabled ? (
        <ul className="mt-1 max-h-40 overflow-auto rounded-xl border border-black/10">
          {visible.length === 0 ? (
            <li className="px-3 py-2.5 text-[13px] text-muted">{t('locationSelect.noResults')}</li>
          ) : (
            visible.map((option) => (
              <li key={option.id}>
                <button type="button" onClick={() => onSelect(option.id)} className="w-full px-3 py-2.5 text-left text-[14px] text-navy hover:bg-soft">
                  {option.label}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
