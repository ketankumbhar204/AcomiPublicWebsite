import { useEffect, useState } from 'react';
import { ExternalLink, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { enquiryInbox, listReceivedEnquiries } from '../auth/inboxApi';
import type { EnquiryInboxListing, ReceivedEnquiry } from '../auth/types';
import { RequireAuth } from '../components/auth/RequireAuth';
import { BUTTON_BASE, BUTTON_VARIANTS } from '../components/common/ButtonLink';
import { Container } from '../components/layout/Container';
import { openAcomiAndroidApp } from '../lib/openAcomiAndroidApp';
import { applySeo } from '../lib/seo';

/**
 * Public site never lists enquiry details. Direct /my-enquiries visits
 * (bookmarks, old links) get the same Android app download prompt.
 */
export function MyEnquiriesPage() {
  return (
    <RequireAuth>
      <EnquiryInboxGate />
    </RequireAuth>
  );
}

function EnquiryInboxGate() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const [mode, setMode] = useState<'loading' | 'mine' | 'received' | 'error'>('loading');
  const [listings, setListings] = useState<EnquiryInboxListing[]>([]);

  useEffect(() => {
    let cancelled = false;
    void enquiryInbox()
      .then((inbox) => {
        if (cancelled) return;
        setListings(inbox.listings ?? []);
        setMode(inbox.mode === 'RECEIVED' ? 'received' : 'mine');
      })
      .catch(() => {
        if (!cancelled) setMode('error');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (mode === 'loading') {
    return <Container className="py-10 text-sm text-text-secondary">{t('auth.pleaseWait')}</Container>;
  }
  if (mode === 'error') {
    return (
      <Container className="py-10 text-sm text-text-secondary">
        {t('discovery.photoRequestUnavailable', { defaultValue: 'Enquiries could not be loaded.' })}
      </Container>
    );
  }
  if (mode === 'received') {
    return <ReceivedEnquiries listings={listings} highlightId={params.get('id')} />;
  }
  return <MyEnquiriesAppOnlyView />;
}

function ReceivedEnquiries({
  listings,
  highlightId,
}: {
  listings: EnquiryInboxListing[];
  highlightId: string | null;
}) {
  const { t } = useTranslation();
  const [rows, setRows] = useState<ReceivedEnquiry[]>([]);
  const [status, setStatus] = useState('');
  const [spaceId, setSpaceId] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState(highlightId);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(false);
    void listReceivedEnquiries({
      spaceId: spaceId || undefined,
      status: status || undefined,
      from: from || undefined,
      to: to || undefined,
      size: 50,
    })
      .then((page) => {
        if (!cancelled) setRows(page.content ?? []);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [from, spaceId, status, to]);

  const selected = rows.find((row) => row.enquiryId === selectedId) ?? null;
  const listingPath = (row: ReceivedEnquiry) =>
    row.spaceType === 'MESS' ? `/meals/${row.spaceId}` : `/places/${row.spaceId}`;

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-semibold text-navy">
        {t('spaces.enquiries.receivedTitle', { defaultValue: 'Enquiries received' })}
      </h1>
      <p className="mt-1 text-sm text-text-secondary">
        {t('spaces.enquiries.receivedSubtitle', {
          defaultValue: 'Enquiries members sent for listings you own or manage.',
        })}
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <select
          value={spaceId}
          onChange={(event) => setSpaceId(event.target.value)}
          className="rounded-xl border border-border px-3 py-2 text-sm"
          aria-label={t('spaces.enquiries.filterListing', { defaultValue: 'Listing' })}
        >
          <option value="">{t('spaces.enquiries.filterAllListings', { defaultValue: 'All listings' })}</option>
          {listings.map((listing) => (
            <option key={listing.spaceId} value={listing.spaceId}>
              {listing.name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-xl border border-border px-3 py-2 text-sm"
          aria-label={t('spaces.enquiries.filterStatus', { defaultValue: 'Status' })}
        >
          <option value="">{t('spaces.enquiries.filterAllStatuses', { defaultValue: 'All statuses' })}</option>
          {['PENDING', 'SHARED', 'EXPIRED', 'REJECTED', 'CANCELLED'].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} className="rounded-xl border border-border px-3 py-2 text-sm" aria-label="From" />
        <input type="date" value={to} onChange={(event) => setTo(event.target.value)} className="rounded-xl border border-border px-3 py-2 text-sm" aria-label="To" />
      </div>
      {loading ? <p className="mt-6 text-sm text-text-secondary">{t('auth.pleaseWait')}</p> : null}
      {error ? (
        <p className="mt-6 text-sm text-text-secondary">
          {t('spaces.enquiries.receivedError', {
            defaultValue: 'Enquiries could not be loaded. You can only see listings you own or manage.',
          })}
        </p>
      ) : null}
      {!loading && !error && rows.length === 0 ? (
        <p className="mt-6 text-sm text-text-secondary">
          {t('spaces.enquiries.receivedEmpty', {
            defaultValue: 'When a member enquires about one of your listings, it will show up here.',
          })}
        </p>
      ) : null}
      <ul className="mt-4 space-y-3">
        {rows.map((row) => (
          <li key={row.enquiryId}>
            <button
              type="button"
              onClick={() => setSelectedId(row.enquiryId)}
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-left"
            >
              <span className="block font-semibold text-navy">{row.requesterName || 'Member'}</span>
              <span className="block text-sm text-text-secondary">
                {row.spaceName}
                {row.spaceType ? ` · ${row.spaceType}` : ''} · {row.status}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {selected ? (
        <div className="mt-4 rounded-2xl border border-border bg-white p-4">
          <p className="font-semibold text-navy">{selected.requesterName}</p>
          <p className="text-sm text-text-secondary">{selected.locationLabel}</p>
          <p className="mt-1 text-sm font-semibold text-navy">{selected.status}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {selected.requesterMobile ? (
              <a className="rounded-full bg-primary px-3 py-2 text-sm font-semibold text-white" href={`tel:${selected.requesterMobile}`}>
                Call
              </a>
            ) : null}
            {selected.requesterEmail ? (
              <a className="rounded-full border border-border px-3 py-2 text-sm font-semibold text-navy" href={`mailto:${selected.requesterEmail}`}>
                Email
              </a>
            ) : null}
            <Link className="rounded-full border border-border px-3 py-2 text-sm font-semibold text-navy" to={listingPath(selected)}>
              Open listing
            </Link>
          </div>
        </div>
      ) : null}
    </Container>
  );
}

function MyEnquiriesAppOnlyView() {
  const { t } = useTranslation();

  useEffect(() => {
    applySeo({
      title: t('enquiries.title'),
      description: t('enquiries.appOnlyBody'),
      path: '/my-enquiries',
    });
  }, [t]);

  return (
    <Container className="py-10">
      <div className="mx-auto max-w-lg rounded-[24px] border border-border bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-center text-2xl font-semibold tracking-tight text-navy">
          {t('enquiries.appOnlyTitle')}
        </h1>
        <p className="mt-2 text-center text-[14px] text-text-secondary">{t('enquiries.appOnlyBody')}</p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => openAcomiAndroidApp()}
            className="flex w-full items-center gap-3 rounded-2xl border border-primary/25 bg-[#E7F6EE] px-3.5 py-3 text-left transition hover:border-primary/50"
          >
            <span className="shrink-0 text-primary">
              <Smartphone className="h-5 w-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-semibold text-navy">
                {t('discovery.enquireOpenApp')}
              </span>
              <span className="block text-[12px] text-text-secondary">
                {t('discovery.enquireAppHint')}
              </span>
            </span>
            <ExternalLink className="h-4 w-4 shrink-0 text-primary/70" aria-hidden />
          </button>

          <div className="rounded-2xl border border-primary/20 bg-[#E7F6EE] px-4 py-3.5 text-center">
            <p className="text-[15px] font-bold leading-snug tracking-tight text-navy">
              {t('discovery.enquireAppPromoTitle')}
            </p>
            <p className="mt-1.5 text-[12px] leading-snug text-text-secondary">
              {t('discovery.enquireAppPromoBody')}
            </p>
          </div>
        </div>

        <Link to="/places" className={`${BUTTON_BASE} ${BUTTON_VARIANTS.ghost} mt-5 w-full`}>
          {t('enquiries.appOnlyBrowse')}
        </Link>
      </div>
    </Container>
  );
}
