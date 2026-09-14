import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays, CheckCircle2, Clock, Loader2, Mail, MailCheck } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { createSpaceEnquiry, resolveDiscoverSpace } from '../../auth/discoverEnquiry';
import { clearEnquireIntent, saveEnquireIntent } from '../../auth/enquireIntent';
import { PublicApiError } from '../../lib/apiClient';
import { isValidEmail } from '../../auth/validation';
import { ActionButton } from '../common/ActionButton';
import { Modal } from '../common/Modal';
import type { EnquireListingKind } from '../../constants/links';
import type { PublicUser, SpaceEnquiryResponse } from '../../auth/types';

type EnquireDialogProps = {
  open: boolean;
  listingId: string;
  listingName: string;
  listingKind: EnquireListingKind;
  onClose: () => void;
};

type Step = 'gate' | 'request' | 'own' | 'sent' | 'already';

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

export function EnquireDialog({
  open,
  listingId,
  listingName,
  listingKind,
  onClose,
}: EnquireDialogProps) {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, openAuth, isBootstrapping, refreshUser } = useAuth();
  const savedEmails = useMemo(() => savedEnquiryEmails(user), [user]);
  const [step, setStep] = useState<Step>('gate');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState<SpaceEnquiryResponse | null>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    if (!open) {
      setError(null);
      setBusy(false);
      busyRef.current = false;
      setSubmitted(null);
      return;
    }
    setEmail(savedEmails[0] ?? user?.email?.trim() ?? '');
    if (!isAuthenticated) {
      setStep('gate');
      return;
    }
    setStep('request');
    clearEnquireIntent();
  }, [isAuthenticated, listingId, open, user?.id]);

  useEffect(() => {
    if (!open || busy || step === 'sent' || step === 'own' || step === 'already') {
      return;
    }
    if (email.trim()) {
      return;
    }
    const next = savedEmails[0] ?? user?.email?.trim() ?? '';
    if (next) {
      setEmail(next);
    }
  }, [busy, email, open, savedEmails, step, user?.email]);

  useEffect(() => {
    if (open && listingId && listingName) {
      saveEnquireIntent({
        listingId,
        listingName,
        listingKind,
        path: listingKind === 'mess' ? `/meals/${listingId}` : `/places/${listingId}`,
      });
    }
  }, [listingId, listingKind, listingName, open]);

  function handleClose() {
    if (busyRef.current) {
      return;
    }
    onClose();
  }

  async function submitEnquiry() {
    if (busyRef.current) {
      return;
    }
    const trimmedEmail = email.trim();
    if (!isValidEmail(trimmedEmail)) {
      setError(t('discovery.enquireEmailInvalid'));
      return;
    }
    busyRef.current = true;
    setBusy(true);
    setError(null);
    try {
      const space = await resolveDiscoverSpace(listingId, listingName, listingKind);
      if (!space) {
        setError(t('discovery.enquireListingUnavailable'));
        return;
      }
      if (space.ownedByCurrentUser) {
        clearEnquireIntent();
        setStep('own');
        return;
      }
      const created = await createSpaceEnquiry(space.spaceId, trimmedEmail);
      clearEnquireIntent();
      setSubmitted(created);
      setStep(created.reusedExisting ? 'already' : 'sent');
      void refreshUser();
    } catch (err) {
      if (err instanceof PublicApiError && err.errorCode === 'SELF_ENQUIRY_NOT_ALLOWED') {
        clearEnquireIntent();
        setStep('own');
        return;
      }
      if (err instanceof PublicApiError && err.status === 401) {
        setStep('gate');
        openAuth('login');
        return;
      }
      setError(err instanceof PublicApiError ? err.message : t('discovery.enquireSubmitError'));
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  const alreadyShared = step === 'already' && submitted?.status === 'SHARED';
  const sharedAtDate = submitted?.sharedAt ? new Date(submitted.sharedAt) : null;
  const sharedOn =
    sharedAtDate && !Number.isNaN(sharedAtDate.getTime())
      ? sharedAtDate.toLocaleString(i18n.language, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })
      : null;
  const sentTo = submitted?.requesterEmail?.trim() || email.trim() || null;
  const alreadyPending = step === 'already' && !alreadyShared;
  const title =
    alreadyShared
      ? t('discovery.enquireAlreadySharedTitle')
      : alreadyPending
        ? t('discovery.enquireAlreadyPendingTitle')
        : step === 'sent'
          ? t('discovery.enquireSentTitle')
          : step === 'own'
            ? t('discovery.enquireOwnTitle')
            : step === 'request'
              ? t('discovery.enquireRequestTitle')
              : t('discovery.enquireSignInTitle');
  const body =
    alreadyShared
      ? t('discovery.enquireAlreadySharedBody')
      : alreadyPending
        ? t('discovery.enquireAlreadyPendingBody')
        : step === 'sent'
          ? t('discovery.enquireSentBody')
          : step === 'own'
            ? t('discovery.enquireOwnBody')
            : step === 'request'
              ? t('discovery.enquireRequestBody')
              : t('discovery.enquireSignInBody');
  const showResult = step === 'own' || step === 'sent' || step === 'already';
  const selectedSaved = savedEmails.find((value) => value === email.trim().toLowerCase()) ?? null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      labelledBy="enquire-title"
      describedBy={busy ? 'enquire-submitting' : 'enquire-body'}
      closeOnBackdrop={!busy}
      className="relative max-w-md overflow-hidden p-6"
    >
      {busy ? (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 px-6 text-center"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <Loader2 aria-hidden className="h-8 w-8 animate-spin text-primary" />
          <p id="enquire-submitting" className="mt-4 text-[16px] font-semibold text-navy">
            {t('discovery.enquireSubmitting')}
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-text-secondary">
            {t('discovery.enquireSubmittingHint')}
          </p>
        </div>
      ) : null}

      {showResult ? (
        <div className="text-center">
          <div
            className={`mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full ${
              alreadyShared || step === 'sent'
                ? 'bg-[#E7F6EE] text-primary'
                : alreadyPending
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-soft text-navy'
            }`}
          >
            {alreadyShared ? (
              <MailCheck aria-hidden className="h-7 w-7" />
            ) : alreadyPending ? (
              <Clock aria-hidden className="h-7 w-7" />
            ) : step === 'sent' ? (
              <CheckCircle2 aria-hidden className="h-7 w-7" />
            ) : (
              <Mail aria-hidden className="h-7 w-7" />
            )}
          </div>
          <h2 id="enquire-title" className="mt-4 text-xl font-semibold tracking-tight text-navy">
            {title}
          </h2>
          <p id="enquire-body" className="mt-2 text-[15px] leading-relaxed text-text-secondary">
            {body}
          </p>
          {listingName ? (
            <p className="mt-4 rounded-xl bg-soft px-3 py-2.5 text-[13px] font-semibold text-navy">{listingName}</p>
          ) : null}
          {alreadyShared ? (
            <div className="mt-3 rounded-2xl border border-primary/15 bg-[#E7F6EE] px-4 py-3 text-left">
              {sharedOn ? (
                <p className="flex items-start gap-2.5 text-[13px] text-navy">
                  <CalendarDays aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    {t('enquiries.respondedOnLabel')}
                    <span className="mt-0.5 block text-[15px] font-semibold">{sharedOn}</span>
                  </span>
                </p>
              ) : null}
              {sentTo ? (
                <p className={`flex items-start gap-2.5 text-[13px] text-navy ${sharedOn ? 'mt-3' : ''}`}>
                  <Mail aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    {t('enquiries.sentToLabel')}
                    <span className="mt-0.5 block break-all text-[15px] font-semibold">{sentTo}</span>
                  </span>
                </p>
              ) : null}
              <p className="mt-3 text-[12px] leading-relaxed text-text-secondary">
                {t('discovery.enquireAlreadyNoNewEmail')} {t('enquiries.respondedOnHint')}
              </p>
            </div>
          ) : null}
          {alreadyPending ? (
            <p className="mt-3 rounded-2xl bg-amber-50 px-4 py-3 text-left text-[13px] leading-relaxed text-amber-900">
              {t('discovery.enquireAlreadyPendingHint')}
            </p>
          ) : null}
          <ActionButton disabled={busy} onClick={handleClose} className="mt-6 w-full">
            {t('discovery.enquireDone')}
          </ActionButton>
        </div>
      ) : (
        <>
          <h2 id="enquire-title" className="text-xl font-semibold tracking-tight text-navy">
            {title}
          </h2>
          <p id="enquire-body" className="mt-3 text-[15px] leading-relaxed text-text-secondary">
            {body}
          </p>
        </>
      )}

      {error ? (
        <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-[13px] text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {step === 'gate' && !isBootstrapping ? (
        <div className="mt-6 flex flex-col gap-3">
          <ActionButton
            disabled={busy}
            onClick={() => {
              saveEnquireIntent({
                listingId,
                listingName,
                listingKind,
                path: window.location.pathname,
              });
              openAuth('login');
            }}
          >
            {t('nav.signIn')}
          </ActionButton>
          <ActionButton
            variant="ghost"
            disabled={busy}
            onClick={() => {
              saveEnquireIntent({
                listingId,
                listingName,
                listingKind,
                path: window.location.pathname,
              });
              openAuth('register');
            }}
          >
            {t('auth.createAccount')}
          </ActionButton>
          <ActionButton variant="ghost" disabled={busy} onClick={handleClose}>
            {t('auth.continueBrowsing')}
          </ActionButton>
        </div>
      ) : null}

      {step === 'request' && isAuthenticated ? (
        <form
          className="mt-5 space-y-4"
          aria-busy={busy || undefined}
          onSubmit={(event) => {
            event.preventDefault();
            void submitEnquiry();
          }}
        >
          {savedEmails.length > 0 ? (
            <div>
              <p className="text-[13px] font-medium text-navy">{t('discovery.enquireSavedEmails')}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {savedEmails.map((saved) => (
                  <button
                    key={saved}
                    type="button"
                    disabled={busy}
                    onClick={() => setEmail(saved)}
                    className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                      saved === selectedSaved
                        ? 'border-primary bg-primary/10 text-navy'
                        : 'border-border bg-soft text-text-secondary'
                    }`}
                  >
                    {saved}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setEmail('')}
                  className={`rounded-full border px-3 py-1.5 text-[12px] font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                    selectedSaved == null
                      ? 'border-primary bg-primary/10 text-navy'
                      : 'border-border bg-soft text-text-secondary'
                  }`}
                >
                  {t('discovery.enquireUseDifferentEmail')}
                </button>
              </div>
            </div>
          ) : null}
          <label className="block text-[13px] font-medium text-navy">
            {t('discovery.enquireEmailLabel')}
            <input
              className="mt-1 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:bg-soft disabled:opacity-70"
              type="email"
              autoComplete="email"
              value={email}
              disabled={busy}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <p className="rounded-xl bg-soft px-3 py-2 text-[12px] leading-relaxed text-text-secondary">
            {t('discovery.enquirePrivacy')}
          </p>
          <ActionButton type="submit" disabled={busy} className="w-full">
            {busy ? t('auth.pleaseWait') : t('discovery.enquireSend')}
          </ActionButton>
          <ActionButton variant="ghost" disabled={busy} onClick={handleClose} className="w-full">
            {t('discovery.enquireCancel')}
          </ActionButton>
        </form>
      ) : null}
    </Modal>
  );
}
