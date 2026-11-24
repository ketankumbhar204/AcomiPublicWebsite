import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { RegistrationStepId } from '../../constants/listing';

const DEFAULT_STEPS: readonly RegistrationStepId[] = [
  'property',
  'details',
  'verify',
  'photos',
  'review',
];

export function RegistrationStepper({
  current,
  steps = DEFAULT_STEPS,
}: {
  current: number;
  steps?: readonly RegistrationStepId[];
}) {
  const { t } = useTranslation();
  const inset = `${50 / steps.length}%`;
  return (
    <ol className="relative flex" aria-label={t('registration.progressAria')}>
      <span
        aria-hidden
        className="absolute top-3.5 h-px bg-border"
        style={{ left: inset, right: inset }}
      />
      {steps.map((id, index) => {
        const step = index + 1;
        const isDone = step < current;
        const isCurrent = step === current;
        const label = t(`registration.steps.${id}`);

        return (
          <li key={id} className="relative z-10 flex flex-1 flex-col items-center gap-1.5">
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
              {isCurrent ? <span className="sr-only"> {t('registration.currentStep')}</span> : null}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
