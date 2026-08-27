import { useRef } from 'react';

const LENGTH = 6;

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  /** Fired when the sixth digit lands, so the visitor does not hunt for a button. */
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: string;
};

export function OtpInput({ value, onChange, onComplete, disabled = false, error }: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  function commit(next: string) {
    onChange(next);
    if (next.length === LENGTH) {
      onComplete?.(next);
    }
  }

  function focusAt(index: number) {
    inputsRef.current[Math.max(0, Math.min(LENGTH - 1, index))]?.focus();
  }

  /*
   * The code is held as a plain prefix string, so box i simply renders value[i]. Editing
   * always truncates rather than blanking a slot, which keeps the digits from shifting left.
   */
  function handleChange(index: number, raw: string) {
    const digits = raw.replace(/\D/g, '');
    if (!digits) {
      return;
    }
    // One field receives the whole code when the OS autofills an SMS.
    const next = (value.slice(0, index) + digits).slice(0, LENGTH);
    commit(next);
    focusAt(next.length);
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (value[index]) {
        onChange(value.slice(0, index));
        focusAt(index);
        return;
      }
      onChange(value.slice(0, Math.max(0, index - 1)));
      focusAt(index - 1);
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      focusAt(index - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      focusAt(index + 1);
    }
  }

  return (
    <div>
      <div
        role="group"
        aria-label="Enter the 6-digit OTP"
        aria-describedby={error ? 'otp-error' : undefined}
        className="flex gap-2"
      >
        {Array.from({ length: LENGTH }).map((_, index) => (
          <input
            key={index}
            ref={(node) => {
              inputsRef.current[index] = node;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            maxLength={LENGTH}
            value={value[index] ?? ''}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${LENGTH}`}
            aria-invalid={error ? true : undefined}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            className={`reg-focus h-11 w-full min-w-0 rounded-lg border bg-white text-center text-[16px] font-semibold text-text transition disabled:bg-background disabled:text-muted ${
              error ? 'border-danger' : 'border-border focus:border-register'
            }`}
          />
        ))}
      </div>
      {error ? (
        <p id="otp-error" className="mt-1.5 text-[12px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
