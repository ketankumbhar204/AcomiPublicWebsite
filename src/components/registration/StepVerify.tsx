import { CheckCircle2 } from 'lucide-react';
import { Field, inputClasses } from '../form/Field';
import { OtpInput } from '../form/OtpInput';
import type { ListingKind } from '../../constants/listing';
import { LISTING_COPY } from '../../constants/listing';
import { getPropertyTypeOption } from '../../constants/propertyRegistration';
import { digitsOnly, formatCountdown, formatRupees } from '../../lib/indianMobile';
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
  onEditStep: (step: number) => void;
};

function ReviewRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit?: () => void;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <dt className="text-[12px] text-muted">{label}</dt>
      <dd className="flex items-baseline gap-2 text-right text-[13px] font-medium text-text">
        <span>{value}</span>
        {onEdit ? (
          <button
            type="button"
            onClick={onEdit}
            className="reg-focus rounded text-[11px] font-semibold text-register hover:underline"
          >
            Edit
          </button>
        ) : null}
      </dd>
    </div>
  );
}

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
  onEditStep,
}: StepVerifyProps) {
  const option = form.propertyType ? getPropertyTypeOption(form.propertyType) : null;
  const price = Number(form.startingPrice);
  const mealPrice = Number(form.mealPrice);
  const copy = LISTING_COPY[kind];
  const locked = phase !== 'idle';

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-[15px] font-semibold text-text">Verify your mobile number</h3>
        <div className="mt-3">
          <Field htmlFor="mobileNumber" label="Mobile number" required error={errors.mobileNumber}>
            <div className="flex items-stretch gap-2">
              <span className="flex items-center rounded-lg border border-border bg-background px-3 text-[14px] font-medium text-text-secondary">
                +91
              </span>
              <input
                id="mobileNumber"
                value={form.mobileNumber}
                onChange={(event) => onChange('mobileNumber', digitsOnly(event.target.value, 10))}
                disabled={locked}
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="98765 43210"
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
              Send OTP
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
            Change number
          </button>
        ) : null}
      </div>

      {phase === 'sent' ? (
        <div className="space-y-3">
          <p className="text-[13px] font-semibold text-text">Enter the 6-digit OTP</p>
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
                Resend OTP in {formatCountdown(resendSeconds)}
              </p>
            ) : (
              <button
                type="button"
                onClick={onSendOtp}
                disabled={sending}
                className="reg-focus rounded text-[12px] font-semibold text-register hover:underline disabled:opacity-50"
              >
                Resend OTP
              </button>
            )}
            <CtaButton onClick={() => onVerifyOtp()} loading={verifying} disabled={otp.length !== 6}>
              Verify OTP
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
        <>
          <p className="flex items-center gap-2 rounded-lg bg-register-soft px-3 py-2 text-[13px] font-semibold text-register">
            <CheckCircle2 aria-hidden className="h-4 w-4" />
            Mobile verified
          </p>

          <dl className="divide-y divide-border rounded-xl border border-border px-3 py-1">
            <ReviewRow
              label={copy.reviewNameLabel}
              value={form.propertyName}
              onEdit={() => onEditStep(1)}
            />
            {kind === 'property' ? (
              <ReviewRow label="Type" value={option?.title ?? '—'} onEdit={() => onEditStep(1)} />
            ) : null}
            <ReviewRow
              label="Location"
              value={`${form.city}, ${form.state}`}
              onEdit={() => onEditStep(2)}
            />
            <ReviewRow
              label={kind === 'mess' ? 'Monthly price' : 'Starting price'}
              value={
                Number.isFinite(price)
                  ? `₹${formatRupees(price)} ${kind === 'mess' ? 'per month' : (option?.priceSuffix ?? '')}`.trim()
                  : '—'
              }
              onEdit={() => onEditStep(2)}
            />
            {kind === 'mess' ? (
              <ReviewRow
                label="Per meal / tiffin"
                value={Number.isFinite(mealPrice) ? `₹${formatRupees(mealPrice)} per meal / tiffin` : '—'}
                onEdit={() => onEditStep(2)}
              />
            ) : null}
            {form.capacityEstimate ? (
              <ReviewRow label="Capacity" value={form.capacityEstimate} />
            ) : null}
          </dl>
        </>
      ) : null}
    </div>
  );
}
