import { Check } from 'lucide-react';

const DEFAULT_STEPS = ['Property', 'Details', 'Verify & Submit'] as const;

export function RegistrationStepper({
  current,
  steps = DEFAULT_STEPS,
}: {
  current: number;
  steps?: readonly [string, string, string];
}) {
  return (
    <ol className="relative flex" aria-label="Registration progress">
      <span
        aria-hidden
        className="absolute top-3.5 right-[16.5%] left-[16.5%] h-px bg-border"
      />
      {steps.map((label, index) => {
        const step = index + 1;
        const isDone = step < current;
        const isCurrent = step === current;

        return (
          <li key={label} className="relative z-10 flex flex-1 flex-col items-center gap-1.5">
            <span
              aria-hidden
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold ${
                isDone
                  ? 'bg-register-soft text-register'
                  : isCurrent
                    ? 'bg-register text-white'
                    : 'bg-white text-muted ring-1 ring-border'
              }`}
            >
              {isDone ? <Check className="h-3.5 w-3.5" /> : step}
            </span>
            <span
              className={`text-center text-[11px] leading-tight font-medium ${
                isCurrent ? 'text-text' : 'text-muted'
              }`}
            >
              {label}
              {isCurrent ? <span className="sr-only"> (current step)</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
