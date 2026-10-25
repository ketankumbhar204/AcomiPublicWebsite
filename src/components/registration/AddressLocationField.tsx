import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Check, MapPin, Search } from 'lucide-react';
import { locationsApi } from '../../api/locationsApi';
import {
  AUTOCOMPLETE_DEBOUNCE_MS,
  AUTOCOMPLETE_MIN_LENGTH,
  normalizeRegistrationLocation,
  suggestionDetail,
  suggestionKey,
  suggestionTitle,
  type LocationAutocompleteSuggestion,
} from '../../data/listings/locationAutocomplete';
import { LISTING_COPY, type ListingKind } from '../../constants/listing';
import { digitsOnly } from '../../lib/indianMobile';
import { Field, inputClasses } from '../form/Field';
import { TextField } from '../form/TextField';
import type { FieldErrors, RegistrationForm } from './registrationForm';

type AddressLocationFieldProps = {
  form: RegistrationForm;
  errors: FieldErrors;
  kind: ListingKind;
  requireBuilding?: boolean;
  onChange: <K extends keyof RegistrationForm>(key: K, value: RegistrationForm[K]) => void;
};

type SearchStatus = 'idle' | 'loading' | 'ready' | 'empty' | 'error';

function DetailInput({
  id,
  label,
  value,
  onChange,
  error,
  inputMode,
  maxLength,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  inputMode?: 'text' | 'decimal' | 'numeric';
  maxLength?: number;
}) {
  return (
    <label className="block min-w-0" htmlFor={id}>
      <span className="text-[11px] font-medium tracking-wide text-muted uppercase">{label}</span>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        className={`${inputClasses(Boolean(error))} mt-1 px-2.5 py-2 text-[13px]`}
      />
    </label>
  );
}

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium tracking-wide text-muted uppercase">{label}</dt>
      <dd className="truncate text-[13px] text-navy">{value || '—'}</dd>
    </div>
  );
}

export function AddressLocationField({
  form,
  errors,
  kind,
  requireBuilding = true,
  onChange,
}: AddressLocationFieldProps) {
  const copy = LISTING_COPY[kind];
  const listId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState(form.locationQuery);
  const [suggestions, setSuggestions] = useState<LocationAutocompleteSuggestion[]>([]);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    setQuery(form.locationQuery);
  }, [form.locationQuery]);

  useEffect(() => {
    if (form.locationSelected) {
      setSuggestions([]);
      setStatus('idle');
      setOpen(false);
      return;
    }
    const text = query.trim();
    if (text.length < AUTOCOMPLETE_MIN_LENGTH) {
      setSuggestions([]);
      setStatus('idle');
      setOpen(false);
      return;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setStatus('loading');
      setOpen(true);
      locationsApi
        .autocompleteAddress(text)
        .then((rows) => {
          if (controller.signal.aborted) return;
          const next = rows.filter((row) => normalizeRegistrationLocation(row));
          setSuggestions(next);
          setActive(-1);
          setStatus(next.length ? 'ready' : 'empty');
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setSuggestions([]);
          setStatus('error');
        });
    }, AUTOCOMPLETE_DEBOUNCE_MS);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, form.locationSelected]);

  function clearSelection() {
    onChange('locationSelected', false);
    onChange('addressLine', '');
    onChange('locality', '');
    onChange('city', '');
    onChange('district', '');
    onChange('state', '');
    onChange('pincode', '');
    onChange('latitude', '');
    onChange('longitude', '');
    onChange('mapUrl', '');
  }

  function onQueryChange(value: string) {
    setQuery(value);
    onChange('locationQuery', value);
    if (form.locationSelected) {
      clearSelection();
    }
    onChange('addressLine', value);
  }

  function selectSuggestion(suggestion: LocationAutocompleteSuggestion) {
    const location = normalizeRegistrationLocation(suggestion);
    if (!location) return;
    onChange('locationQuery', location.formattedAddress);
    onChange('locationSelected', true);
    onChange('addressLine', location.address);
    onChange('locality', location.locality);
    onChange('city', location.city);
    onChange('district', location.district);
    onChange('state', location.state);
    onChange('pincode', location.pincode);
    onChange('latitude', String(location.latitude));
    onChange('longitude', String(location.longitude));
    onChange('mapUrl', location.googleMapsLink);
    setQuery(location.formattedAddress);
    setOpen(false);
  }

  function keepTypedLocation() {
    setOpen(false);
    setActive(-1);
    if (form.locationSelected) {
      clearSelection();
      onChange('addressLine', query);
    }
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      setActive(-1);
      return;
    }
    if (!open || status !== 'ready' || suggestions.length === 0) {
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((current) => (current + 1 >= suggestions.length ? -1 : current + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((current) => (current <= 0 ? -1 : current - 1));
    } else if (event.key === 'Enter' && active >= 0) {
      event.preventDefault();
      const suggestion = suggestions[active];
      if (suggestion) selectSuggestion(suggestion);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      keepTypedLocation();
    }
  }

  const placeLine = [form.locality, form.city, form.state].filter(Boolean).join(', ');
  const summaryLine = [placeLine, form.pincode].filter(Boolean).join(' - ');

  return (
    <div className="space-y-3">
      <TextField
        id="buildingName"
        label={copy.buildingLabel}
        required={requireBuilding}
        value={form.buildingName}
        onChange={(next) => {
          onChange('buildingName', next);
          onChange('buildingNameEdited', true);
        }}
        error={errors.buildingName}
        placeholder={copy.buildingPlaceholder}
        maxLength={150}
        autoComplete="organization"
      />
      <Field htmlFor="locationQuery" label="Search location" required error={errors.locationQuery}>
        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted"
          />
          <input
            ref={inputRef}
            id="locationQuery"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && suggestions[active] ? `${listId}-${active}` : undefined}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => {
              if (suggestions.length > 0 && !form.locationSelected) setOpen(true);
            }}
            onBlur={() => {
              window.setTimeout(() => setOpen(false), 150);
            }}
            placeholder="Search building, road, area, locality or landmark"
            autoComplete="off"
            className={`${inputClasses(Boolean(errors.locationQuery))} pl-10`}
          />
        </div>
        {open ? (
          <div
            id={listId}
            role="listbox"
            onMouseDown={(event) => event.preventDefault()}
            className="mt-1 max-h-56 overflow-y-auto rounded-2xl border border-border bg-white shadow-[0_12px_32px_rgba(15,23,42,0.12)]"
          >
            <button
              type="button"
              className="block w-full border-b border-border bg-[#F7FBF8] px-3.5 py-2.5 text-left"
              onClick={keepTypedLocation}
            >
              <span className="block text-[14px] font-medium text-navy">Use “{query.trim()}”</span>
              <span className="mt-0.5 block text-[12px] text-text-secondary">
                Continue with this text. A suggestion is optional.
              </span>
            </button>
            {status === 'loading' ? (
              <p className="px-3.5 py-3 text-[13px] text-text-secondary">Searching locations...</p>
            ) : null}
            {status === 'empty' ? (
              <p className="px-3.5 py-3 text-[13px] text-text-secondary">
                No matching places. You can continue with the location you typed.
              </p>
            ) : null}
            {status === 'error' ? (
              <p className="px-3.5 py-3 text-[13px] text-danger">Unable to search locations. Please try again.</p>
            ) : null}
            {status === 'ready'
              ? suggestions.map((suggestion, index) => {
                  const title = suggestionTitle(suggestion);
                  const detail = suggestionDetail(suggestion);
                  return (
                    <button
                      key={suggestionKey(suggestion, index)}
                      id={`${listId}-${index}`}
                      type="button"
                      role="option"
                      aria-selected={index === active}
                      onMouseEnter={() => setActive(index)}
                      onClick={() => selectSuggestion(suggestion)}
                      className={`block w-full px-3.5 py-2.5 text-left ${
                        index === active ? 'bg-[#E7F6EE]' : 'bg-white'
                      }`}
                    >
                      <span className="block text-[14px] font-medium text-navy">{title}</span>
                      {detail ? (
                        <span className="mt-0.5 block text-[12px] text-text-secondary">{detail}</span>
                      ) : null}
                    </button>
                  );
                })
              : null}
          </div>
        ) : null}
      </Field>

      {form.locationSelected ? (
        <div className="rounded-2xl border border-primary/20 bg-[#F3FBF7] px-3.5 py-3">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-primary">
            <Check aria-hidden className="h-4 w-4" />
            Location selected
          </p>
          {form.buildingName.trim() ? (
            <p className="mt-1.5 text-[14px] font-semibold text-navy">{form.buildingName.trim()}</p>
          ) : null}
          <p className="mt-1 text-[13px] leading-snug text-text">{form.addressLine}</p>
          {summaryLine ? <p className="mt-1 text-[13px] text-text-secondary">{summaryLine}</p> : null}
          <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-2">
            <ReadOnly label="Locality" value={form.locality} />
            <ReadOnly label="City" value={form.city} />
            <ReadOnly label="State" value={form.state} />
            {form.pincode ? <ReadOnly label="Pincode" value={form.pincode} /> : null}
            {form.district ? <ReadOnly label="District" value={form.district} /> : null}
          </dl>
          {form.mapUrl ? (
            <a
              href={form.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-primary underline underline-offset-2"
            >
              <MapPin aria-hidden className="h-3.5 w-3.5" />
              Open in Google Maps
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => {
              clearSelection();
              onChange('locationQuery', '');
              setQuery('');
              inputRef.current?.focus();
            }}
            className="mt-2 block text-[13px] font-semibold text-primary"
          >
            Change location
          </button>
        </div>
      ) : form.locationQuery.trim() && !open ? (
        <div className="rounded-2xl border border-border bg-white px-3.5 py-3">
          <p className="text-[13px] font-semibold text-navy">Location details</p>
          <p className="mt-0.5 text-[12px] leading-snug text-text-secondary">
            Optional. Add city, district and the other details for “{form.locationQuery.trim()}”.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5">
            <DetailInput
              id="locality"
              label="Locality"
              value={form.locality}
              onChange={(value) => onChange('locality', value)}
              maxLength={80}
            />
            <DetailInput
              id="city"
              label="City"
              value={form.city}
              onChange={(value) => onChange('city', value)}
              maxLength={80}
            />
            <DetailInput
              id="state"
              label="State"
              value={form.state}
              onChange={(value) => onChange('state', value)}
              maxLength={80}
            />
            <DetailInput
              id="pincode"
              label="Pincode"
              value={form.pincode}
              onChange={(value) => onChange('pincode', digitsOnly(value, 6))}
              error={errors.pincode}
              inputMode="numeric"
              maxLength={6}
            />
            <DetailInput
              id="district"
              label="District"
              value={form.district}
              onChange={(value) => onChange('district', value)}
              maxLength={80}
            />
          </div>
          {errors.pincode ? <p className="mt-2 text-[12px] text-danger">{errors.pincode}</p> : null}
        </div>
      ) : null}

      <TextField
        id="mapUrl"
        label="Google Maps link (optional)"
        value={form.mapUrl}
        onChange={(value) => onChange('mapUrl', value)}
        error={errors.mapUrl}
        placeholder="Paste a Google Maps link"
        inputMode="url"
      />

      {form.locationSelected && errors.pincode ? (
        <p className="text-[12px] text-danger">{errors.pincode}</p>
      ) : null}
    </div>
  );
}
