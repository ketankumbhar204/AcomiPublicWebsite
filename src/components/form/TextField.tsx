import type { HTMLInputTypeAttribute } from 'react';
import { Field, inputClasses } from './Field';

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  inputMode?: 'text' | 'numeric' | 'tel' | 'url';
  maxLength?: number;
  autoComplete?: string;
};

export function TextField({
  id,
  label,
  value,
  onChange,
  required = false,
  error,
  placeholder,
  type = 'text',
  inputMode,
  maxLength,
  autoComplete,
}: TextFieldProps) {
  return (
    <Field htmlFor={id} label={label} required={required} error={error}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className={inputClasses(Boolean(error))}
      />
    </Field>
  );
}

type TextAreaFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength: number;
  rows?: number;
};

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  rows = 3,
}: TextAreaFieldProps) {
  return (
    <Field htmlFor={id} label={label}>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        rows={rows}
        className={`${inputClasses(false)} resize-none`}
      />
      <p className="mt-1 text-right text-[11px] text-muted">
        {value.length}/{maxLength}
      </p>
    </Field>
  );
}
