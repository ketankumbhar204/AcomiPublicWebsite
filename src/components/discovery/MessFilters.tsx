import { useTranslation } from 'react-i18next';

export function MessFilters() {
  const { t } = useTranslation();

  return (
    <p className="text-[13px] leading-relaxed text-text-secondary">
      {t('mealsPage.filtersHint')}
    </p>
  );
}
