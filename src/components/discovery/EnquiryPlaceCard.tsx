import { Building2, CalendarDays, Clock, Hourglass, Mail, MapPin, Star, Users, UtensilsCrossed } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { SpaceEnquiryResponse } from '../../auth/types';
import { discoverDefaultImageUrl } from '../../data/listings/discoverDefaultImages';
import { ListingImage } from './ListingImage';

type EnquiryPlaceCardProps = {
  enquiry: SpaceEnquiryResponse;
  active?: boolean;
  onOpen: (enquiry: SpaceEnquiryResponse) => void;
};

function formatCardDate(value: string | null | undefined, locale: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function highlightAmenity(enquiry: SpaceEnquiryResponse, mealsIncluded: string): string | null {
  const labels = enquiry.amenityLabels?.filter(Boolean) ?? [];
  if (labels.length > 0) {
    return labels[0];
  }
  if (enquiry.foodIncludedInRent) {
    return mealsIncluded;
  }
  return null;
}

export function EnquiryPlaceCard({ enquiry, active = false, onOpen }: EnquiryPlaceCardProps) {
  const { t, i18n } = useTranslation();
  const typeKey = enquiry.spaceType && ['PG', 'HOSTEL', 'RENTAL', 'CO_LIVING', 'MESS'].includes(enquiry.spaceType)
    ? enquiry.spaceType
    : 'PG';
  const typeLabel = t(`enquiries.placeType.${typeKey}`);
  const amenity = highlightAmenity(enquiry, t('enquiries.mealsIncluded'));
  const responded = formatCardDate(enquiry.sharedAt, i18n.language);
  const requested = formatCardDate(enquiry.requestedAt, i18n.language);
  const status = enquiry.status || 'PENDING';

  return (
    <button
      type="button"
      id={`enquiry-${enquiry.enquiryId}`}
      onClick={() => onOpen(enquiry)}
      aria-label={t('enquiries.openEnquiry', { name: enquiry.spaceName })}
      className={`flex w-full gap-4 rounded-2xl border bg-white p-3 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-primary/40 hover:shadow-[0_8px_24px_rgba(15,23,42,0.06)] sm:p-4 ${
        active ? 'border-primary ring-2 ring-primary/20' : 'border-black/5'
      }`}
    >
      <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-xl sm:h-[104px] sm:w-[112px]">
        <ListingImage
          src={discoverDefaultImageUrl(enquiry.spaceType ?? undefined)}
          alt=""
          className="h-full w-full"
        />
        <span className="absolute bottom-2 left-2 rounded-full bg-navy/80 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
          {typeLabel}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h2 className="truncate text-[16px] font-semibold tracking-tight text-navy">{enquiry.spaceName}</h2>
          <StatusBadge status={status} />
        </div>

        {enquiry.locationLabel ? (
          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-text-secondary">
            <MapPin aria-hidden className="h-3.5 w-3.5 shrink-0 text-muted" />
            <span className="truncate">{enquiry.locationLabel}</span>
          </p>
        ) : null}

        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-text-secondary">
          <span className="inline-flex items-center gap-1">
            <Building2 aria-hidden className="h-3.5 w-3.5 text-muted" />
            {typeLabel}
          </span>
          {enquiry.sharingNotes ? (
            <span className="inline-flex items-center gap-1">
              <Users aria-hidden className="h-3.5 w-3.5 text-muted" />
              <span className="truncate">{enquiry.sharingNotes}</span>
            </span>
          ) : null}
          {amenity ? (
            <span className="inline-flex items-center gap-1">
              {enquiry.foodIncludedInRent && amenity === t('enquiries.mealsIncluded') ? (
                <UtensilsCrossed aria-hidden className="h-3.5 w-3.5 text-muted" />
              ) : (
                <Star aria-hidden className="h-3.5 w-3.5 text-muted" />
              )}
              <span className="truncate">{amenity}</span>
            </span>
          ) : null}
        </p>

        {requested ? (
          <p className="mt-3 flex items-center gap-1.5 text-[12px] text-text-secondary">
            <CalendarDays aria-hidden className="h-3.5 w-3.5 text-muted" />
            <span>
              {t('enquiries.requestedOnLabel')}
              <span className="ml-1 font-semibold text-navy">{requested}</span>
            </span>
          </p>
        ) : null}
        {status === 'SHARED' && responded ? (
          <p className="mt-1 flex items-center gap-1.5 text-[12px] text-text-secondary">
            <Mail aria-hidden className="h-3.5 w-3.5 text-primary" />
            <span>
              {t('enquiries.respondedOnLabel')}
              <span className="ml-1 font-semibold text-navy">{responded}</span>
            </span>
          </p>
        ) : null}
      </div>
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useTranslation();
  if (status === 'SHARED') {
    return (
      <span
        title={t('enquiries.sharedHint')}
        className="shrink-0 rounded-full bg-[#E7F6EE] px-2.5 py-1 text-[11px] font-semibold text-primary"
      >
        {t('enquiries.status.SHARED')}
      </span>
    );
  }
  if (status === 'EXPIRED') {
    return (
      <span
        title={t('enquiries.expiredHint')}
        className="inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-coral"
      >
        <Hourglass aria-hidden className="h-3.5 w-3.5" />
        {t('enquiries.status.EXPIRED')}
      </span>
    );
  }
  if (status === 'REJECTED' || status === 'CANCELLED') {
    return (
      <span
        title={t('enquiries.rejectedHint')}
        className="inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-coral"
      >
        {t(`enquiries.status.${status}`)}
      </span>
    );
  }
  return (
    <span
      title={t('enquiries.pendingHint')}
      className="inline-flex shrink-0 items-center gap-1 text-[12px] font-semibold text-amber-600"
    >
      <Clock aria-hidden className="h-3.5 w-3.5" />
      {t('enquiries.status.PENDING')}
    </span>
  );
}
