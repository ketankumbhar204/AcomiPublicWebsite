import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  Copy,
  Check,
  CreditCard,
  Loader2,
  MessageCircle,
  Smartphone,
} from 'lucide-react';
import { ActionButton } from '../common/ActionButton';
import { openAcomiAndroidApp } from '../../lib/openAcomiAndroidApp';
import {
  fetchInquiryPaymentConfig,
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

// ─── Payment panel (sub-component) ───────────────────────────────────────

type PaymentPanelProps = {
  config: InquiryPaymentConfig;
  pkg: InquiryCreditPackage;
  onSuccess: (req: PurchaseRequest) => void;
};

function PaymentPanel({ config, pkg, onSuccess }: PaymentPanelProps) {
  const { t } = useTranslation();
  const [utr, setUtr] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upiCopied, setUpiCopied] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;
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
    if (!config.upiId) return;
    try {
      await navigator.clipboard.writeText(config.upiId);
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    } catch {
      // clipboard unavailable — silently ignore
    }
  }

  const whatsappText = encodeURIComponent(
    t('discovery.limitWhatsappText', {
      package: pkg.name,
      amount: formatCurrency(pkg.priceAmount, pkg.currency),
    }),
  );
  const waHref = config.whatsappNumber
    ? `https://wa.me/${digitsOnly(config.whatsappNumber)}?text=${whatsappText}`
    : null;

  return (
    <div className="mt-4 rounded-2xl border border-primary/20 bg-[#E7F6EE] px-4 py-4">
      {/* Package summary */}
      <p className="text-[14px] font-semibold text-navy">
        {pkg.name} &mdash;{' '}
        {formatCurrency(pkg.priceAmount, pkg.currency)}{' '}
        <span className="font-normal text-text-secondary">
          ({pkg.credits} {t('discovery.limitCreditsUnit')})
        </span>
      </p>

      {/* Instructions */}
      {config.instructions ? (
        <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
          {config.instructions}
        </p>
      ) : null}

      {/* QR code */}
      {config.qrUrl ? (
        <div className="mt-3 flex justify-center">
          <img
            src={config.qrUrl}
            alt={t('discovery.limitQrAlt')}
            className="h-40 w-40 rounded-xl border border-black/10 object-contain bg-white p-1"
          />
        </div>
      ) : null}

      {/* UPI ID */}
      {config.upiId ? (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2.5">
          <span className="flex-1 text-[13px] font-medium text-navy break-all">
            {config.upiId}
          </span>
          <button
            type="button"
            onClick={() => void copyUpi()}
            aria-label={t('discovery.limitCopyUpi')}
            className="shrink-0 rounded-lg p-1.5 text-primary hover:bg-primary/10"
          >
            {upiCopied ? (
              <Check aria-hidden className="h-4 w-4" />
            ) : (
              <Copy aria-hidden className="h-4 w-4" />
            )}
          </button>
        </div>
      ) : null}

      {/* WhatsApp button */}
      {waHref ? (
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1ebe5d]"
        >
          <MessageCircle aria-hidden className="h-4 w-4" />
          {t('discovery.limitWhatsappCta')}
        </a>
      ) : null}

      {/* UTR input */}
      <form onSubmit={(e) => void handleSubmit(e)} className="mt-3 space-y-3">
        <label className="block text-[13px] font-medium text-navy">
          {t('discovery.limitUtrLabel')}
          <input
            className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-soft disabled:opacity-70"
            type="text"
            value={utr}
            disabled={busy}
            placeholder={t('discovery.limitUtrPlaceholder')}
            onChange={(e) => setUtr(e.target.value)}
          />
        </label>

        {error ? (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-[13px] text-red-700" role="alert">
            {error}
          </p>
        ) : null}

        <ActionButton type="submit" disabled={busy} className="w-full">
          {busy ? t('auth.pleaseWait') : t('discovery.limitPaymentSubmit')}
        </ActionButton>
      </form>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────

export function InquiryLimitModal({ onClose }: InquiryLimitModalProps) {
  const { t } = useTranslation();

  const [paymentExpanded, setPaymentExpanded] = useState(false);

  const [config, setConfig] = useState<InquiryPaymentConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [configError, setConfigError] = useState(false);

  const [purchaseDone, setPurchaseDone] = useState<PurchaseRequest | null>(null);

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

  const pkg = firstEnabledPackage(config);
  const paymentAvailable =
    config !== null && config.enabled && pkg !== null;

  return (
    <div className="flex flex-col gap-0">
      <div className="text-center px-1 pb-1">
        <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-coral">
          <AlertCircle aria-hidden className="h-6 w-6" />
        </div>
        <h2
          id="enquire-title"
          className="text-xl font-semibold tracking-tight text-navy"
        >
          {t('discovery.limitTitle')}
        </h2>
        <p
          id="enquire-body"
          className="mt-1.5 text-[14px] text-text-secondary"
        >
          {t('discovery.limitBody')}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => openAcomiAndroidApp()}
          className="rounded-2xl border border-primary/25 bg-[#E7F6EE] px-3.5 py-3 text-left transition hover:border-primary/50"
        >
          <Smartphone aria-hidden className="h-5 w-5 text-primary" />
          <p className="mt-2 text-[13px] font-semibold text-navy">{t('discovery.limitAndroidCta')}</p>
          <p className="mt-0.5 text-[12px] text-text-secondary">{t('discovery.limitAndroidNote')}</p>
        </button>

        <button
          type="button"
          className="rounded-2xl border border-coral/30 bg-red-50 px-3.5 py-3 text-left transition hover:border-coral/50"
          onClick={() => {
            setPaymentExpanded(true);
          }}
        >
          <CreditCard aria-hidden className="h-5 w-5 text-coral" />
          <p className="mt-2 text-[13px] font-semibold text-navy">
            {config && pkg
              ? t('discovery.limitCreditsCta', {
                  count: pkg.credits,
                  amount: formatCurrency(pkg.priceAmount, pkg.currency),
                })
              : t('discovery.limitCreditsCtaDefault')}
          </p>
          <p className="mt-0.5 text-[12px] text-text-secondary">
            {config && pkg
              ? t('discovery.limitCreditsJust', {
                  amount: formatCurrency(pkg.priceAmount, pkg.currency),
                })
              : t('discovery.limitCreditsCtaDefault')}
          </p>
        </button>
      </div>

      {paymentExpanded ? (
        <div className="mt-3 rounded-2xl border border-border px-4 pb-4 pt-3">
          {configLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 aria-hidden className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : configError || !paymentAvailable ? (
            <p className="py-3 text-[13px] text-text-secondary">
              {t('discovery.limitPaymentUnavailable')}
            </p>
          ) : purchaseDone ? (
            <div className="rounded-2xl bg-[#E7F6EE] px-4 py-3 text-center">
              <p className="text-[14px] font-semibold text-navy">
                {t('discovery.limitPaymentPendingTitle')}
              </p>
              <p className="mt-1 text-[13px] text-text-secondary">
                {t('discovery.limitPaymentPendingBody')}
              </p>
            </div>
          ) : (
            <PaymentPanel
              config={config!}
              pkg={pkg!}
              onSuccess={(req) => setPurchaseDone(req)}
            />
          )}
        </div>
      ) : null}

      <ActionButton variant="ghost" onClick={onClose} className="mt-4 w-full">
        {t('discovery.limitDismiss')}
      </ActionButton>
    </div>
  );
}
