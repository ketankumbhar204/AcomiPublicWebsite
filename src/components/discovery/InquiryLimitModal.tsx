import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  Copy,
  Check,
  CreditCard,
  Headset,
  Image as ImageIcon,
  Loader2,
  Mail,
  Map,
  MessageCircle,
  X,
} from 'lucide-react';
import { ActionButton } from '../common/ActionButton';
import { API_BASE_URL } from '../../config/env';
import { getPublicAccessToken } from '../../lib/apiClient';
import { openAcomiAndroidApp } from '../../lib/openAcomiAndroidApp';
import {
  fetchInquiryPaymentConfig,
  fetchMyPurchaseRequests,
  createPurchaseRequest,
} from '../../auth/inquiryCreditsApi';
import type {
  InquiryPaymentConfig,
  InquiryCreditPackage,
  PurchaseRequest,
} from '../../auth/inquiryCreditsApi';
import { PublicApiError } from '../../lib/apiClient';

// ─── Props ────────────────────────────────────────────────────────────────

type InquiryLimitModalProps = {
  /** Called when the user wants to close / dismiss */
  onClose: () => void;
  /** Local-only quota reset. Omit in production. */
  onQuotaReset?: () => void;
  /** Paid wallet credits already on the account. */
  availableCredits?: number;
  /** Skip payment and use existing paid credits. */
  onContinueWithCredits?: () => void;
  /** Free enquiries already used today on the web channel. */
  freeUsedToday?: number;
  /** Lets the parent widen the dialog only while payment is showing. */
  onPaymentActive?: (active: boolean) => void;
  /** Map and photo requests stay closed until this purchase is approved. */
  purpose?: 'enquiry' | 'map' | 'photos';
  onPaymentConfirmed?: () => void;
};

// ─── Small helpers ────────────────────────────────────────────────────────

function firstEnabledPackage(
  config: InquiryPaymentConfig | null,
): InquiryCreditPackage | null {
  if (!config) return null;
  return (
    config.packages
      .filter((p) => p.enabled)
      .sort((a, b) => a.displayOrder - b.displayOrder)[0] ?? null
  );
}

function formatCurrency(amount: number, currency: string): string {
  if (currency === 'INR') {
    return `₹${amount}`;
  }
  return `${currency} ${amount}`;
}

function digitsOnly(raw: string): string {
  return raw.replace(/\D/g, '');
}

function customerInstruction(raw: string | null | undefined): string {
  const text = raw?.trim() ?? '';
  if (!text || /e2e local payment instructions/i.test(text)) return '';
  return text;
}

function isPrivateFileUrl(url: string): boolean {
  return url.startsWith('/') || /\/files\/[^/?#]+\/content(?:[?#]|$)/.test(url);
}

function isMobileBrowserNow(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  if (/Android|iPhone|iPad|iPod/i.test(ua)) return true;
  return window.matchMedia('(max-width: 767px)').matches;
}

function PlayMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path fill="currentColor" d="M8 5.2v13.6l11-6.8L8 5.2z" />
    </svg>
  );
}

function AndroidMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#3DDC84]" aria-hidden>
      <path
        fill="currentColor"
        d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.43 11.43 0 00-8.94 0L5.65 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L6.4 9.48A10.81 10.81 0 002 18h20a10.81 10.81 0 00-4.4-8.52zM7 15.25a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5zm10 0a1.25 1.25 0 110-2.5 1.25 1.25 0 010 2.5z"
      />
    </svg>
  );
}

// ─── Payment panel (sub-component) ───────────────────────────────────────

type PaymentPanelProps = {
  config: InquiryPaymentConfig;
  pkg: InquiryCreditPackage;
  onBack: () => void;
  onSuccess: (req: PurchaseRequest) => void;
};

function PaymentPanel({ config, pkg, onBack, onSuccess }: PaymentPanelProps) {
  const { t } = useTranslation();
  const [utr, setUtr] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upiCopied, setUpiCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const priceLabel = formatCurrency(Number(pkg.priceAmount), pkg.currency);
  const upiId = config.upiId?.trim() ?? '';
  const instructions = customerInstruction(config.instructions);
  const hasUpi = upiId.length > 0;
  const [qrSrc, setQrSrc] = useState<string | null>(null);
  const [qrState, setQrState] = useState<'none' | 'loading' | 'ready' | 'failed'>('none');
  const hasQr = qrState === 'ready' && Boolean(qrSrc);
  const canPay = hasQr || hasUpi || qrState === 'loading';

  useEffect(() => {
    if (!qrOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      setQrOpen(false);
    }
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [qrOpen]);

  useEffect(() => {
    const direct = config.qrUrl?.trim() ?? '';
    const fileId = config.qrFileId?.trim() ?? '';
    if (!direct && !fileId) {
      setQrSrc(null);
      setQrState('none');
      return;
    }
    if (direct && !isPrivateFileUrl(direct)) {
      setQrSrc(direct);
      setQrState('ready');
      return;
    }
    const id = fileId || direct.match(/\/files\/([^/?#]+)\/content/)?.[1] || '';
    if (!id) {
      setQrSrc(null);
      setQrState('failed');
      return;
    }
    let cancelled = false;
    let objectUrl: string | null = null;
    setQrState('loading');
    const token = getPublicAccessToken();
    void fetch(`${API_BASE_URL}/files/${id}/content`, {
      credentials: 'include',
      headers: {
        Accept: 'image/*',
        'X-ACOMI-CLIENT': 'WEB',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('qr');
        const blob = await response.blob();
        if (!blob.type.startsWith('image/') && blob.size < 32) throw new Error('qr');
        objectUrl = URL.createObjectURL(blob);
        if (cancelled) {
          URL.revokeObjectURL(objectUrl);
          return;
        }
        setQrSrc(objectUrl);
        setQrState('ready');
      })
      .catch(() => {
        if (!cancelled) {
          setQrSrc(null);
          setQrState('failed');
        }
      });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [config.qrFileId, config.qrUrl]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (busy || !canPay) return;
    setBusy(true);
    setError(null);
    try {
      const req = await createPurchaseRequest({
        packageId: pkg.id,
        utr: utr.trim() || undefined,
      });
      onSuccess(req);
    } catch (err) {
      setError(
        err instanceof PublicApiError
          ? err.message
          : t('discovery.limitPaymentSubmitError'),
      );
    } finally {
      setBusy(false);
    }
  }

  async function copyUpi() {
    if (!hasUpi) return;
    try {
      await navigator.clipboard.writeText(upiId);
      setUpiCopied(true);
      window.setTimeout(() => setUpiCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  }

  const waDigits = digitsOnly(config.whatsappNumber ?? '');
  const waFull = waDigits.length === 10 ? `91${waDigits}` : waDigits;
  const waHref = waFull
    ? `https://wa.me/${waFull}?text=${encodeURIComponent(
        t('discovery.limitWhatsappText', { amount: priceLabel, count: pkg.credits }),
      )}`
    : null;

  const sideBySide = hasQr && hasUpi;

  return (
    <div>
      <div className="px-1 text-center">
        <div className="mx-auto mb-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#E7F6EE] text-primary">
          <CreditCard aria-hidden className="h-4 w-4" />
        </div>
        <h2 id="enquire-title" className="text-[1.25rem] font-bold leading-tight tracking-tight text-navy">
          {t('discovery.limitPayTitle', { count: pkg.credits })}
        </h2>
        <p id="enquire-body" className="mx-auto mt-1 max-w-[36rem] text-[13px] leading-snug text-text-secondary">
          {t('discovery.limitPaySubtitle', { count: pkg.credits, amount: priceLabel })}
          <button
            type="button"
            onClick={() => openAcomiAndroidApp()}
            className="mt-0.5 block w-full text-center font-semibold text-primary underline decoration-2 underline-offset-2 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t('discovery.limitPayOrApp')}
          </button>
        </p>
      </div>

      {canPay ? (
        <div className="mt-3 rounded-2xl bg-[#E7F6EE] px-3 py-2.5 sm:px-3.5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[13px] font-semibold text-primary">{t('discovery.limitPayUsingUpi')}</p>
            <p className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[13px] font-bold text-navy shadow-sm">
              {t('discovery.limitPayAmount', { amount: priceLabel })}
            </p>
          </div>
          {instructions ? (
            <p className="mt-1 text-[12px] leading-snug text-text-secondary">{instructions}</p>
          ) : null}

          <div
            className={
              sideBySide
                ? 'mt-2 grid grid-cols-1 items-center gap-3 md:grid-cols-[auto_auto_minmax(0,1fr)] md:gap-4'
                : 'mt-2 space-y-2.5'
            }
          >
            {hasQr && qrSrc ? (
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setQrOpen(true)}
                  className="mx-auto inline-flex cursor-zoom-in rounded-xl bg-white p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={t('discovery.limitQrAlt')}
                >
                  <img
                    src={qrSrc}
                    alt=""
                    className="h-auto max-h-[168px] w-auto max-w-full bg-white object-contain md:max-h-[200px]"
                  />
                </button>
                <p className="mx-auto mt-1.5 max-w-[14rem] text-[11px] leading-snug text-text-secondary">
                  {t('discovery.limitPayScan')}
                </p>
              </div>
            ) : qrState === 'loading' ? (
              <div className="mx-auto h-[168px] w-[88px] animate-pulse rounded-xl bg-white md:h-[200px]" />
            ) : (
              <p className="text-center text-[13px] text-text-secondary">{t('discovery.limitPayQrUnavailable')}</p>
            )}

            {sideBySide ? (
              <p className="text-center text-[11px] font-semibold text-text-secondary md:px-1" aria-hidden>
                {t('discovery.limitPayOr')}
              </p>
            ) : null}

            <div className="min-w-0">
              {hasUpi ? (
                <>
                  <p className="text-[12px] font-semibold text-navy">{t('discovery.limitPayUpiLabel')}</p>
                  <div className="mt-1 flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-1.5">
                    <span className="min-w-0 flex-1 break-all text-[13px] font-medium text-navy">{upiId}</span>
                    <button
                      type="button"
                      onClick={() => void copyUpi()}
                      aria-label={upiCopied ? t('discovery.limitPayCopied') : t('discovery.limitCopyUpi')}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg p-1.5 text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      {upiCopied ? <Check aria-hidden className="h-4 w-4" /> : <Copy aria-hidden className="h-4 w-4" />}
                      {upiCopied ? <span className="text-[11px] font-semibold">{t('discovery.limitPayCopied')}</span> : null}
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-[13px] text-text-secondary">{t('discovery.limitPayUpiUnavailable')}</p>
              )}

              {waHref ? (
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-primary bg-white px-3 py-2 text-[13px] font-semibold text-primary hover:bg-[#F3FBF7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <MessageCircle aria-hidden className="h-4 w-4 shrink-0" />
                  <span className="truncate">{t('discovery.limitWhatsappCta')}</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-3 rounded-2xl bg-[#F4F7F5] px-4 py-3 text-center text-[13px] text-text-secondary" role="status">
          {t('discovery.limitPayUnavailableBoth')}
        </p>
      )}

      {canPay ? (
        <form onSubmit={(event) => void handleSubmit(event)} className="mt-3">
          <label className="block text-[13px] font-semibold text-navy">
            {t('discovery.limitPayReference')}{' '}
            <span className="font-normal text-text-secondary">{t('discovery.limitPayReferenceOptional')}</span>
            <input
              className="mt-1 w-full rounded-xl border border-black/10 px-3 py-2 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-soft disabled:opacity-70"
              type="text"
              value={utr}
              disabled={busy}
              placeholder={t('discovery.limitUtrPlaceholder')}
              onChange={(event) => setUtr(event.target.value)}
            />
          </label>
          {error ? (
            <p className="mt-2 rounded-xl bg-red-50 px-3 py-2 text-[13px] text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <ActionButton type="submit" disabled={busy} className="mt-2.5 w-full !rounded-full !py-2.5">
            {busy ? t('auth.pleaseWait') : t('discovery.limitPaymentSubmit')}
          </ActionButton>
        </form>
      ) : null}

      <button
        type="button"
        onClick={onBack}
        disabled={busy}
        className="mt-2 w-full rounded-full border border-black/10 py-2 text-[15px] font-semibold text-primary hover:bg-soft disabled:opacity-60"
      >
        {t('discovery.enquireBack')}
      </button>

      {qrOpen && qrSrc
        ? createPortal(
            <div
              className="fixed inset-0 z-[140] flex items-center justify-center bg-ink/70 p-4"
              role="dialog"
              aria-modal="true"
              aria-label={t('discovery.limitQrAlt')}
              onClick={() => setQrOpen(false)}
            >
              <button
                type="button"
                onClick={() => setQrOpen(false)}
                aria-label={t('common.close', { defaultValue: 'Close' })}
                className="absolute top-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-navy"
              >
                <X aria-hidden className="h-4 w-4" />
              </button>
              <img
                src={qrSrc}
                alt={t('discovery.limitQrAlt')}
                className="max-h-[90vh] w-auto max-w-[min(420px,calc(100vw-32px))] bg-white object-contain"
                onClick={(event) => event.stopPropagation()}
              />
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────

export function InquiryLimitModal({
  onClose,
  onQuotaReset,
  availableCredits = 0,
  onContinueWithCredits,
  onPaymentActive,
  purpose = 'enquiry',
  onPaymentConfirmed,
}: InquiryLimitModalProps) {
  const { t } = useTranslation();
  const confirmedRef = useRef(false);
  const [purchaseRejected, setPurchaseRejected] = useState(false);

  const [mobileBrowser, setMobileBrowser] = useState(isMobileBrowserNow);
  const [choice, setChoice] = useState<'credits' | 'app'>(() =>
    isMobileBrowserNow() ? 'app' : 'credits',
  );
  const [paymentExpanded, setPaymentExpanded] = useState(false);

  const [config, setConfig] = useState<InquiryPaymentConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [configError, setConfigError] = useState(false);

  const [purchaseDone, setPurchaseDone] = useState<PurchaseRequest | null>(null);

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px)');
    const update = () => setMobileBrowser(isMobileBrowserNow());
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  // Prefetch payment config so package price is dynamic on the credit card.
  useEffect(() => {
    if (config !== null || configLoading) return;
    setConfigLoading(true);
    setConfigError(false);
    fetchInquiryPaymentConfig()
      .then((c) => setConfig(c))
      .catch(() => setConfigError(true))
      .finally(() => setConfigLoading(false));
  }, [config, configLoading]);

  useEffect(() => {
    if (!purchaseDone || purpose === 'enquiry' || !onPaymentConfirmed) return undefined;
    let cancelled = false;
    const check = async () => {
      try {
        const rows = await fetchMyPurchaseRequests();
        const row = rows.find((item) => item.id === purchaseDone.id);
        if (cancelled || !row || confirmedRef.current) return;
        if (row.status === 'APPROVED') {
          confirmedRef.current = true;
          onPaymentConfirmed();
          return;
        }
        if (row.status === 'REJECTED') setPurchaseRejected(true);
      } catch {
        // Keep checking until the payment is confirmed.
      }
    };
    void check();
    const timer = window.setInterval(() => void check(), 4000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [onPaymentConfirmed, purchaseDone, purpose]);

  const pkg = firstEnabledPackage(config);
  const paymentAvailable = config !== null && config.enabled && pkg !== null;
  const creditCount = pkg?.credits;
  const priceLabel = pkg ? formatCurrency(Number(pkg.priceAmount), pkg.currency) : null;
  const offerReady = creditCount != null && priceLabel != null;
  const activeChoice = mobileBrowser ? choice : 'credits';
  const helpDigits = digitsOnly(config?.whatsappNumber ?? '');
  const helpNumber = helpDigits.length === 10 ? `91${helpDigits}` : helpDigits;
  const helpHref = helpNumber
    ? `https://wa.me/${helpNumber}?text=${encodeURIComponent(t('discovery.limitHelpText'))}`
    : null;

  function continueChoice() {
    if (activeChoice === 'app') {
      openAcomiAndroidApp();
      return;
    }
    setPaymentExpanded(true);
    onPaymentActive?.(true);
  }

  function leavePayment() {
    setPaymentExpanded(false);
    onPaymentActive?.(false);
  }

  return (
    <div className="relative flex flex-col">
      <button
        type="button"
        onClick={onClose}
        aria-label={t('common.close', { defaultValue: 'Close' })}
        className="absolute -top-1 -right-1 inline-flex h-8 w-8 items-center justify-center rounded-full text-text-secondary hover:bg-soft"
      >
        <X aria-hidden className="h-4 w-4" />
      </button>

      {paymentExpanded ? (
        configLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 aria-hidden className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : purchaseDone ? (
          <div className="px-1 py-4 text-center">
            <h2 id="enquire-title" className="text-[1.25rem] font-bold text-navy">
              {purchaseRejected
                ? t('discovery.limitPayRejectedTitle')
                : t('discovery.limitPaySuccessTitle')}
            </h2>
            <p id="enquire-body" className="mt-2 text-[14px] text-text-secondary">
              {purchaseRejected
                ? t('discovery.limitPayRejectedBody')
                : purpose === 'map'
                  ? t('discovery.limitMapPendingBody')
                  : purpose === 'photos'
                    ? t('discovery.limitPhotosPendingBody')
                    : t('discovery.limitPaySuccessBody')}
            </p>
            {purpose !== 'enquiry' && !purchaseRejected ? (
              <p className="mt-3 inline-flex items-center justify-center gap-2 text-[13px] font-semibold text-primary">
                <Loader2 aria-hidden className="h-4 w-4 animate-spin" />
                {t('auth.pleaseWait')}
              </p>
            ) : (
              <ActionButton className="mt-5 w-full !rounded-full" onClick={onClose}>
                {t('discovery.enquireDone')}
              </ActionButton>
            )}
          </div>
        ) : configError || !paymentAvailable || !config || !pkg ? (
          <div className="px-1 py-4 text-center">
            <p className="text-[14px] text-text-secondary">{t('discovery.limitPayUnavailableBoth')}</p>
            <button
              type="button"
              onClick={leavePayment}
              className="mt-4 w-full rounded-full border border-black/10 py-2.5 text-[15px] font-semibold text-primary hover:bg-soft"
            >
              {t('discovery.enquireBack')}
            </button>
          </div>
        ) : (
          <PaymentPanel
            config={config}
            pkg={pkg}
            onBack={leavePayment}
            onSuccess={(req) => {
              confirmedRef.current = false;
              setPurchaseRejected(false);
              setPurchaseDone(req);
            }}
          />
        )
      ) : (
        <>
      <div className="px-1 text-center">
        <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#E7F6EE] text-primary">
          {purpose === 'map' ? (
            <Map aria-hidden className="h-5 w-5" />
          ) : purpose === 'photos' ? (
            <ImageIcon aria-hidden className="h-5 w-5" />
          ) : (
            <Mail aria-hidden className="h-5 w-5" />
          )}
        </div>
        <h2 id="enquire-title" className="text-[1.35rem] font-bold tracking-tight text-navy">
          {purpose === 'map'
            ? t('discovery.limitMapTitle')
            : purpose === 'photos'
              ? t('discovery.limitPhotosTitle')
              : t('discovery.limitUsedTodayTitle')}
        </h2>
        <p
          id="enquire-body"
          className="mx-auto mt-3 max-w-[22rem] rounded-xl border border-primary/25 bg-[#E7F6EE] px-3 py-2 text-[14px] font-semibold leading-snug text-primary"
        >
          {purpose === 'map' ? (
            t('discovery.limitMapBody')
          ) : purpose === 'photos' ? (
            t('discovery.limitPhotosBody')
          ) : mobileBrowser ? (
            t('discovery.limitMobileBody')
          ) : (
            <>
              {t('discovery.limitDesktopBodyLead')}
              <br />
              {t('discovery.limitDesktopBodyTail')}
            </>
          )}
        </p>
      </div>

          <div className="mt-5 space-y-2.5" role="radiogroup" aria-label={t('discovery.limitUsedTodayTitle')}>
            {mobileBrowser ? (
              <button
                type="button"
                role="radio"
                aria-checked={choice === 'app'}
                onClick={() => setChoice('app')}
                className={`flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left ${
                  choice === 'app' ? 'border-primary bg-[#F3FBF7]' : 'border-black/10 bg-white'
                }`}
              >
                <span
                  aria-hidden
                  className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    choice === 'app' ? 'border-primary' : 'border-black/25'
                  }`}
                >
                  {choice === 'app' ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
                </span>
                <AndroidMark />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-[15px] font-semibold text-navy">
                      {t('discovery.limitUnlimitedTitle')}
                    </span>
                    <span className="shrink-0 rounded-full bg-[#D8F3E4] px-2 py-0.5 text-[11px] font-semibold text-[#0F6B4C]">
                      {t('discovery.enquireRecommended')}
                    </span>
                  </span>
                  <span className="mt-0.5 block text-[13px] leading-snug text-text-secondary">
                    {t('discovery.limitUnlimitedBody')}
                  </span>
                </span>
              </button>
            ) : null}

            <button
              type="button"
              role="radio"
              aria-checked={!mobileBrowser || choice === 'credits'}
              onClick={() => setChoice('credits')}
              className={`flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left ${
                !mobileBrowser || choice === 'credits'
                  ? 'border-primary bg-[#F3FBF7]'
                  : 'border-black/10 bg-white'
              }`}
            >
              <span
                aria-hidden
                className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  !mobileBrowser || choice === 'credits' ? 'border-primary' : 'border-black/25'
                }`}
              >
                {!mobileBrowser || choice === 'credits' ? (
                  <span className="h-2 w-2 rounded-full bg-primary" />
                ) : null}
              </span>
              <Mail aria-hidden className="h-5 w-5 shrink-0 text-primary" />
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-navy">
                  {offerReady
                    ? t('discovery.limitPackageTitle', { count: creditCount, amount: priceLabel })
                    : configLoading
                      ? t('auth.pleaseWait')
                      : t('discovery.enquireEmailCtaExhaustedPending')}
                </span>
                <span className="mt-0.5 block text-[13px] leading-snug text-text-secondary">
                  {offerReady
                    ? purpose === 'map'
                      ? t('discovery.limitPackageBodyMap', { count: creditCount })
                      : purpose === 'photos'
                        ? t('discovery.limitPackageBodyPhotos', { count: creditCount })
                        : t('discovery.limitPackageBody', { count: creditCount })
                    : configError
                      ? t('discovery.limitPaymentUnavailable')
                      : null}
                </span>
              </span>
            </button>
          </div>

          <ActionButton
            className="mt-4 w-full !rounded-full !py-3"
            onClick={continueChoice}
            disabled={activeChoice === 'credits' && (configLoading || !offerReady)}
          >
            <span className="inline-flex items-center justify-center gap-2">
              {activeChoice === 'app' ? <PlayMark /> : null}
              {activeChoice === 'credits'
                ? offerReady
                  ? t('discovery.limitGetCreditsCta', { count: creditCount, amount: priceLabel })
                  : t('auth.pleaseWait')
                : t('discovery.limitGetAppCta')}
              <ArrowRight aria-hidden className="h-4 w-4" />
            </span>
          </ActionButton>
          <button
            type="button"
            onClick={onClose}
            className="mt-2.5 w-full rounded-full border border-black/10 py-2.5 text-[15px] font-semibold text-primary hover:bg-soft"
          >
            {t('discovery.limitNotNow')}
          </button>
          {purpose === 'enquiry' && availableCredits > 0 && onContinueWithCredits ? (
            <button
              type="button"
              onClick={onContinueWithCredits}
              className="mt-2 w-full text-center text-[13px] font-semibold text-primary"
            >
              {t('discovery.limitContinueWithCredits', { count: availableCredits })}
            </button>
          ) : null}
          {helpHref ? (
            <a
              href={helpHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-1.5 text-[13px] font-semibold text-primary"
            >
              <Headset aria-hidden className="h-4 w-4" />
              {t('discovery.limitNeedHelp')}
            </a>
          ) : (
            <p className="mt-4 flex w-full items-center justify-center gap-1.5 text-[13px] font-semibold text-primary">
              <Headset aria-hidden className="h-4 w-4" />
              {t('discovery.limitNeedHelp')}
            </p>
          )}
          {onQuotaReset ? (
            <ActionButton variant="ghost" onClick={onQuotaReset} className="mt-2 w-full">
              {t('discovery.limitResetQuota')}
            </ActionButton>
          ) : null}
        </>
      )}
    </div>
  );
}
