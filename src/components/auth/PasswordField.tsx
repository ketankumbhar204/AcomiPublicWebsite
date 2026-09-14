import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PASSWORD_MAX_LENGTH } from '../../auth/validation';

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  disabled?: boolean;
};

export function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete = 'current-password',
  disabled = false,
}: PasswordFieldProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <label className="block text-[13px] font-medium text-navy" htmlFor={id}>
      {label}
      <span className="relative mt-1 block">
        <input
          id={id}
          className="w-full rounded-xl border border-border bg-white py-2.5 pr-12 pl-3 text-sm text-navy outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          maxLength={PASSWORD_MAX_LENGTH}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-1 z-10 inline-flex w-10 items-center justify-center rounded-lg text-navy hover:bg-soft hover:text-primary"
          aria-label={visible ? t('auth.hidePassword') : t('auth.showPassword')}
          aria-pressed={visible}
          tabIndex={0}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? (
            <EyeOff className="h-5 w-5" strokeWidth={2.2} aria-hidden />
          ) : (
            <Eye className="h-5 w-5" strokeWidth={2.2} aria-hidden />
          )}
        </button>
      </span>
    </label>
  );
}
