import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { isSafeEnquiryId, listMyEnquiries } from '../auth/inboxApi';
import type { SpaceEnquiryResponse } from '../auth/types';
import { RequireAuth } from '../components/auth/RequireAuth';
import { EnquireDialog } from '../components/discovery/EnquireDialog';
import { EnquiryPlaceCard } from '../components/discovery/EnquiryPlaceCard';
import { EnquiryStatusDialog } from '../components/discovery/EnquiryStatusDialog';
import { Container } from '../components/layout/Container';
import { applySeo } from '../lib/seo';

const PAGE_SIZE = 6;
const SUPPORT_MAIL = 'mailto:support@acomi.in';

type FilterId = 'ALL' | 'SHARED' | 'PENDING' | 'EXPIRED' | 'REJECTED';

function matchesFilter(status: string, filter: FilterId): boolean {
  if (filter === 'ALL') return true;
  if (filter === 'REJECTED') return status === 'REJECTED' || status === 'CANCELLED';
  return status === filter;
}

export function MyEnquiriesPage() {
  return (
    <RequireAuth>
      <MyEnquiriesView />
    </RequireAuth>
  );
}

function MyEnquiriesView() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const highlightId = isSafeEnquiryId(params.get('id')) ? params.get('id') : null;
  const [rows, setRows] = useState<SpaceEnquiryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterId>('ALL');
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [page, setPage] = useState(1);

  const [statusEnquiry, setStatusEnquiry] = useState<SpaceEnquiryResponse | null>(null);
  const [reEnquire, setReEnquire] = useState<SpaceEnquiryResponse | null>(null);
  const openedHighlight = useRef<string | null>(null);

  useEffect(() => {
    applySeo({
      title: t('enquiries.title'),
      description: t('enquiries.subtitle'),
      path: '/my-enquiries',
    });
  }, [t]);

  const load = useCallback(async (opts?: { silent?: boolean }) => {
    if (!opts?.silent) setLoading(true);
    try {
      const result = await listMyEnquiries(0, 50);
      setRows(result.content ?? []);
    } finally {
      if (!opts?.silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const counts = useMemo(
    () => ({
      ALL: rows.length,
      SHARED: rows.filter((row) => row.status === 'SHARED').length,
      PENDING: rows.filter((row) => row.status === 'PENDING').length,
      EXPIRED: rows.filter((row) => row.status === 'EXPIRED').length,
      REJECTED: rows.filter((row) => row.status === 'REJECTED' || row.status === 'CANCELLED').length,
    }),
    [rows],
  );

  const filtered = useMemo(() => {
    const next = rows.filter((row) => matchesFilter(row.status, filter));
    next.sort((a, b) => {
      const aTime = a.requestedAt ? new Date(a.requestedAt).getTime() : 0;
      const bTime = b.requestedAt ? new Date(b.requestedAt).getTime() : 0;
      return sort === 'newest' ? bTime - aTime : aTime - bTime;
    });
    return next;
  }, [filter, rows, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [filter, sort]);

  useEffect(() => {
    if (!highlightId || loading) return;
    const match = rows.find((row) => row.enquiryId === highlightId);
    if (!match || openedHighlight.current === highlightId) return;
    openedHighlight.current = highlightId;
    document.getElementById(`enquiry-${highlightId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setStatusEnquiry(match);
  }, [highlightId, loading, rows]);

  const filters: { id: FilterId; label: string; count: number }[] = [
    { id: 'ALL', label: t('enquiries.filterAll'), count: counts.ALL },
    { id: 'SHARED', label: t('enquiries.filterShared'), count: counts.SHARED },
    { id: 'PENDING', label: t('enquiries.filterPending'), count: counts.PENDING },
    { id: 'EXPIRED', label: t('enquiries.filterExpired'), count: counts.EXPIRED },
    { id: 'REJECTED', label: t('enquiries.filterRejected'), count: counts.REJECTED },
  ];

  return (
    <Container className="py-8 sm:py-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <h1 className="text-2xl font-semibold tracking-tight text-navy sm:text-[28px]">{t('enquiries.title')}</h1>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">{t('enquiries.subtitle')}</p>
        </div>
        <aside className="w-full max-w-md rounded-2xl bg-[#E7F6EE] px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex gap-3">
            <Info aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="text-[13px] leading-relaxed text-navy">
              <p className="font-semibold">{t('enquiries.helpTitle')}</p>
              <p className="mt-1 text-text-secondary">
                {t('enquiries.helpBody')}{' '}
                <a className="font-semibold text-primary underline decoration-primary/30 underline-offset-2" href={SUPPORT_MAIL}>
                  {t('enquiries.helpSupport')}
                </a>
                .
              </p>
            </div>
          </div>
        </aside>
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-text-secondary">{t('auth.pleaseWait')}</p>
      ) : rows.length === 0 ? (
        <div className="mt-10">
          <p className="text-sm text-text-secondary">{t('enquiries.empty')}</p>
          <Link to="/places" className="mt-4 inline-block text-sm font-semibold text-primary">
            {t('places.title')}
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((item) => {
                const selected = filter === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilter(item.id)}
                    className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${
                      selected
                        ? 'bg-primary text-white'
                        : 'bg-white text-navy ring-1 ring-border hover:bg-soft'
                    }`}
                  >
                    {item.label} ({item.count})
                  </button>
                );
              })}
            </div>
            <label className="flex items-center gap-2 text-[13px] text-text-secondary">
              {t('enquiries.sortBy')}
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value === 'oldest' ? 'oldest' : 'newest')}
                className="rounded-full border border-border bg-white px-3 py-1.5 text-[13px] font-semibold text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="newest">{t('enquiries.sortNewest')}</option>
                <option value="oldest">{t('enquiries.sortOldest')}</option>
              </select>
            </label>
          </div>

          {filtered.length === 0 ? (
            <p className="mt-8 text-sm text-text-secondary">{t('enquiries.emptyFilter')}</p>
          ) : (
            <>
              <ul className="mt-5 grid gap-4 md:grid-cols-2">
                {visible.map((row) => (
                  <li key={row.enquiryId}>
                    <EnquiryPlaceCard
                      enquiry={row}
                      active={highlightId === row.enquiryId}
                      onOpen={setStatusEnquiry}
                    />
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[13px] text-text-secondary">
                  {t('enquiries.showing', { count: filtered.length })}
                </p>
                {pageCount > 1 ? (
                  <nav className="flex items-center gap-2" aria-label={t('discovery.pagesNav')}>
                    <button
                      type="button"
                      disabled={safePage <= 1}
                      onClick={() => setPage(safePage - 1)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-navy disabled:opacity-40"
                      aria-label={t('discovery.previousPage', { defaultValue: 'Previous page' })}
                    >
                      <ChevronLeft aria-hidden className="h-4 w-4" />
                    </button>
                    <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-lg bg-primary px-3 text-[13px] font-semibold text-white">
                      {safePage}
                    </span>
                    <button
                      type="button"
                      disabled={safePage >= pageCount}
                      onClick={() => setPage(safePage + 1)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-navy disabled:opacity-40"
                      aria-label={t('discovery.nextPage', { defaultValue: 'Next page' })}
                    >
                      <ChevronRight aria-hidden className="h-4 w-4" />
                    </button>
                  </nav>
                ) : null}
              </div>
            </>
          )}
        </>
      )}

      <EnquiryStatusDialog
        enquiry={statusEnquiry}
        onClose={() => setStatusEnquiry(null)}
        onEnquireAgain={(enquiry) => {
          setStatusEnquiry(null);
          setReEnquire(enquiry);
        }}
      />
      <EnquireDialog
        open={reEnquire != null}
        listingId={reEnquire?.spaceId ?? ''}
        listingName={reEnquire?.spaceName ?? ''}
        listingKind={reEnquire?.spaceType === 'MESS' ? 'mess' : 'places'}
        onClose={() => {
          setReEnquire(null);
          void load({ silent: true });
        }}
      />
    </Container>
  );
}
