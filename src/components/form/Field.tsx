import type { ReactNode } from 'react';

export const FIELD_INPUT_BASE =
  'reg-focus w-full rounded-2xl border bg-white px-3.5 py-3 text-[14px] text-text transition placeholder:text-muted/70';

export function inputClasses(hasError: boolean): string {
  return `${FIELD_INPUT_BASE} ${
    hasError ? 'border-danger' : 'border-border focus:border-register'
  }`;
}

type FieldProps = {
  /** Must match the control's id so the label and error are wired to it. */
  htmlFor: string;
  label: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

export function Field({ htmlFor, label, required = false, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-[13px] font-semibold text-text">
        {label}
        {required ? <span className="ml-0.5 text-danger">*</span> : null}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={`${htmlFor}-error`} className="mt-1 text-[12px] text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
