import { useTranslation } from 'react-i18next';
import {
  changeAppLanguage,
  SUPPORTED_LANGUAGES,
  type AppLanguage,
} from '../../i18n';

type LanguageSelectProps = {
  className?: string;
};

export function LanguageSelect({ className = '' }: LanguageSelectProps) {
  const { t, i18n } = useTranslation();
  const current = (i18n.language?.split('-')[0] ?? 'en') as AppLanguage;
  const value = SUPPORTED_LANGUAGES.includes(current) ? current : 'en';

  return (
    <label className={`inline-flex items-center ${className}`}>
      <span className="sr-only">{t('language.select')}</span>
      <select
        value={value}
        aria-label={t('language.select')}
        onChange={(event) => {
          const next = event.target.value as AppLanguage;
          if (next === value) return;
          void changeAppLanguage(next);
        }}
        className="h-9 rounded-full border border-border bg-white px-3 text-sm font-medium text-text shadow-sm outline-none transition hover:border-text/20 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <option key={language} value={language}>
            {t(`language.names.${language}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
