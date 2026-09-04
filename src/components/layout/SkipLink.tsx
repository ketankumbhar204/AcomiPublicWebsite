import { useTranslation } from 'react-i18next';

export function SkipLink() {
  const { t } = useTranslation();

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-text focus:shadow-lg"
    >
      {t('a11y.skipToContent')}
    </a>
  );
}
