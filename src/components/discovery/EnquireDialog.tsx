import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  Loader2,
  Lock,
  Mail,
  MessageCircle,
  Smartphone,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { createSpaceEnquiry, deliverEnquiryContactEmail, resolveDiscoverSpace } from '../../auth/discoverEnquiry';
import { clearEnquireIntent, saveEnquireIntent } from '../../auth/enquireIntent';
import { PublicApiError } from '../../lib/apiClient';
import { isValidEmail } from '../../auth/validation';
import { ActionButton } from '../common/ActionButton';
import { Modal } from '../common/Modal';
import { InquiryLimitModal } from './InquiryLimitModal';
import type { EnquireListingKind } from '../../constants/links';
import { openAcomiAndroidApp } from '../../lib/openAcomiAndroidApp';
import type { PublicUser, SpaceEnquiryResponse } from '../../auth/types';

type EnquireDialogProps = {
  open: boolean;
  listingId: string;
  listingName: string;
  listingKind: EnquireListingKind;
  onClose: () => void;
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

type SubmitIntent = 'app' | 'email';

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
}: EnquireDialogProps) {
  const { t } = useTranslation();
  const { isAuthenticated, user, openAuth, isBootstrapping, refreshUser } = useAuth();
  const savedEmails = useMemo(() => savedEnquiryEmails(user), [user]);
  const [step, setStep] = useState<Step>('gate');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState<SpaceEnquiryResponse | null>(null);
  const [deliveredAtLabel, setDeliveredAtLabel] = useState('');
  const [resultEmail, setResultEmail] = useState('');
  const [pendingIntent, setPendingIntent] = useState<SubmitIntent | null>(null);
  const [bootLoading, setBootLoading] = useState(false);
  const busyRef = useRef(false);
  const initKeyRef = useRef<string | null>(null);

  async function createEnquiry(options?: {
    email?: string;
    deliveryChannel?: 'APP' | 'EMAIL';
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
    void refreshUser();
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
        setError(err.message);
      } else {
        setError(t('discovery.enquireSubmitError'));
      }
      setStep('error');
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  function onChooseEmail() {
    if (busyRef.current) return;
    setError(null);
    setPendingIntent('email');
    setEmail(savedEmails[0] ?? user?.email?.trim() ?? '');
    setStep('email');
  }

  async function sendDetailsByEmail() {
    if (busyRef.current) return;
    const value = email.trim();
    if (!isValidEmail(value)) {
      setError(t('discovery.enquireEmailInvalid'));
      return;
    }

    busyRef.current = true;
    setBusy(true);
    setError(null);
    setPendingIntent('email');
    setStep('submitting');
    try {
      let enquiry = submitted;
      if (!enquiry) {
        enquiry = await createEnquiry({ email: value, deliveryChannel: 'EMAIL' });
        if (!enquiry) return;
      }
      const updated = await deliverEnquiryContactEmail(enquiry.enquiryId, value);
      setSubmitted(updated);
      setResultEmail(updated.requesterEmail || value);
      setPendingIntent(null);
      if (updated.alreadyDelivered) {
        setDeliveredAtLabel(formatDeliveredAt(updated.deliveredAt || updated.emailDeliveredAt));
        setStep('emailAlready');
        return;
      }
      setDeliveredAtLabel(formatDeliveredAt(updated.deliveredAt || updated.emailDeliveredAt));
      setStep('emailSent');
      void refreshUser();
    } catch (err) {
      if (err instanceof PublicApiError) {
        const already = readAlreadyDelivered(err);
        if (already) {
          applyAlreadyDelivered(already, 'EMAIL');
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
        if (err.errorCode === 'REQUESTER_EMAIL_REQUIRED') {
          setStep('email');
          setError(t('discovery.enquireEmailInvalid'));
          return;
        }
        setError(err.message);
      } else {
        setError(t('discovery.enquireSubmitError'));
      }
      setStep('email');
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!open) {
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
      return;
    }

    if (isBootstrapping) {
      setBootLoading(true);
      return;
    }
    setBootLoading(false);

    const initKey = `${listingId}|${isAuthenticated ? user?.id ?? 'auth' : 'anon'}`;
    if (initKeyRef.current === initKey) {
      return;
    }
    initKeyRef.current = initKey;

    setSubmitted(null);
    setPendingIntent(null);
    setError(null);
    setDeliveredAtLabel('');
    setResultEmail('');
    setEmail(savedEmails[0] ?? user?.email?.trim() ?? '');
    setStep(isAuthenticated ? 'choose' : 'gate');
  }, [open, listingId, isAuthenticated, isBootstrapping, user?.id, savedEmails, user?.email]);

  function handleClose() {
    if (busyRef.current) return;
    clearEnquireIntent();
    onClose();
  }

  const isSending = step === 'submitting' || bootLoading;
  const enquiryIdForApp = submitted?.enquiryId;
  const displayEmail = resultEmail || submitted?.requesterEmail || email;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      labelledBy="enquire-title"
      describedBy="enquire-body"
      closeOnBackdrop={!isSending && !busy}
      className="relative max-w-[400px] overflow-hidden p-5 sm:p-6"
    >
      {step === 'limit' ? (
        <InquiryLimitModal onClose={handleClose} />
      ) : isSending ? (
        <div className="text-center" role="status" aria-live="polite" aria-busy="true">
          <IconBadge>
            <Loader2 className="h-7 w-7 animate-spin" aria-hidden />
          </IconBadge>
          {!bootLoading ? (
            <>
              <div className="mt-4 flex justify-center text-primary" aria-hidden>
                {pendingIntent === 'email' ? (
                  <Mail className="h-10 w-10 opacity-80" strokeWidth={1.5} />
                ) : (
                  <Smartphone className="h-10 w-10 opacity-80" strokeWidth={1.5} />
                )}
              </div>
              <h2 id="enquire-title" className="mt-3 text-xl font-semibold tracking-tight text-navy">
                {t('discovery.enquireSendingTitle')}
              </h2>
              <p id="enquire-body" className="mt-1.5 text-[14px] text-text-secondary">
                {pendingIntent === 'email'
                  ? t('discovery.enquireSendingEmailBody')
                  : t('discovery.enquireSendingAppBody')}
              </p>
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
      ) : step === 'choose' ? (
        <div className="text-center">
          <IconBadge>
            <MessageCircle className="h-6 w-6" aria-hidden />
          </IconBadge>
          <h2 id="enquire-title" className="mt-3 text-xl font-semibold tracking-tight text-navy">
            {t('discovery.enquireChooseTitle')}
          </h2>
          <p id="enquire-body" className="mt-1.5 text-[14px] text-text-secondary">
            {t('discovery.enquireChooseBody')}
          </p>

          <div className="mt-5 space-y-3 text-left">
            {/* APP — recommended / unlimited */}
            <button
              type="button"
              disabled={busy}
              onClick={() => void onSendOnAcomiApp()}
              className="w-full rounded-2xl border border-primary/30 bg-[#E7F6EE] p-3.5 text-left transition hover:border-primary/55 disabled:opacity-60 sm:p-4"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/80 text-primary shadow-sm ring-1 ring-primary/10">
                  <Smartphone className="h-6 w-6" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="inline-flex rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                    {t('discovery.enquireRecommended')}
                  </span>
                  <span className="mt-1.5 block text-[13px] font-semibold text-navy/80">
                    {t('discovery.enquireSendOnApp')}
                  </span>
                  <span className="mt-1 block text-[20px] font-extrabold leading-tight tracking-tight text-navy sm:text-[22px]">
                    {t('discovery.enquireUnlimitedTitle')}
                  </span>
                  <span className="mt-0.5 block text-[18px] font-bold leading-tight text-primary sm:text-[20px]">
                    {t('discovery.enquireFreeAndroid')}
                  </span>
                  <span className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-navy/65">
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
                <ChevronRight className="mt-3 h-5 w-5 shrink-0 text-primary/70" aria-hidden />
              </div>
            </button>

            <p className="text-center text-[12px] font-medium text-muted">{t('discovery.enquireOr')}</p>

            {/* EMAIL — limited (5/day) */}
            <button
              type="button"
              disabled={busy}
              onClick={onChooseEmail}
              className="w-full rounded-2xl border border-amber-300/70 bg-[#FFF4EC] p-3.5 text-left transition hover:border-amber-400 disabled:opacity-60 sm:p-4"
            >
              <div className="flex items-start gap-3">
                <span className="relative mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/90 text-amber-700 shadow-sm ring-1 ring-amber-200/80">
                  <Mail className="h-5 w-5" aria-hidden />
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
                    5
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold text-navy/80">
                    {t('discovery.enquireEmailCtaReady')}
                  </span>
                  <span className="mt-1 inline-block rounded-md bg-amber-100/90 px-1.5 py-0.5 text-[17px] font-extrabold leading-tight tracking-tight text-amber-900 sm:text-[18px]">
                    {t('discovery.enquireEmailDailyLimit')}
                  </span>
                  <span className="mt-1.5 block text-[12px] text-navy/60">
                    {t('discovery.enquireEmailCardHint')}
                  </span>
                </span>
                <ChevronRight className="mt-3 h-5 w-5 shrink-0 text-amber-700/60" aria-hidden />
              </div>
            </button>
          </div>

          <ActionButton variant="ghost" className="mt-4 w-full" onClick={handleClose} disabled={busy}>
            {t('discovery.enquireDone')}
          </ActionButton>
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
