import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  Eye,
  Lock,
  Mail,
  MessageCircle,
  Smartphone,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { useEnquiryFeedback } from '../../context/EnquiryFeedbackContext';
import { createSpaceEnquiry, deliverEnquiryContactEmail, resolveDiscoverSpace } from '../../auth/discoverEnquiry';
import { clearEnquireIntent, saveEnquireIntent } from '../../auth/enquireIntent';
import { inquirySentViaFromEnquiry, markInquired } from '../../auth/inquiredListings';
import { PublicApiError } from '../../lib/apiClient';
import { enquiryErrorMessage } from '../../auth/enquiryErrors';
import { isValidEmail } from '../../auth/validation';
import { ActionButton } from '../common/ActionButton';
import { Modal } from '../common/Modal';
import { InquiryLimitModal } from './InquiryLimitModal';
import type { RevealedOwnerContact } from './OwnerContactCard';
import type { EnquireListingKind } from '../../constants/links';
import { openAcomiAndroidApp } from '../../lib/openAcomiAndroidApp';
import {
  canViewContactDirectly,
  fetchInquiryPaymentConfig,
  fetchInquiryQuota,
  isUnlimitedQuota,
  needsInquiryPayment,
  paidCreditsOf,
  resetInquiryQuota,
  type InquiryCreditPackage,
  type InquiryQuota,
} from '../../auth/inquiryCreditsApi';
import { IS_LOCAL_DEV } from '../../config/env';
import type { PublicUser, SpaceEnquiryResponse } from '../../auth/types';

type EnquireDialogProps = {
  open: boolean;
  listingId: string;
  listingName: string;
  listingKind: EnquireListingKind;
  onClose: () => void;
  onOpen?: () => void;
  onViewedHere?: (contact: RevealedOwnerContact) => void;
};

/** UI steps — business handlers unchanged; visuals follow mock states 1–8. */
type Step =
  | 'gate'
  | 'choose'
  | 'submitting'
  | 'email'
  | 'appSent'
  | 'emailSent'
  | 'appAlready'
  | 'emailAlready'
  | 'error'
  | 'own'
  | 'limit';

type SubmitIntent = 'app' | 'email' | 'view';

type AlreadyDeliveredPayload = {
  channel?: string;
  deliveredAt?: string;
  enquiryId?: string;
  recipientEmail?: string;
};

function savedEnquiryEmails(user: PublicUser | null | undefined): string[] {
  const seen = new Set<string>();
  const emails: string[] = [];
  for (const value of user?.enquiryEmails ?? []) {
    const email = value?.trim().toLowerCase();
    if (email && !seen.has(email)) {
      seen.add(email);
      emails.push(email);
    }
  }
  const profile = user?.email?.trim().toLowerCase();
  if (profile && !seen.has(profile)) {
    emails.push(profile);
  }
  return emails;
}

function normalizeEmail(value: string | null | undefined): string {
  return value?.trim().toLowerCase() ?? '';
}

/** True when this listing already emailed owner details to the chosen address. */
function emailAlreadyDeliveredTo(
  enquiry: SpaceEnquiryResponse | null | undefined,
  address: string,
): boolean {
  if (!enquiry) return false;
  const delivered =
    enquiry.alreadyDelivered === true ||
    Boolean(enquiry.emailDeliveredAt) ||
    Boolean(enquiry.contactEmailSentAt) ||
    enquiry.contactEmailSent === true;
  if (!delivered) return false;
  const sentTo = normalizeEmail(enquiry.requesterEmail);
  const wanted = normalizeEmail(address);
  if (!sentTo || !wanted) return delivered;
  return sentTo === wanted;
}

function formatDeliveredAt(value: string | null | undefined): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function paidCreditsRemaining(current: InquiryQuota | null): number {
  return paidCreditsOf(current);
}

function RequestLoader({ intent }: { intent: SubmitIntent | null }) {
  const Icon = intent === 'email' ? Mail : intent === 'view' ? Eye : Smartphone;
  return (
    <div className="relative mx-auto h-28 w-28" aria-hidden>
      <span className="absolute inset-0 animate-pulse rounded-full bg-primary/10" />
      <span className="absolute inset-1 rounded-full border border-primary/15" />
      <span
        className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-t-[#0F6B4C] border-r-primary/30"
        style={{ animationDuration: '0.9s' }}
      />
      <span
        className="absolute inset-4 animate-spin rounded-full border-2 border-transparent border-b-emerald-400"
        style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
      />
      <span className="absolute inset-1 animate-spin" style={{ animationDuration: '1.8s' }}>
        <span className="absolute top-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_10px_rgba(15,107,76,0.55)]" />
      </span>
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-primary/15">
          <Icon className="h-6 w-6" strokeWidth={1.75} />
        </span>
      </span>
    </div>
  );
}

function IconBadge({
  children,
  tone = 'soft',
  animate,
}: {
  children: ReactNode;
  tone?: 'soft' | 'success' | 'already' | 'danger';
  animate?: 'check' | 'none';
}) {
  const toneClass =
    tone === 'success'
      ? 'bg-primary text-white'
      : tone === 'already'
        ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-200/80'
        : tone === 'danger'
          ? 'bg-red-50 text-coral'
          : 'bg-[#E7F6EE] text-primary ring-1 ring-primary/15';
  const animClass = animate === 'check' ? 'enquire-check-pop' : '';
  return (
    <div
      className={`mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full ${toneClass} ${animClass}`}
      aria-hidden
    >
      {children}
    </div>
  );
}

function SuccessCheck() {
  return (
    <IconBadge tone="success" animate="check">
      <CheckCircle2 className="h-7 w-7" strokeWidth={2.25} />
    </IconBadge>
  );
}

function AlreadyBadge({ kind }: { kind: 'app' | 'email' }) {
  return (
    <IconBadge tone="already">
      {kind === 'email' ? (
        <span className="relative inline-flex">
          <Mail className="h-6 w-6" strokeWidth={2} />
          <Clock3 className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-amber-50" strokeWidth={2.5} />
        </span>
      ) : (
        <Clock3 className="h-7 w-7" strokeWidth={2} />
      )}
    </IconBadge>
  );
}

/** Mint promo card — used on success / already-sent (no opposite-channel CTAs). */
function AppPromoCard({ t }: { t: (key: string) => string }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-[#E7F6EE] px-4 py-3.5 text-center">
      <p className="text-[15px] font-bold leading-snug tracking-tight text-navy">
        {t('discovery.enquireAppPromoTitle')}
      </p>
      <p className="mt-1.5 text-[12px] leading-snug text-text-secondary">
        {t('discovery.enquireAppPromoBody')}
      </p>
    </div>
  );
}

function ChannelCard({
  variant,
  icon,
  title,
  subtitle,
  trailing,
  disabled,
  onClick,
}: {
  variant: 'primary' | 'secondary';
  icon: ReactNode;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  const base =
    variant === 'primary'
      ? 'border-primary/25 bg-[#E7F6EE] hover:border-primary/50'
      : 'border-border bg-white hover:border-primary/40';
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition disabled:opacity-60 ${base}`}
    >
      <span className="shrink-0 text-primary">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold text-navy">{title}</span>
        {subtitle ? <span className="block text-[12px] text-text-secondary">{subtitle}</span> : null}
      </span>
      {trailing ? <span className="shrink-0 text-primary/70">{trailing}</span> : null}
    </button>
  );
}

function OrDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-0.5" aria-hidden="true">
      <span className="h-px flex-1 bg-black/10" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">{label}</span>
      <span className="h-px flex-1 bg-black/10" />
    </div>
  );
}

function readAlreadyDelivered(err: PublicApiError): AlreadyDeliveredPayload | null {
  if (err.errorCode !== 'ALREADY_DELIVERED' || !err.data || typeof err.data !== 'object') {
    return null;
  }
  return err.data as AlreadyDeliveredPayload;
}

export function EnquireDialog({
  open,
  listingId,
  listingName,
  listingKind,
  onClose,
  onOpen,
  onViewedHere,
}: EnquireDialogProps) {
  const { t } = useTranslation();
  const { isAuthenticated, user, openAuth, isBootstrapping, refreshUser } = useAuth();
  const { beginSend, endSend, showToast } = useEnquiryFeedback();
  const savedEmails = useMemo(() => savedEnquiryEmails(user), [user]);
  const [step, setStep] = useState<Step>('gate');
  const [limitPayment, setLimitPayment] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState<SpaceEnquiryResponse | null>(null);
  const [deliveredAtLabel, setDeliveredAtLabel] = useState('');
  const [resultEmail, setResultEmail] = useState('');
  const [pendingIntent, setPendingIntent] = useState<SubmitIntent | null>(null);
  const [bootLoading, setBootLoading] = useState(false);
  const [quota, setQuota] = useState<InquiryQuota | null>(null);
  const [quotaSettled, setQuotaSettled] = useState(false);
  const [offerPkg, setOfferPkg] = useState<InquiryCreditPackage | null>(null);
  const busyRef = useRef(false);
  const preserveOnCloseRef = useRef(false);
  const initKeyRef = useRef<string | null>(null);
  const directViewRef = useRef(false);
  const quotaGenRef = useRef(0);

  async function refreshQuota() {
    if (!isAuthenticated) {
      setQuotaSettled(true);
      return;
    }
    const gen = ++quotaGenRef.current;
    try {
      const next = await fetchInquiryQuota();
      if (gen === quotaGenRef.current) setQuota(next);
    } catch {
      // Keep the last known remaining rather than pretending the daily quota is full.
    } finally {
      if (gen === quotaGenRef.current) setQuotaSettled(true);
    }
  }

  function consumeLocalQuota() {
    setQuota((prev) => {
      if (!prev || isUnlimitedQuota(prev)) return prev;
      if (prev.freeRemainingToday > 0) {
        return {
          ...prev,
          freeUsedToday: prev.freeUsedToday + 1,
          freeRemainingToday: Math.max(0, prev.freeRemainingToday - 1),
        };
      }
      if (prev.availableCredits > 0) {
        return {
          ...prev,
          availableCredits: Math.max(0, prev.availableCredits - 1),
        };
      }
      return prev;
    });
  }

  async function createEnquiry(options?: {
    email?: string;
    deliveryChannel?: 'APP' | 'EMAIL' | 'VIEW_HERE';
  }): Promise<SpaceEnquiryResponse | null> {
    const space = await resolveDiscoverSpace(listingId, listingName, listingKind);
    if (!space) {
      setError(t('discovery.enquireListingUnavailable'));
      setStep('error');
      return null;
    }
    if (space.ownedByCurrentUser) {
      clearEnquireIntent();
      setStep('own');
      return null;
    }
    const created = await createSpaceEnquiry(space.spaceId, options);
    clearEnquireIntent();
    setSubmitted(created);
    const listingKey = created.spaceId || space.spaceId;
    if (options?.deliveryChannel === 'VIEW_HERE') {
      markInquired(listingKey, null, { contactViewed: true, sentAt: created.deliveredAt || created.requestedAt });
    } else if (options?.deliveryChannel !== 'EMAIL') {
      markInquired(listingKey, inquirySentViaFromEnquiry(created), {
        sentToEmail: created.requesterEmail,
        sentAt: created.contactEmailSentAt || created.deliveredAt || created.requestedAt,
      });
    }
    void refreshUser();
    void refreshQuota();
    return created;
  }

  function applyAlreadyDelivered(payload: AlreadyDeliveredPayload, channel: 'APP' | 'EMAIL') {
    const label = formatDeliveredAt(payload.deliveredAt);
    setDeliveredAtLabel(label);
    if (payload.recipientEmail) {
      setResultEmail(payload.recipientEmail);
    }
    if (payload.enquiryId) {
      setSubmitted((prev) =>
        prev ??
        ({
          enquiryId: payload.enquiryId!,
          spaceId: listingId,
          spaceName: listingName,
          status: 'SHARED',
          requesterEmail: payload.recipientEmail || email || '',
          detailsShared: true,
          deliveredAt: payload.deliveredAt,
          deliveryChannel: channel,
          alreadyDelivered: true,
        } as SpaceEnquiryResponse),
      );
    }
    markInquired(listingId, channel === 'APP' ? 'APP' : 'EMAIL');
    setStep(channel === 'APP' ? 'appAlready' : 'emailAlready');
  }

  async function onSendOnAcomiApp() {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError(null);
    setPendingIntent('app');
    setStep('submitting');
    try {
      const created = await createEnquiry({ deliveryChannel: 'APP' });
      if (!created) return;
      if (created.alreadyDelivered) {
        setDeliveredAtLabel(formatDeliveredAt(created.deliveredAt || created.appDeliveredAt));
        setStep('appAlready');
        return;
      }
      setDeliveredAtLabel(formatDeliveredAt(created.deliveredAt || created.appDeliveredAt));
      setStep('appSent');
    } catch (err) {
      if (err instanceof PublicApiError) {
        const already = readAlreadyDelivered(err);
        if (already) {
          applyAlreadyDelivered(already, 'APP');
          return;
        }
        if (err.errorCode === 'SELF_ENQUIRY_NOT_ALLOWED') {
          clearEnquireIntent();
          setStep('own');
          return;
        }
        if (err.status === 401) {
          setStep('gate');
          openAuth('login');
          return;
        }
        if (err.errorCode === 'WEB_FREE_LIMIT_REACHED' || err.errorCode === 'INQUIRY_CREDITS_REQUIRED') {
          setStep('limit');
          return;
        }
        setError(
          enquiryErrorMessage(
            err,
            t('discovery.enquireSubmitError'),
            t('discovery.enquireListingUnavailable'),
          ),
        );
      } else {
        setError(t('discovery.enquireSubmitError'));
      }
      setStep('error');
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  async function onViewHere() {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    setError(null);
    setPendingIntent('view');
    setStep('submitting');
    beginSend(listingId, 'view');
    try {
      const created = await createEnquiry({ deliveryChannel: 'VIEW_HERE' });
      if (!created) return;
      onViewedHere?.(created.ownerContact ?? { available: false });
      onClose();
    } catch (err) {
      if (err instanceof PublicApiError) {
        const already = readAlreadyDelivered(err);
        if (already?.channel === 'VIEW_HERE') {
          try {
            const created = await createEnquiry({ deliveryChannel: 'VIEW_HERE' });
            if (created) {
              onViewedHere?.(created.ownerContact ?? { available: false });
              onClose();
              return;
            }
          } catch {
            // Fall through to the original error.
          }
        }
        if (err.errorCode === 'SELF_ENQUIRY_NOT_ALLOWED') {
          clearEnquireIntent();
          setStep('own');
          return;
        }
        if (err.status === 401) {
          setStep('gate');
          openAuth('login');
          return;
        }
        if (err.errorCode === 'WEB_FREE_LIMIT_REACHED' || err.errorCode === 'INQUIRY_CREDITS_REQUIRED') {
          setStep('limit');
          return;
        }
        if (err.errorCode === 'VIEW_HERE_LIMIT_REACHED' || err.errorCode === 'VIEW_HERE_DISABLED') {
          void refreshQuota();
          setStep('choose');
          return;
        }
        setError(
          enquiryErrorMessage(
            err,
            t('discovery.enquireViewFailed'),
            t('discovery.enquireListingUnavailable'),
          ),
        );
      } else {
        setError(t('discovery.enquireViewFailed'));
      }
      setStep('error');
    } finally {
      endSend(listingId);
      busyRef.current = false;
      setBusy(false);
    }
  }

  function onChooseEmail() {
    if (busyRef.current) return;
    if (needsInquiryPayment(quota)) {
      setStep('limit');
      return;
    }
    setError(null);
    setPendingIntent('email');
    setEmail(savedEmails[0] ?? user?.email?.trim() ?? '');
    setStep('email');
  }

  function onContinueWithPaidCredits() {
    if (busyRef.current) return;
    if (paidCreditsRemaining(quota) <= 0) {
      setStep('limit');
      return;
    }
    setError(null);
    setPendingIntent('email');
    setEmail(savedEmails[0] ?? user?.email?.trim() ?? '');
    setStep('email');
  }

  async function onResetLocalQuota(target: 'EMAIL' | 'VIEW_HERE' = 'EMAIL') {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    try {
      setQuota(await resetInquiryQuota(target));
      setStep('choose');
    } catch {
      setError(t('discovery.enquireSubmitError'));
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  async function sendDetailsByEmail() {
    if (busyRef.current) return;
    const value = email.trim();
    if (!isValidEmail(value)) {
      setError(t('discovery.enquireEmailInvalid'));
      return;
    }
    if (needsInquiryPayment(quota)) {
      setStep('limit');
      return;
    }

    let reopenDialog = false;
    const sentToast = (address: string) => {
      markInquired(listingId, 'EMAIL', {
        sentToEmail: address || null,
        sentAt: new Date().toISOString(),
      });
      showToast({
        title: t('discovery.enquireEmailSentTitle'),
        body: address
          ? t('discovery.enquireEmailSentBodyTo', { email: address })
          : t('discovery.enquireEmailSentBody'),
      });
    };
    const alreadyToast = (address: string, when: string) => {
      showToast({
        title: t('discovery.enquireAlreadyEmailTitle'),
        body:
          when && address
            ? t('discovery.enquireAlreadyEmailBodyTo', { date: when, email: address })
            : when
              ? t('discovery.enquireAlreadyEmailBody', { date: when })
              : t('discovery.enquireAlreadyEmailBodyNoDate'),
      });
    };

    busyRef.current = true;
    setBusy(true);
    setError(null);
    setPendingIntent('email');
    preserveOnCloseRef.current = true;
    beginSend(listingId);
    onClose();

    let enquiry = submitted;
    try {
      if (!enquiry) {
        enquiry = await createEnquiry({ email: value, deliveryChannel: 'EMAIL' });
        if (!enquiry) {
          reopenDialog = true;
          onOpen?.();
          return;
        }
      }
      // Auto-share already emails on create. Calling email-contact again for the
      // same address is a duplicate and must not show "Already sent" for a first send.
      if (emailAlreadyDeliveredTo(enquiry, value)) {
        const address = enquiry.requesterEmail || value;
        const when = formatDeliveredAt(
          enquiry.deliveredAt || enquiry.emailDeliveredAt || enquiry.contactEmailSentAt,
        );
        if (enquiry.reusedExisting) alreadyToast(address, when);
        else {
          sentToast(address);
          consumeLocalQuota();
        }
        void refreshUser();
        await refreshQuota();
        return;
      }
      const updated = await deliverEnquiryContactEmail(enquiry.enquiryId, value);
      const address = updated.requesterEmail || value;
      if (updated.alreadyDelivered && enquiry.reusedExisting) {
        alreadyToast(address, formatDeliveredAt(updated.deliveredAt || updated.emailDeliveredAt));
      } else {
        if (!enquiry.reusedExisting) consumeLocalQuota();
        sentToast(address);
      }
      void refreshUser();
      await refreshQuota();
    } catch (err) {
      if (err instanceof PublicApiError) {
        const already = readAlreadyDelivered(err);
        if (already) {
          const address = already.recipientEmail || value;
          const when = formatDeliveredAt(already.deliveredAt);
          if (enquiry && !enquiry.reusedExisting) {
            sentToast(address);
            consumeLocalQuota();
            await refreshQuota();
            return;
          }
          alreadyToast(address, when);
          markInquired(listingId, 'EMAIL');
          return;
        }
        if (err.errorCode === 'SELF_ENQUIRY_NOT_ALLOWED') {
          clearEnquireIntent();
          setStep('own');
          reopenDialog = true;
          onOpen?.();
          return;
        }
        if (err.status === 401) {
          setStep('gate');
          openAuth('login');
          return;
        }
        if (err.errorCode === 'WEB_FREE_LIMIT_REACHED' || err.errorCode === 'INQUIRY_CREDITS_REQUIRED') {
          setStep('limit');
          reopenDialog = true;
          onOpen?.();
          return;
        }
        if (err.errorCode === 'REQUESTER_EMAIL_REQUIRED') {
          setStep('email');
          setError(t('discovery.enquireEmailInvalid'));
          reopenDialog = true;
          onOpen?.();
          return;
        }
        showToast({
          tone: 'error',
          title: t('discovery.enquireSendFailed'),
          body: enquiryErrorMessage(
            err,
            t('discovery.enquireSendFailed'),
            t('discovery.enquireListingUnavailable'),
          ),
        });
      } else {
        showToast({ tone: 'error', title: t('discovery.enquireSendFailed') });
      }
    } finally {
      preserveOnCloseRef.current = false;
      busyRef.current = false;
      setBusy(false);
      endSend(listingId);
      if (!reopenDialog) {
        setSubmitted(null);
        setPendingIntent(null);
        setStep('choose');
      }
    }
  }

  useEffect(() => {
    if (!open || step !== 'limit') setLimitPayment(false);
  }, [open, step]);

  useEffect(() => {
    if (!open) {
      if (preserveOnCloseRef.current) return;
      initKeyRef.current = null;
      setError(null);
      setBusy(false);
      busyRef.current = false;
      setSubmitted(null);
      setPendingIntent(null);
      setBootLoading(false);
      setDeliveredAtLabel('');
      setResultEmail('');
      setStep('gate');
      setQuota(null);
      setQuotaSettled(false);
      directViewRef.current = false;
      return;
    }

    if (isBootstrapping) {
      setBootLoading(true);
      return;
    }
    setBootLoading(false);

    const initKey = `${listingId}|${isAuthenticated ? user?.id ?? 'auth' : 'anon'}`;
    const isNewOpen = initKeyRef.current !== initKey;
    if (isNewOpen) {
      initKeyRef.current = initKey;
      directViewRef.current = false;
      setQuotaSettled(false);
      setSubmitted(null);
      setPendingIntent(null);
      setError(null);
      setDeliveredAtLabel('');
      setResultEmail('');
      setEmail(savedEmails[0] ?? user?.email?.trim() ?? '');
      setStep(isAuthenticated ? 'choose' : 'gate');
    }

    if (isAuthenticated) {
      void refreshQuota();
      if (!offerPkg) {
        void fetchInquiryPaymentConfig()
          .then((config) => {
            const pkg =
              config.packages
                .filter((item) => item.enabled)
                .sort((a, b) => a.displayOrder - b.displayOrder)[0] ?? null;
            setOfferPkg(pkg);
          })
          .catch(() => {
            // Leave the offer blank until the configured package can be loaded.
          });
      }
    } else if (isNewOpen) {
      setQuotaSettled(true);
    }
  }, [open, listingId, isAuthenticated, isBootstrapping, user?.id, savedEmails, user?.email]);

  useEffect(() => {
    if (step !== 'email') return;
    if (needsInquiryPayment(quota)) {
      setStep('limit');
    }
  }, [step, quota]);

  function handleClose() {
    if (busyRef.current) return;
    clearEnquireIntent();
    onClose();
  }

  const isSending = step === 'submitting' || bootLoading;
  const enquiryIdForApp = submitted?.enquiryId;
  const displayEmail = resultEmail || submitted?.requesterEmail || email;
  const dailyLimit = quota?.dailyFreeLimit ?? 5;
  const remainingKnown = quota != null && !isUnlimitedQuota(quota);
  const remainingToday = quota?.freeRemainingToday ?? dailyLimit;
  const paidLeft = paidCreditsOf(quota);
  const remainingExhausted = needsInquiryPayment(quota);
  const offerCount = offerPkg?.credits;
  const offerAmount = offerPkg
    ? offerPkg.currency === 'INR'
      ? `₹${Number(offerPkg.priceAmount)}`
      : `${offerPkg.currency} ${Number(offerPkg.priceAmount)}`
    : null;
  const showPaidRemaining = remainingKnown && remainingToday <= 0 && paidLeft > 0;
  const viewHereLimit = quota?.viewHereDailyLimit ?? 0;
  const viewHereRemaining = quota?.viewHereRemainingToday ?? 0;
  const showViewHere = canViewContactDirectly(quota);
  const showViewHereExhausted = viewHereLimit > 0 && viewHereRemaining <= 0;

  useLayoutEffect(() => {
    if (!open || !isAuthenticated || step !== 'choose' || !quotaSettled || !showViewHere || directViewRef.current) {
      return;
    }
    directViewRef.current = true;
    void onViewHere();
  }, [open, isAuthenticated, step, quotaSettled, showViewHere]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      labelledBy="enquire-title"
      describedBy="enquire-body"
      closeOnBackdrop={!isSending && !busy}
      className={
        step === 'limit' && limitPayment
          ? 'box-border max-h-[90vh] w-full max-w-[min(640px,calc(100vw-2rem))] overflow-y-auto overscroll-contain p-4 [scrollbar-width:none] [-ms-overflow-style:none] sm:px-5 sm:py-3.5 [&::-webkit-scrollbar]:hidden'
          : 'relative box-border max-h-[min(92dvh,720px)] w-full max-w-[min(560px,calc(100vw-2rem))] overflow-y-auto overscroll-contain p-4 sm:p-5'
      }
    >
      {step === 'limit' ? (
        <InquiryLimitModal
          onClose={handleClose}
          onQuotaReset={IS_LOCAL_DEV ? () => void onResetLocalQuota() : undefined}
          freeUsedToday={quota?.freeUsedToday}
          availableCredits={paidCreditsRemaining(quota)}
          onPaymentActive={setLimitPayment}
          onContinueWithCredits={
            paidCreditsRemaining(quota) > 0 ? onContinueWithPaidCredits : undefined
          }
        />
      ) : isSending ? (
        <div className="py-4 text-center" role="status" aria-live="polite" aria-busy="true">
          <RequestLoader intent={pendingIntent} />
          {!bootLoading ? (
            <>
              <h2 id="enquire-title" className="mt-5 text-xl font-semibold tracking-tight text-navy">
                {pendingIntent === 'view'
                  ? t('discovery.enquireSendingViewTitle')
                  : t('discovery.enquireSendingTitle')}
              </h2>
              <p id="enquire-body" className="mt-1.5 text-[14px] text-text-secondary">
                {pendingIntent === 'email'
                  ? t('discovery.enquireSendingEmailBody')
                  : pendingIntent === 'view'
                    ? t('discovery.enquireSendingViewBody')
                    : t('discovery.enquireSendingAppBody')}
              </p>
              <div className="mt-4 flex items-center justify-center gap-1.5" aria-hidden>
                {[0, 1, 2].map((dot) => (
                  <span
                    key={dot}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary"
                    style={{ animationDelay: `${dot * 0.15}s` }}
                  />
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : step === 'gate' ? (
        <div className="text-center">
          <h2 id="enquire-title" className="text-xl font-semibold text-navy">
            {t('discovery.enquireSignInTitle')}
          </h2>
          <p id="enquire-body" className="mt-2 text-[14px] text-text-secondary">
            {t('discovery.enquireSignInBodyShort')}
          </p>
          <div className="mt-5 flex flex-col gap-2.5">
            <ActionButton
              onClick={() => {
                saveEnquireIntent({
                  listingId,
                  listingName,
                  listingKind,
                  path: window.location.pathname,
                  resumeAfterAuth: true,
                });
                openAuth('login');
              }}
            >
              {t('nav.signIn')}
            </ActionButton>
            <ActionButton
              variant="ghost"
              onClick={() => {
                saveEnquireIntent({
                  listingId,
                  listingName,
                  listingKind,
                  path: window.location.pathname,
                  resumeAfterAuth: true,
                });
                openAuth('register');
              }}
            >
              {t('auth.createAccount')}
            </ActionButton>
            <ActionButton variant="ghost" onClick={handleClose}>
              {t('auth.continueBrowsing')}
            </ActionButton>
          </div>
        </div>
      ) : step === 'choose' && isAuthenticated && !quotaSettled ? (
        <div className="py-4 text-center" role="status" aria-live="polite" aria-busy="true">
          <RequestLoader intent="view" />
        </div>
      ) : step === 'choose' ? (
        <div className="text-center">
          <IconBadge>
            <MessageCircle className="h-6 w-6" aria-hidden />
          </IconBadge>
          <h2 id="enquire-title" className="mt-2 text-[17px] font-semibold tracking-tight text-navy">
            {t('discovery.enquireChooseTitle')}
          </h2>
          <p id="enquire-body" className="mt-1 text-[13px] text-text-secondary">
            {t('discovery.enquireChooseBody')}
          </p>

          <div className="mt-3 space-y-2 text-left">
            {/* APP — recommended / unlimited */}
            <button
              type="button"
              disabled={busy}
              onClick={() => void onSendOnAcomiApp()}
              className="w-full rounded-2xl border border-primary/30 bg-[#E7F6EE] p-3 text-left transition hover:border-primary/55 disabled:opacity-60"
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 text-primary shadow-sm ring-1 ring-primary/10">
                  <Smartphone className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    {t('discovery.enquireRecommended')}
                  </span>
                  <span className="mt-1 block text-[12px] font-semibold text-navy/80">
                    {t('discovery.enquireSendOnApp')}
                  </span>
                  <span className="mt-0.5 block text-[15px] font-bold leading-tight text-navy">
                    {t('discovery.enquireUnlimitedTitle')}
                  </span>
                  <span className="mt-0.5 block text-[14px] font-semibold leading-tight text-primary">
                    {t('discovery.enquireFreeAndroid')}
                  </span>
                  <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-navy/65">
                    <span className="inline-flex items-center gap-1">
                      <Zap className="h-3 w-3 text-primary" aria-hidden />
                      {t('discovery.enquireBenefitFast')}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Lock className="h-3 w-3 text-primary" aria-hidden />
                      {t('discovery.enquireBenefitSecure')}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Smartphone className="h-3 w-3 text-primary" aria-hidden />
                      {t('discovery.enquireBenefitAnywhere')}
                    </span>
                  </span>
                </span>
                <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-primary/70" aria-hidden />
              </div>
            </button>

            <OrDivider label={t('discovery.enquireOptionOr')} />

            {showViewHere ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => void onViewHere()}
                className="w-full rounded-2xl border border-sky-200 bg-[#F3F8FF] p-3 text-left transition hover:border-sky-300 disabled:opacity-60"
              >
                <div className="flex items-start gap-2.5">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                    <Eye className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-bold leading-tight text-navy">
                      {t('discovery.enquireViewHereTitle')}
                    </span>
                    <span className="mt-1 block text-[12px] leading-snug text-navy/70">
                      {t('discovery.enquireViewHereBody')}
                    </span>
                    <span className="mt-2 inline-block max-w-full rounded-full bg-sky-100 px-2 py-0.5 text-[12px] font-semibold leading-tight text-sky-800">
                      {viewHereRemaining === 1
                        ? t('discovery.enquireViewHereRemainingOne', {
                            remaining: viewHereRemaining,
                            limit: viewHereLimit,
                          })
                        : t('discovery.enquireViewHereRemaining', {
                            remaining: viewHereRemaining,
                            limit: viewHereLimit,
                          })}
                    </span>
                  </span>
                  <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-sky-700/70" aria-hidden />
                </div>
              </button>
            ) : null}

            {showViewHereExhausted ? (
              <p className="rounded-xl bg-sky-50 px-3 py-2 text-center text-[13px] leading-snug text-sky-900">
                {t('discovery.enquireViewHereExhausted')}
              </p>
            ) : null}

            {showViewHere || showViewHereExhausted ? <OrDivider label={t('discovery.enquireOptionOr')} /> : null}

            {/* EMAIL — limited unless admin disabled purchases. Paid credits send. */}
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                if (remainingExhausted) {
                  setStep('limit');
                  return;
                }
                onChooseEmail();
              }}
              className="w-full rounded-2xl border border-amber-300/70 bg-[#FFF4EC] p-3 text-left transition hover:border-amber-400 disabled:opacity-60"
            >
              <div className="flex items-start gap-2.5">
                <span className="relative mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/90 text-amber-700 shadow-sm ring-1 ring-amber-200/80">
                  <Mail className="h-4 w-4" aria-hidden />
                  {remainingKnown && !showPaidRemaining ? (
                    <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
                      {remainingToday}
                    </span>
                  ) : null}
                  {showPaidRemaining ? (
                    <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white">
                      {paidLeft}
                    </span>
                  ) : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] font-semibold text-navy/80">
                    {remainingExhausted
                      ? offerCount
                        ? t('discovery.enquireEmailCtaExhausted', { count: offerCount })
                        : t('discovery.enquireEmailCtaExhaustedPending')
                      : t('discovery.enquireEmailCtaReady')}
                  </span>
                  {remainingKnown ? (
                    <span className="mt-1 inline-block max-w-full whitespace-nowrap rounded-md bg-amber-100/90 px-1.5 py-0.5 text-[13px] font-bold leading-tight text-amber-900">
                      {showPaidRemaining
                        ? t('discovery.enquireEmailPaidRemaining', { count: paidLeft })
                        : remainingToday === 1
                          ? t('discovery.enquireEmailRemainingOne', {
                              remaining: remainingToday,
                              limit: dailyLimit,
                            })
                          : t('discovery.enquireEmailRemaining', {
                              remaining: remainingToday,
                              limit: dailyLimit,
                            })}
                    </span>
                  ) : null}
                  {remainingKnown && !showPaidRemaining && !remainingExhausted ? (
                    <span className="mt-1 block text-[12px] font-semibold text-navy/55">
                      {t('discovery.enquireEmailDailyLimit', { count: dailyLimit })}
                    </span>
                  ) : null}
                  {remainingExhausted && offerCount && offerAmount ? (
                    <span className="mt-1 block text-[12px] font-semibold text-navy/55">
                      {t('discovery.limitCreditsCta', { count: offerCount, amount: offerAmount })}
                    </span>
                  ) : null}
                  <span className="mt-1.5 block text-[12px] text-navy/60">
                    {remainingExhausted
                      ? offerAmount
                        ? t('discovery.enquireEmailExhaustedHint', { amount: offerAmount })
                        : null
                      : showPaidRemaining
                        ? t('discovery.enquireEmailPaidHint')
                        : t('discovery.enquireEmailCardHint')}
                  </span>
                </span>
                <ChevronRight className="mt-2 h-4 w-4 shrink-0 text-amber-700/60" aria-hidden />
              </div>
            </button>
          </div>

          <ActionButton variant="ghost" className="mt-3 w-full" onClick={handleClose} disabled={busy}>
            {t('discovery.enquireDone')}
          </ActionButton>
          {IS_LOCAL_DEV ? (
            <>
              <ActionButton
                variant="ghost"
                className="mt-2 w-full"
                onClick={() => void onResetLocalQuota('EMAIL')}
                disabled={busy}
              >
                {t('discovery.limitResetQuota')}
              </ActionButton>
              <ActionButton
                variant="ghost"
                className="mt-2 w-full"
                onClick={() => void onResetLocalQuota('VIEW_HERE')}
                disabled={busy}
              >
                {t('discovery.limitResetViewHere')}
              </ActionButton>
            </>
          ) : null}
        </div>
      ) : step === 'own' ? (
        <div className="text-center">
          <h2 id="enquire-title" className="text-xl font-semibold text-navy">
            {t('discovery.enquireOwnTitle')}
          </h2>
          <p id="enquire-body" className="mt-2 text-[14px] text-text-secondary">
            {t('discovery.enquireOwnBody')}
          </p>
          <ActionButton className="mt-5 w-full" onClick={handleClose}>
            {t('discovery.enquireDone')}
          </ActionButton>
        </div>
      ) : step === 'error' ? (
        <div className="text-center">
          <IconBadge tone="danger">
            <AlertCircle className="h-6 w-6" aria-hidden />
          </IconBadge>
          <h2 id="enquire-title" className="mt-3 text-xl font-semibold text-navy">
            {t('discovery.enquireSubmitError')}
          </h2>
          {error ? (
            <p id="enquire-body" className="mt-2 text-[13px] text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <div className="mt-5 flex flex-col gap-2.5">
            <ActionButton
              onClick={() => {
                if (pendingIntent === 'email') {
                  onChooseEmail();
                } else {
                  void onSendOnAcomiApp();
                }
              }}
            >
              {t('discovery.retry')}
            </ActionButton>
            <ActionButton variant="ghost" onClick={() => setStep('choose')}>
              {t('discovery.enquireBack')}
            </ActionButton>
            <ActionButton variant="ghost" onClick={handleClose}>
              {t('discovery.enquireCancel')}
            </ActionButton>
          </div>
        </div>
      ) : step === 'email' ? (
        <div>
          <div className="text-center">
            <IconBadge>
              <Mail className="h-6 w-6" aria-hidden />
            </IconBadge>
            <h2 id="enquire-title" className="mt-3 text-xl font-semibold text-navy">
              {t('discovery.enquireEmailTitleShort')}
            </h2>
            <p id="enquire-body" className="mt-1.5 text-[14px] text-text-secondary">
              {t('discovery.enquireEmailBodyReady')}
            </p>
          </div>
          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              void sendDetailsByEmail();
            }}
          >
            {savedEmails.length > 0 ? (
              <div className="space-y-1.5">
                <p className="text-[12px] font-medium text-muted">{t('discovery.enquireSavedEmails')}</p>
                <div className="flex flex-wrap gap-2">
                  {savedEmails.map((saved) => {
                    const selected = email.trim().toLowerCase() === saved;
                    return (
                      <button
                        key={saved}
                        type="button"
                        disabled={busy}
                        onClick={() => {
                          setEmail(saved);
                          setError(null);
                        }}
                        className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold transition ${
                          selected
                            ? 'border-primary bg-[#E7F6EE] text-navy'
                            : 'border-border bg-white text-text-secondary hover:border-primary/40'
                        }`}
                      >
                        {saved}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="space-y-1.5">
              <label htmlFor="enquire-email-input" className="text-[12px] font-medium text-muted">
                {t('discovery.enquireEmailInputLabel')}
              </label>
              <input
                id="enquire-email-input"
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                disabled={busy}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError(null);
                }}
              />
            </div>

            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-[12px] text-red-700" role="alert">
                {error}
              </p>
            ) : null}
            <ActionButton type="submit" disabled={busy} className="w-full">
              {t('discovery.enquireSendDetails')}
            </ActionButton>
            <p className="flex items-center justify-center gap-1.5 text-[12px] text-text-secondary">
              <Lock aria-hidden className="h-3.5 w-3.5" />
              {t('discovery.enquireEmailTrust')}
            </p>
            <button
              type="button"
              className="w-full text-[13px] font-semibold text-text-secondary"
              onClick={() => {
                setError(null);
                setStep('choose');
              }}
            >
              {t('discovery.enquireBack')}
            </button>
          </form>
        </div>
      ) : step === 'appSent' ? (
        <div className="text-center">
          <SuccessCheck />
          <h2 id="enquire-title" className="mt-3 text-xl font-semibold tracking-tight text-navy">
            {t('discovery.enquireAppSentTitle')}
          </h2>
          <p id="enquire-body" className="mt-1.5 text-[14px] text-text-secondary">
            {t('discovery.enquireAppSentBody')}
          </p>
          <div className="mt-5 space-y-3">
            <ChannelCard
              variant="primary"
              onClick={() => openAcomiAndroidApp({ enquiryId: enquiryIdForApp })}
              icon={<Smartphone className="h-5 w-5" aria-hidden />}
              title={t('discovery.enquireOpenApp')}
              subtitle={t('discovery.enquireAppHint')}
              trailing={<ExternalLink className="h-4 w-4" aria-hidden />}
            />
            <AppPromoCard t={t} />
          </div>
          <ActionButton variant="ghost" className="mt-4 w-full" onClick={handleClose}>
            {t('discovery.enquireDone')}
          </ActionButton>
        </div>
      ) : step === 'appAlready' ? (
        <div className="text-center">
          <AlreadyBadge kind="app" />
          <h2 id="enquire-title" className="mt-3 text-xl font-semibold tracking-tight text-navy">
            {t('discovery.enquireAlreadyAppTitle')}
          </h2>
          <p id="enquire-body" className="mt-1.5 text-[14px] text-text-secondary">
            {deliveredAtLabel
              ? t('discovery.enquireAlreadyAppBody', { date: deliveredAtLabel })
              : t('discovery.enquireAlreadyAppBodyNoDate')}
          </p>
          <div className="mt-5 space-y-3">
            <ChannelCard
              variant="primary"
              onClick={() => openAcomiAndroidApp({ enquiryId: enquiryIdForApp })}
              icon={<Smartphone className="h-5 w-5" aria-hidden />}
              title={t('discovery.enquireOpenApp')}
              subtitle={t('discovery.enquireAppHint')}
              trailing={<ExternalLink className="h-4 w-4" aria-hidden />}
            />
            <AppPromoCard t={t} />
          </div>
          <ActionButton variant="ghost" className="mt-4 w-full" onClick={handleClose}>
            {t('discovery.enquireDone')}
          </ActionButton>
        </div>
      ) : step === 'emailSent' ? (
        <div className="text-center">
          <SuccessCheck />
          <h2 id="enquire-title" className="mt-3 text-xl font-semibold tracking-tight text-navy">
            {t('discovery.enquireEmailSentTitle')}
          </h2>
          <p id="enquire-body" className="mt-1.5 text-[14px] text-text-secondary">
            {displayEmail
              ? t('discovery.enquireEmailSentBodyTo', { email: displayEmail })
              : t('discovery.enquireEmailSentBody')}
          </p>
          <div className="mt-5">
            <AppPromoCard t={t} />
          </div>
          <ActionButton variant="ghost" className="mt-4 w-full" onClick={handleClose}>
            {t('discovery.enquireDone')}
          </ActionButton>
        </div>
      ) : step === 'emailAlready' ? (
        <div className="text-center">
          <AlreadyBadge kind="email" />
          <h2 id="enquire-title" className="mt-3 text-xl font-semibold tracking-tight text-navy">
            {t('discovery.enquireAlreadyEmailTitle')}
          </h2>
          <p id="enquire-body" className="mt-1.5 text-[14px] text-text-secondary">
            {deliveredAtLabel && displayEmail
              ? t('discovery.enquireAlreadyEmailBodyTo', {
                  date: deliveredAtLabel,
                  email: displayEmail,
                })
              : deliveredAtLabel
                ? t('discovery.enquireAlreadyEmailBody', { date: deliveredAtLabel })
                : t('discovery.enquireAlreadyEmailBodyNoDate')}
          </p>
          <div className="mt-5">
            <AppPromoCard t={t} />
          </div>
          <ActionButton variant="ghost" className="mt-4 w-full" onClick={handleClose}>
            {t('discovery.enquireDone')}
          </ActionButton>
        </div>
      ) : null}
    </Modal>
  );
}
