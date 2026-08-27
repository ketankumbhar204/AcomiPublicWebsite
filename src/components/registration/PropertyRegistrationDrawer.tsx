import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { sendOtp, verifyOtp } from '../../api/authApi';
import { createMessRegistration } from '../../api/messRegistrationApi';
import { createPropertyRegistration } from '../../api/propertyRegistrationApi';
import {
  isVerificationExpired,
  sendOtpErrorMessage,
  submitErrorMessage,
  verifyOtpErrorMessage,
} from '../../lib/registrationErrors';
import { Modal } from '../common/Modal';
import { CtaButton, SecondaryButton } from './RegistrationButtons';
import { RegistrationStepper } from './RegistrationStepper';
import { RegistrationSuccess } from './RegistrationSuccess';
import { StepDetails } from './StepDetails';
import { StepProperty } from './StepProperty';
import { StepVerify } from './StepVerify';
import type { VerifyPhase } from './StepVerify';
import {
  EMPTY_FORM,
  buildMessRequest,
  buildRequest,
  clearDraft,
  readDraft,
  validateDetailsStep,
  validateMobile,
  validatePropertyStep,
  writeDraft,
} from './registrationForm';
import type { FieldErrors, RegistrationForm } from './registrationForm';
import type { ListingKind } from '../../constants/listing';
import { LISTING_COPY } from '../../constants/listing';

const PROPERTY_OTP_PURPOSE = 'PROPERTY_REGISTRATION' as const;
const MESS_OTP_PURPOSE = 'MESS_REGISTRATION' as const;

/** Property type renders as a radio group, so it has no element carrying the field id. */
function focusField(key: string): void {
  const target =
    document.getElementById(key) ??
    document.querySelector<HTMLElement>(`[name="${key}"]`);
  target?.focus();
  target?.scrollIntoView({ block: 'center' });
}

function secondsUntil(target: number | null): number {
  if (target === null) {
    return 0;
  }
  return Math.max(0, Math.ceil((target - Date.now()) / 1000));
}

/** Ticks once a second while a resend cooldown is running. */
function useSecondsLeft(target: number | null): number {
  const [secondsLeft, setSecondsLeft] = useState(() => secondsUntil(target));

  useEffect(() => {
    setSecondsLeft(secondsUntil(target));
    if (target === null) {
      return;
    }
    const id = window.setInterval(() => {
      const next = secondsUntil(target);
      setSecondsLeft(next);
      if (next <= 0) {
        window.clearInterval(id);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return secondsLeft;
}

type PropertyRegistrationDrawerProps = {
  open: boolean;
  kind: ListingKind;
  onClose: () => void;
};

function formForKind(kind: ListingKind, form: RegistrationForm): RegistrationForm {
  if (kind === 'mess') {
    return { ...form, propertyType: 'MESS' };
  }
  if (form.propertyType === 'MESS') {
    return { ...form, propertyType: null };
  }
  return form;
}

export function PropertyRegistrationDrawer({ open, kind, onClose }: PropertyRegistrationDrawerProps) {
  const copy = LISTING_COPY[kind];
  const restored = useRef(readDraft(copy.draftKey)).current;

  const [step, setStep] = useState(restored.step);
  const [form, setForm] = useState<RegistrationForm>(() => formForKind(kind, restored.form));
  const [errors, setErrors] = useState<FieldErrors>({});

  const [phase, setPhase] = useState<VerifyPhase>('idle');
  const [otp, setOtp] = useState('');
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [resendAt, setResendAt] = useState<number | null>(null);

  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [result, setResult] = useState<{ reference: string } | null>(null);
  const otpPurpose = kind === 'mess' ? MESS_OTP_PURPOSE : PROPERTY_OTP_PURPOSE;

  const bodyRef = useRef<HTMLDivElement | null>(null);
  const resendSeconds = useSecondsLeft(resendAt);
  const kindRef = useRef(kind);
  const skipPersist = useRef(false);

  // Typed fields survive a refresh; the OTP and the token deliberately do not.
  useEffect(() => {
    if (skipPersist.current) {
      skipPersist.current = false;
      return;
    }
    if (!result && open) {
      writeDraft(form, step, copy.draftKey);
    }
  }, [form, step, result, open, copy.draftKey]);

  const updateField = useCallback(
    <K extends keyof RegistrationForm>(key: K, value: RegistrationForm[K]) => {
      setForm((current) => ({ ...current, [key]: value }));
      setErrors((current) => {
        if (!(key in current)) {
          return current;
        }
        const next = { ...current };
        delete next[key];
        return next;
      });
    },
    [],
  );

  function goToStep(next: number) {
    setStep(next);
    setErrors({});
    bodyRef.current?.scrollTo({ top: 0 });
  }

  function handleContinue() {
    const found = step === 1 ? validatePropertyStep(form) : validateDetailsStep(form);
    const firstInvalid = Object.keys(found)[0];
    if (firstInvalid) {
      setErrors(found);
      // Step 2 is taller than the drawer, so move to the problem instead of letting
      // Continue look unresponsive.
      requestAnimationFrame(() => focusField(firstInvalid));
      return;
    }
    goToStep(step + 1);
  }

  function resetVerification() {
    setPhase('idle');
    setOtp('');
    setVerificationToken(null);
    setResendAt(null);
    setSendError(null);
    setVerifyError(null);
    setSubmitError(null);
  }

  useEffect(() => {
    if (!open) {
      return;
    }
    skipPersist.current = true;
    const restoredDraft = readDraft(copy.draftKey);
    setForm(formForKind(kind, restoredDraft.form));
    setStep(kind === kindRef.current ? restoredDraft.step : 1);
    setErrors({});
    setResult(null);
    resetVerification();
    kindRef.current = kind;
  }, [open, kind, copy.draftKey]);

  async function handleSendOtp() {
    const found = validateMobile(form);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }
    setSending(true);
    setSendError(null);
    setVerifyError(null);
    try {
      const response = await sendOtp(form.mobileNumber, otpPurpose);
      setOtp('');
      setPhase('sent');
      // Cooldown comes from the backend so the provider's policy stays server-side.
      setResendAt(Date.now() + Math.max(0, response.resendAfter) * 1000);
    } catch (error) {
      setSendError(sendOtpErrorMessage(error));
    } finally {
      setSending(false);
    }
  }

  async function handleVerifyOtp(candidate = otp) {
    if (candidate.length !== 6) {
      setVerifyError('Enter the 6-digit OTP.');
      return;
    }
    setVerifying(true);
    setVerifyError(null);
    try {
      const response = await verifyOtp(form.mobileNumber, candidate, otpPurpose);
      setVerificationToken(response.verificationToken);
      setPhase('verified');
      setSendError(null);
    } catch (error) {
      // Kept separate from sendError so a verify failure can never surface send copy.
      setVerifyError(verifyOtpErrorMessage(error));
    } finally {
      setVerifying(false);
    }
  }

  async function handleSubmit() {
    if (!verificationToken) {
      return;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      const response =
        kind === 'mess'
          ? await createMessRegistration(buildMessRequest(form, verificationToken))
          : await createPropertyRegistration(buildRequest(form, verificationToken));
      clearDraft(copy.draftKey);
      setResult(response);
    } catch (error) {
      setSubmitError(submitErrorMessage(error));
      if (isVerificationExpired(error)) {
        // The token is single-use, so a rejected one can never succeed on retry.
        resetVerification();
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleClose() {
    if (result) {
      // A submitted registration must not reappear when the drawer is opened again.
      setResult(null);
      setForm(formForKind(kind, EMPTY_FORM));
      setStep(1);
      setErrors({});
      resetVerification();
    }
    onClose();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      labelledBy={copy.titleId}
      variant="drawer"
      closeOnBackdrop
      className="sm:max-w-[480px] lg:max-w-[500px]"
    >
      {result ? (
        <RegistrationSuccess
          titleId={copy.titleId}
          title={copy.successTitle}
          body={copy.successBody}
          reference={result.reference}
          onClose={handleClose}
        />
      ) : (
        <>
          <header className="shrink-0 border-b border-border px-5 pt-4 pb-3.5 sm:px-6">
            <div className="flex items-center gap-2">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => goToStep(step - 1)}
                  aria-label="Back to previous step"
                  className="reg-focus -ml-1.5 rounded-lg p-1.5 text-muted transition hover:bg-background hover:text-text"
                >
                  <ArrowLeft aria-hidden className="h-4 w-4" />
                </button>
              ) : null}
              <h2 id={copy.titleId} className="flex-1 text-[16px] font-semibold text-text">
                {copy.title}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close"
                className="reg-focus -mr-1.5 rounded-lg p-1.5 text-muted transition hover:bg-background hover:text-text"
              >
                <X aria-hidden className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-3.5">
              <RegistrationStepper current={step} steps={copy.stepper} />
            </div>
          </header>

          <div ref={bodyRef} className="flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
            {step === 1 ? (
              <StepProperty
                form={form}
                errors={errors}
                copy={copy}
                showTypeSelect={kind === 'property'}
                onChange={updateField}
              />
            ) : null}
            {step === 2 ? (
              <StepDetails form={form} errors={errors} kind={kind} onChange={updateField} />
            ) : null}
            {step === 3 ? (
              <StepVerify
                form={form}
                errors={errors}
                kind={kind}
                onChange={updateField}
                phase={phase}
                otp={otp}
                onOtpChange={(value) => {
                  setOtp(value);
                  setVerifyError(null);
                }}
                sending={sending}
                verifying={verifying}
                sendError={sendError}
                verifyError={verifyError}
                resendSeconds={resendSeconds}
                onSendOtp={handleSendOtp}
                onVerifyOtp={handleVerifyOtp}
                onChangeNumber={resetVerification}
                onEditStep={goToStep}
              />
            ) : null}
          </div>

          <footer className="shrink-0 border-t border-border px-5 py-4 sm:px-6">
            {submitError ? (
              <p role="alert" className="mb-3 text-[12px] text-danger">
                {submitError}
              </p>
            ) : null}
            <div className="flex gap-2.5">
              {step > 1 ? (
                <SecondaryButton onClick={() => goToStep(step - 1)}>
                  <ArrowLeft aria-hidden className="h-4 w-4" />
                  Back
                </SecondaryButton>
              ) : null}
              {step < 3 ? (
                <CtaButton onClick={handleContinue} className="flex-1">
                  Continue
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </CtaButton>
              ) : (
                <CtaButton
                  onClick={handleSubmit}
                  loading={submitting}
                  disabled={phase !== 'verified'}
                  className="flex-1"
                >
                  {kind === 'mess' ? 'Submit mess' : 'Submit property'}
                </CtaButton>
              )}
            </div>
          </footer>
        </>
      )}
    </Modal>
  );
}
