import { Check, X } from 'lucide-react';
import { CtaButton } from './RegistrationButtons';

type RegistrationSuccessProps = {
  /** Must be the id the dialog is labelled by, so the heading keeps naming the dialog. */
  titleId: string;
  title: string;
  body: string;
  reference: string;
  onClose: () => void;
};

export function RegistrationSuccess({
  titleId,
  title,
  body,
  reference,
  onClose,
}: RegistrationSuccessProps) {
  return (
    <div className="flex h-full flex-col justify-center px-5 py-8 text-center sm:px-6">
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="reg-focus absolute top-4 right-4 rounded-lg p-1.5 text-muted transition hover:bg-background hover:text-text"
      >
        <X aria-hidden className="h-5 w-5" />
      </button>

      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-register-soft">
        <Check aria-hidden className="h-7 w-7 text-register" />
      </span>
      <h2 id={titleId} className="mt-5 text-[20px] font-semibold text-text">
        {title}
      </h2>
      <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">{body}</p>
      <div className="mt-5 rounded-xl bg-register-soft px-4 py-3">
        <p className="text-[11px] font-semibold tracking-[0.14em] text-text-secondary uppercase">
          Reference
        </p>
        <p className="mt-1 text-[16px] font-semibold text-register">{reference}</p>
      </div>
      <CtaButton onClick={onClose} className="mt-6 w-full">
        Back to ACOMI
      </CtaButton>
    </div>
  );
}
