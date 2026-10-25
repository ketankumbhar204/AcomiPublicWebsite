import { useCallback, useEffect, useState } from 'react';
import { Building2, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  listMyListings,
  updateLiveListing,
  updateMessLead,
  updatePropertyLead,
  type ListingCatalogUpdate,
  type MeListing,
  type MeListingKind,
  type MeListingPublication,
} from '../auth/mySpacesApi';
import {
  appHref,
  listingAddress,
  showsAccommodation,
  showsManage,
  showsMeals,
  showsPublicListing,
} from '../auth/mySpacesActions';
import { getPublicAccessToken, PublicApiError } from '../lib/apiClient';
import { API_BASE_URL } from '../config/env';
import { RequireAuth } from '../components/auth/RequireAuth';
import { ActionButton } from '../components/common/ActionButton';
import { Container } from '../components/layout/Container';
import { APP } from '../constants/links';
import { useListingDrawer } from '../context/ListingDrawerContext';
import { applySeo } from '../lib/seo';

type KindFilter = 'ALL' | MeListingKind;
type StatusFilter = 'ALL' | MeListingPublication;

const RESULTS_GRID =
  'mt-4 grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(min(100%,19.25rem),1fr))]';

function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const origin = API_BASE_URL.replace(/\/api\/v1\/?$/, '');
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`;
}

function coverSource(listing: MeListing): string | null {
  if (listing.coverImageUrl) return mediaUrl(listing.coverImageUrl);
  if (listing.photoFileId) return mediaUrl(`/api/v1/files/${listing.photoFileId}/content`);
  return null;
}

function priceText(listing: MeListing): string | null {
  if (listing.kind === 'MESS') {
    const parts: string[] = [];
    if (listing.monthlyPrice != null && listing.monthlyPrice !== '') parts.push(`₹${listing.monthlyPrice}`);
    if (listing.mealPrice != null && listing.mealPrice !== '') parts.push(`₹${listing.mealPrice} / meal`);
    return parts.length ? parts.join(' · ') : null;
  }
  if (listing.startingPrice == null || listing.startingPrice === '') return null;
  return `₹${listing.startingPrice}`;
}

export function MySpacesPage() {
  return (
    <RequireAuth>
      <MySpacesView />
    </RequireAuth>
  );
}

function MySpacesView() {
  const { t } = useTranslation();
  const { openListing } = useListingDrawer();
  const [items, setItems] = useState<MeListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<KindFilter>('ALL');
  const [status, setStatus] = useState<StatusFilter>('ALL');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<MeListing | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      setItems(
        await listMyListings({
          kind: kind === 'ALL' ? undefined : kind,
          status: status === 'ALL' ? undefined : status,
          search: query,
        }),
      );
    } catch (err) {
      setItems([]);
      setError(err instanceof PublicApiError ? err.message : t('mySpaces.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [kind, query, status, t]);

  useEffect(() => {
    applySeo({
      title: t('mySpaces.title'),
      description: t('mySpaces.subtitle'),
      path: '/my-spaces',
    });
  }, [t]);

  useEffect(() => {
    const timer = window.setTimeout(() => setQuery(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  const emptyAccount = !loading && !error && items.length === 0 && !query && kind === 'ALL' && status === 'ALL';

  return (
    <section className="bg-background py-8 sm:py-10">
      <Container>
        <h1 className="text-2xl font-semibold tracking-tight text-navy">{t('mySpaces.title')}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t('mySpaces.subtitle')}</p>

        <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label={t('mySpaces.title')}>
          <FilterChip label={t('mySpaces.all')} selected={kind === 'ALL'} onClick={() => setKind('ALL')} />
          <FilterChip label={t('mySpaces.properties')} selected={kind === 'PROPERTY'} onClick={() => setKind('PROPERTY')} />
          <FilterChip label={t('mySpaces.messes')} selected={kind === 'MESS'} onClick={() => setKind('MESS')} />
          <FilterChip label={t('mySpaces.live')} selected={status === 'LIVE'} onClick={() => setStatus(status === 'LIVE' ? 'ALL' : 'LIVE')} />
          <FilterChip label={t('mySpaces.pending')} selected={status === 'PENDING'} onClick={() => setStatus(status === 'PENDING' ? 'ALL' : 'PENDING')} />
        </div>

        <label className="mt-3 block">
          <span className="sr-only">{t('mySpaces.search')}</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('mySpaces.search')}
            className="h-11 w-full rounded-2xl border border-black/10 bg-white px-4 text-sm text-navy outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </label>

        {notice ? <p className="mt-3 text-sm font-medium text-primary">{notice}</p> : null}

        {loading && items.length === 0 ? (
          <p className="mt-8 text-sm text-text-secondary">{t('mySpaces.loading')}</p>
        ) : null}

        {error && items.length === 0 ? (
          <div className="mt-8 rounded-[24px] border border-black/5 bg-white px-6 py-10 text-center">
            <p className="text-sm text-text-secondary">{error}</p>
            <div className="mt-4 flex justify-center">
              <ActionButton
                variant="ghost"
                onClick={() => {
                  setLoading(true);
                  void load();
                }}
              >
                {t('mySpaces.retry')}
              </ActionButton>
            </div>
          </div>
        ) : null}

        {emptyAccount ? (
          <div className="mt-8 rounded-[24px] border border-black/5 bg-white px-6 py-14 text-center">
            <Building2 aria-hidden className="mx-auto h-7 w-7 text-coral" />
            <h2 className="mt-3 text-xl font-semibold text-navy">{t('mySpaces.emptyTitle')}</h2>
            <p className="mt-2 text-sm text-text-secondary">{t('mySpaces.emptyBody')}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <ActionButton onClick={() => openListing('property')}>{t('mySpaces.listProperty')}</ActionButton>
              <ActionButton variant="ghost" onClick={() => openListing('mess')}>
                {t('mySpaces.listMess')}
              </ActionButton>
            </div>
          </div>
        ) : null}

        {!loading && !error && !emptyAccount && items.length === 0 ? (
          <p className="mt-8 text-sm text-text-secondary">{t('mySpaces.noMatches')}</p>
        ) : null}

        {items.length > 0 ? (
          <div className={RESULTS_GRID}>
            {items.map((listing) => (
              <ListingCard
                key={listing.spaceId ?? listing.registrationId}
                listing={listing}
                onEdit={() => {
                  setNotice(null);
                  setEditing(listing);
                }}
              />
            ))}
          </div>
        ) : null}

        {editing ? (
          <ListingEditor
            listing={editing}
            onClose={() => setEditing(null)}
            onSaved={async () => {
              setEditing(null);
              setNotice(t('mySpaces.saved'));
              setLoading(true);
              await load();
            }}
          />
        ) : null}
      </Container>
    </section>
  );
}

function ListingCard({ listing, onEdit }: { listing: MeListing; onEdit: () => void }) {
  const { t } = useTranslation();
  const address = listingAddress(listing);
  const price = priceText(listing);
  const live = listing.publication === 'LIVE';
  const manage = showsManage(listing) ? appHref(APP.web, listing.managePath) : null;
  const accommodation = showsAccommodation(listing) ? appHref(APP.web, listing.accommodationPath) : null;
  const meals = showsMeals(listing) ? appHref(APP.web, listing.mealsPath) : null;
  const publicHref = showsPublicListing(listing) ? listing.publicPath : null;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-[var(--shadow-sm)]">
      <ListingImage listing={listing} />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-semibold text-navy">{listing.name}</h2>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${live ? 'bg-primary/10 text-primary' : 'bg-amber-100 text-amber-800'}`}>
            {live ? t('mySpaces.live') : t('mySpaces.pending')}
          </span>
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
          {listing.spaceType || listing.kind}
          {listing.registrationStatus && !live ? ` · ${listing.registrationStatus}` : ''}
        </p>
        {address ? <p className="text-sm text-text-secondary">{address}</p> : null}
        {price ? <p className="text-sm font-semibold text-navy">{price}</p> : null}
        {!live && listing.registrationReference ? (
          <p className="text-xs text-text-secondary">
            {t('mySpaces.reference')}: {listing.registrationReference}
          </p>
        ) : null}
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {publicHref ? (
            <Link to={publicHref} className="text-sm font-semibold text-coral">
              {t('mySpaces.viewPublic')}
            </Link>
          ) : null}
          <button type="button" className="text-sm font-semibold text-navy" onClick={onEdit}>
            {t('mySpaces.edit')}
          </button>
          {manage ? (
            <a href={manage} className="text-sm font-semibold text-primary">
              {t('mySpaces.manage')}
            </a>
          ) : null}
          {accommodation ? (
            <a href={accommodation} className="text-sm font-semibold text-primary">
              {t('mySpaces.accommodation')}
            </a>
          ) : null}
          {meals ? (
            <a href={meals} className="text-sm font-semibold text-primary">
              {t('mySpaces.meals')}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

function ListingImage({ listing }: { listing: MeListing }) {
  const src = coverSource(listing);
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!src) {
      setUrl(null);
      return;
    }
    let cancelled = false;
    let objectUrl: string | null = null;
    const token = getPublicAccessToken();
    void fetch(src, {
      credentials: 'include',
      headers: {
        Accept: 'image/*',
        'X-ACOMI-CLIENT': 'WEB',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then(async (response) => {
        if (!response.ok) return null;
        return response.blob();
      })
      .then((blob) => {
        if (!blob || cancelled || !blob.type.startsWith('image/')) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      })
      .catch(() => {
        if (!cancelled) setUrl(null);
      });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [src]);

  return (
    <div className="flex h-36 items-center justify-center bg-soft">
      {url ? (
        <img src={url} alt="" className="h-full w-full object-cover" />
      ) : listing.kind === 'MESS' ? (
        <UtensilsCrossed className="h-7 w-7 text-text-secondary" aria-hidden />
      ) : (
        <Building2 className="h-7 w-7 text-text-secondary" aria-hidden />
      )}
    </div>
  );
}

function ListingEditor({
  listing,
  onClose,
  onSaved,
}: {
  listing: MeListing;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const { t } = useTranslation();
  const mess = listing.kind === 'MESS';
  const [name, setName] = useState(listing.name ?? '');
  const [address, setAddress] = useState(listing.address ?? '');
  const [city, setCity] = useState(listing.city ?? '');
  const [state, setState] = useState(listing.state ?? '');
  const [pincode, setPincode] = useState(listing.pincode ?? '');
  const [description, setDescription] = useState(listing.description ?? '');
  const [contact, setContact] = useState(listing.contactNumber ?? '');
  const [gender, setGender] = useState(listing.genderPolicy ?? '');
  const [food, setFood] = useState(Boolean(listing.foodIncluded));
  const [startingPrice, setStartingPrice] = useState(listing.startingPrice != null ? String(listing.startingPrice) : '');
  const [monthlyPrice, setMonthlyPrice] = useState(listing.monthlyPrice != null ? String(listing.monthlyPrice) : '');
  const [mealPrice, setMealPrice] = useState(listing.mealPrice != null ? String(listing.mealPrice) : '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    const price = (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return undefined;
      const parsed = Number(trimmed);
      return Number.isFinite(parsed) ? parsed : undefined;
    };
    try {
      if (listing.publication === 'LIVE' && listing.spaceId) {
        const body: ListingCatalogUpdate = {
          name: name.trim(),
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          description: description.trim(),
          genderPolicy: gender || undefined,
          foodIncludedInRent: food,
        };
        if (listing.publication === 'LIVE') {
          body.contactNumber = contact.trim();
        }
        if (mess) {
          const monthly = price(monthlyPrice);
          const meal = price(mealPrice);
          if (monthly != null) body.monthlyPrice = monthly;
          if (meal != null) body.mealPrice = meal;
        } else {
          const starting = price(startingPrice);
          if (starting != null) body.startingPrice = starting;
        }
        await updateLiveListing(listing.spaceId, body);
      } else if (listing.registrationId && mess) {
        await updateMessLead(listing.registrationId, {
          messName: name.trim(),
          addressLine: address.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          description: description.trim(),
          genderPolicy: gender || undefined,
          foodIncludedListing: food,
          monthlyPrice: price(monthlyPrice),
          mealPrice: price(mealPrice),
        });
      } else if (listing.registrationId) {
        await updatePropertyLead(listing.registrationId, {
          propertyName: name.trim(),
          addressLine: address.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          description: description.trim(),
          genderPolicy: gender || undefined,
          foodIncludedListing: food,
          startingPrice: price(startingPrice),
        });
      }
      await onSaved();
    } catch (err) {
      setError(err instanceof PublicApiError ? err.message : t('mySpaces.saveFailed'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className="mt-6 rounded-[24px] border border-black/5 bg-white p-5"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <h2 className="text-lg font-semibold text-navy">{t('mySpaces.edit')}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Field label={t('mySpaces.name')} value={name} onChange={setName} required />
        <Field label={t('mySpaces.address')} value={address} onChange={setAddress} />
        <Field label={t('mySpaces.city')} value={city} onChange={setCity} />
        <Field label={t('mySpaces.state')} value={state} onChange={setState} />
        <Field label={t('mySpaces.pincode')} value={pincode} onChange={setPincode} />
        {listing.publication === 'LIVE' ? (
          <Field label={t('mySpaces.contact')} value={contact} onChange={setContact} />
        ) : null}
        {mess ? (
          <>
            <Field label={t('mySpaces.monthlyPrice')} value={monthlyPrice} onChange={setMonthlyPrice} inputMode="decimal" />
            <Field label={t('mySpaces.mealPrice')} value={mealPrice} onChange={setMealPrice} inputMode="decimal" />
          </>
        ) : (
          <Field label={t('mySpaces.startingPrice')} value={startingPrice} onChange={setStartingPrice} inputMode="decimal" />
        )}
        <label className="block text-sm">
          <span className="font-medium text-navy">{t('mySpaces.gender')}</span>
          <select
            value={gender}
            onChange={(event) => setGender(event.target.value)}
            className="mt-1 h-11 w-full rounded-xl border border-black/10 bg-white px-3"
          >
            <option value="">—</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
            <option value="MIXED">MIXED</option>
          </select>
        </label>
        <label className="flex items-center gap-2 self-end text-sm font-medium text-navy">
          <input type="checkbox" checked={food} onChange={(event) => setFood(event.target.checked)} />
          {t('mySpaces.foodIncluded')}
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="font-medium text-navy">{t('mySpaces.description')}</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2"
          />
        </label>
      </div>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      <div className="mt-4 flex gap-2">
        <ActionButton type="submit" disabled={saving}>
          {t('mySpaces.save')}
        </ActionButton>
        <ActionButton variant="ghost" onClick={onClose} disabled={saving}>
          {t('mySpaces.cancel')}
        </ActionButton>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  inputMode?: 'decimal' | 'text';
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-navy">{label}</span>
      <input
        required={required}
        inputMode={inputMode}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-11 w-full rounded-xl border border-black/10 px-3"
      />
    </label>
  );
}

function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
        selected ? 'border-primary bg-primary text-white' : 'border-black/10 bg-white text-navy'
      }`}
    >
      {label}
    </button>
  );
}
