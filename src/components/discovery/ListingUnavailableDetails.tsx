import { useTranslation } from 'react-i18next';

type ListingUnavailableDetailsProps = {
  className?: string;
};

export function ListingUnavailableDetails({ className = 'mt-5 space-y-1' }: ListingUnavailableDetailsProps) {
  const { t } = useTranslation();
  const rows = [
    {
      label: t('discovery.reviewsRatings', { defaultValue: 'Review & Ratings' }),
      value: t('discovery.notAvailable', { defaultValue: 'Not available' }),
    },
    {
      label: t('discovery.photos', { defaultValue: 'Photos' }),
      value: t('discovery.notAvailable', { defaultValue: 'Not available' }),
    },
  ];

  return (
    <div className={className}>
      {rows.map((row) => (
        <p key={row.label} className="text-[13px] leading-relaxed text-text-secondary">
          <span className="font-semibold text-navy">{row.label}: </span>
          {row.value}
        </p>
      ))}
    </div>
  );
}
