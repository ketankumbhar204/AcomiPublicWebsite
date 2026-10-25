import { ExternalLink, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export type RevealedOwnerContact = {
  ownerName?: string | null;
  mobileNumber?: string | null;
  alternateMobileNumber?: string | null;
  additionalMobileNumber?: string | null;
  email?: string | null;
  available?: boolean;
};

type OwnerContactCardProps = {
  contact: RevealedOwnerContact | null | undefined;
  mapUrl?: string | null;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
};

export function OwnerContactCard({ contact, mapUrl, loading = false, error = false, onRetry }: OwnerContactCardProps) {
  const { t } = useTranslation();
  if (!contact && !loading && !error) return null;

  const phones = [contact?.mobileNumber, contact?.alternateMobileNumber, contact?.additionalMobileNumber].filter(
    (value): value is string => Boolean(value && value.trim()),
  );
  const email = contact?.email?.trim() ?? '';
  const name = contact?.ownerName?.trim() ?? '';
  const mapHref = mapUrl?.trim() ?? '';
  const hasDetails = phones.length > 0 || email.length > 0 || name.length > 0 || mapHref.length > 0;

  return (
    <section className="mt-4 rounded-2xl border border-sky-200 bg-[#F3F8FF] p-4 text-left">
      <h3 className="text-[13px] font-bold uppercase tracking-wide text-sky-800">
        {t('discovery.viewHereContactTitle')}
      </h3>
      {loading ? (
        <p className="mt-3 flex items-center gap-2 text-[13px] text-sky-800" role="status">
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-sky-200 border-t-sky-700"
            aria-hidden
          />
          {t('discovery.viewHereContactLoading', { defaultValue: 'Loading contact details…' })}
        </p>
      ) : error ? (
        <div className="mt-3" role="alert">
          <p className="text-[13px] text-text-secondary">
            {t('discovery.viewHereContactFailed', {
              defaultValue: 'Contact details could not be loaded. Try again.',
            })}
          </p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 text-[13px] font-semibold text-[#0F6B4C] underline underline-offset-2"
            >
              {t('discovery.viewHereContactRetry', { defaultValue: 'Try again' })}
            </button>
          ) : null}
        </div>
      ) : hasDetails ? (
        <dl className="mt-3 space-y-2 text-[14px] text-navy">
          {name ? (
            <div>
              <dt className="text-[12px] font-medium text-text-secondary">{t('discovery.viewHereOwner')}</dt>
              <dd className="font-semibold">{name}</dd>
            </div>
          ) : null}
          {phones.map((phone) => (
            <div key={phone} className="flex items-center gap-2">
              <Phone aria-hidden className="h-4 w-4 shrink-0 text-sky-700" />
              <div>
                <dt className="sr-only">{t('discovery.viewHerePhone')}</dt>
                <dd>
                  <a className="font-semibold text-navy underline-offset-2 hover:underline" href={`tel:${phone}`}>
                    {phone}
                  </a>
                </dd>
              </div>
            </div>
          ))}
          {email ? (
            <div className="flex items-center gap-2">
              <Mail aria-hidden className="h-4 w-4 shrink-0 text-sky-700" />
              <div className="min-w-0">
                <dt className="text-[12px] font-medium text-text-secondary">{t('discovery.viewHereEmail')}</dt>
                <dd className="truncate">
                  <a className="font-semibold text-navy underline-offset-2 hover:underline" href={`mailto:${email}`}>
                    {email}
                  </a>
                </dd>
              </div>
            </div>
          ) : null}
          {mapHref ? (
            <div className="flex items-start gap-2">
              <MapPin aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-sky-700" />
              <div className="min-w-0">
                <dt className="text-[12px] font-medium text-text-secondary">{t('discovery.viewHereMap')}</dt>
                <dd>
                  <a
                    href={mapHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#0F6B4C] underline underline-offset-2"
                  >
                    {t('discovery.openMaps')}
                    <ExternalLink aria-hidden className="h-3.5 w-3.5" />
                  </a>
                </dd>
              </div>
            </div>
          ) : null}
        </dl>
      ) : (
        <p className="mt-2 text-[13px] text-text-secondary">{t('discovery.viewHereContactEmpty')}</p>
      )}
    </section>
  );
}
