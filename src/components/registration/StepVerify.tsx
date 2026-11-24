import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Field, inputClasses } from '../form/Field';
import { OtpInput } from '../form/OtpInput';
import type { ListingKind } from '../../constants/listing';
import { formatCountdown, normalizeMobile } from '../../lib/indianMobile';
import { CtaButton } from './RegistrationButtons';
import type { FieldErrors, RegistrationForm } from './registrationForm';

export type VerifyPhase = 'idle' | 'sent' | 'verified';

type StepVerifyProps = {
  form: RegistrationForm;
  errors: FieldErrors;
  kind: ListingKind;
  onChange: <K extends keyof RegistrationForm>(key: K, value: RegistrationForm[K]) => void;
  phase: VerifyPhase;
  otp: string;
  onOtpChange: (value: string) => void;
  sending: boolean;
  verifying: boolean;
  sendError: string | null;
  verifyError: string | null;
  resendSeconds: number;
  onSendOtp: () => void;
  /** Called with the freshly typed code on autofill, and with nothing from the button. */
  onVerifyOtp: (value?: string) => void;
  onChangeNumber: () => void;
  /** Local Vite + local API only. Never rendered in production builds. */
  allowLocalSkip?: boolean;
  localSkipChecked?: boolean;
  onLocalSkipChange?: (checked: boolean) => void;
};

export function StepVerify({
  form,
  errors,
  kind,
  onChange,
  phase,
  otp,
  onOtpChange,
  sending,
  verifying,
  sendError,
  verifyError,
  resendSeconds,
  onSendOtp,
  onVerifyOtp,
  onChangeNumber,
  allowLocalSkip = false,
  localSkipChecked = false,
  onLocalSkipChange,
}: StepVerifyProps) {
  const { t } = useTranslation();
  const locked = phase !== 'idle';

  return (
    <div className="space-y-5" data-listing-kind={kind}>
      <div>
        <h3 className="text-[15px] font-semibold text-text">{t('registration.verify.title')}</h3>
        <div className="mt-3">
          <Field
            htmlFor="mobileNumber"
            label={t('registration.fields.mobileNumber')}
            required
            error={errors.mobileNumber}
          >
            <div className="flex items-stretch gap-2">
              <span className="flex items-center rounded-lg border border-border bg-background px-3 text-[14px] font-medium text-text-secondary">
                +91
              </span>
              <input
                id="mobileNumber"
                value={form.mobileNumber}
                onChange={(event) => onChange('mobileNumber', normalizeMobile(event.target.value))}
                disabled={locked}
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder={t('registration.fields.mobilePlaceholder')}
                aria-invalid={errors.mobileNumber ? true : undefined}
                aria-describedby={errors.mobileNumber ? 'mobileNumber-error' : undefined}
                className={`${inputClasses(Boolean(errors.mobileNumber))} flex-1 disabled:bg-background disabled:text-text-secondary`}
              />
            </div>
          </Field>
        </div>

        {phase === 'idle' ? (
          <>
            <CtaButton
              onClick={onSendOtp}
              loading={sending}
              className="mt-3 w-full"
              disabled={form.mobileNumber.length !== 10}
            >
              {t('registration.verify.sendOtp')}
            </CtaButton>
            {sendError ? (
              <p role="alert" className="mt-2 text-[12px] text-danger">
                {sendError}
              </p>
            ) : null}
          </>
        ) : null}

        {locked ? (
          <button
            type="button"
            onClick={onChangeNumber}
            className="reg-focus mt-2 rounded text-[12px] font-semibold text-register hover:underline"
          >
            {t('registration.verify.changeNumber')}
          </button>
        ) : null}
      </div>

      {phase === 'sent' ? (
        <div className="space-y-3">
          <p className="text-[13px] font-semibold text-text">{t('registration.verify.enterOtp')}</p>
          <OtpInput
            value={otp}
            onChange={onOtpChange}
            onComplete={(value) => onVerifyOtp(value)}
            disabled={verifying}
            error={verifyError ?? undefined}
          />
          <div className="flex items-center justify-between gap-3">
            {resendSeconds > 0 ? (
              <p className="text-[12px] text-muted" aria-live="polite">
                {t('registration.verify.resendIn', { time: formatCountdown(resendSeconds) })}
              </p>
            ) : (
              <button
                type="button"
                onClick={onSendOtp}
                disabled={sending}
                className="reg-focus rounded text-[12px] font-semibold text-register hover:underline disabled:opacity-50"
              >
                {t('registration.verify.resendOtp')}
              </button>
            )}
            <CtaButton onClick={() => onVerifyOtp()} loading={verifying} disabled={otp.length !== 6}>
              {t('registration.verify.verifyOtp')}
            </CtaButton>
          </div>
          {/* Resend problems belong to sending, so they never render as a verify failure. */}
          {sendError ? (
            <p role="alert" className="text-[12px] text-danger">
              {sendError}
            </p>
          ) : null}
        </div>
      ) : null}

      {phase === 'verified' ? (
        <p className="flex items-center gap-2 rounded-lg bg-register-soft px-3 py-2 text-[13px] font-semibold text-register">
          <CheckCircle2 aria-hidden className="h-4 w-4" />
          {t('registration.verify.mobileVerified')}
        </p>
      ) : null}

      {allowLocalSkip ? (
        <label className="flex items-start gap-2.5 rounded-lg bg-background px-3 py-2.5 text-[13px] text-text-secondary">
          <input
            type="checkbox"
            checked={localSkipChecked}
            onChange={(event) => onLocalSkipChange?.(event.target.checked)}
            className="mt-0.5 h-4 w-4 accent-register"
          />
          <span>
            <span className="font-semibold text-text">{t('registration.verify.localTest')}</span>
            {' — '}
            {t('registration.verify.localSkipHint')}
          </span>
        </label>
      ) : null}
    </div>
  );
}
