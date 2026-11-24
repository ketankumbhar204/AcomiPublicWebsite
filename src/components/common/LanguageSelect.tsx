import type { ChangeEvent } from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  changeAppLanguage,
  SUPPORTED_LANGUAGES,
  type AppLanguage,
} from '../../i18n';

type LanguageSelectProps = {
  className?: string;
  /** `icon` is the compact globe control used in the mobile header only. */
  variant?: 'select' | 'icon';
};

export function LanguageSelect({ className = '', variant = 'select' }: LanguageSelectProps) {
  const { t, i18n } = useTranslation();
  const current = (i18n.language?.split('-')[0] ?? 'en') as AppLanguage;
  const value = SUPPORTED_LANGUAGES.includes(current) ? current : 'en';

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value as AppLanguage;
    if (next === value) return;
    void changeAppLanguage(next);
  };

  const options = SUPPORTED_LANGUAGES.map((language) => (
    <option key={language} value={language}>
      {t(`language.names.${language}`)}
    </option>
  ));

  if (variant === 'icon') {
    return (
      <label
        className={`relative inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-text-secondary transition hover:bg-soft hover:text-text focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${className}`}
      >
        <span className="sr-only">{t('language.select')}</span>
        <Globe className="h-5 w-5" aria-hidden />
        <select
          value={value}
          aria-label={t('language.select')}
          onChange={onChange}
          className="absolute inset-0 cursor-pointer opacity-0"
        >
          {options}
        </select>
      </label>
    );
  }

  return (
    <label className={`inline-flex items-center ${className}`}>
      <span className="sr-only">{t('language.select')}</span>
      <select
        value={value}
        aria-label={t('language.select')}
        onChange={onChange}
        className="h-9 rounded-full border border-border bg-white px-3 text-sm font-medium text-text shadow-sm outline-none transition hover:border-text/20 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {options}
      </select>
    </label>
  );
}
