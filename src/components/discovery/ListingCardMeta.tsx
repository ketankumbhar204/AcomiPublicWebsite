import type { ReactNode } from 'react';
import { BadgeCheck, Map } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type ListingCardMetaProps = {
  listing: {
    mapUrl?: string;
    latitude?: number | string | null;
    longitude?: number | string | null;
    addressLine: string;
    locality: string;
    city: string;
    state: string;
    pincode: string;
  };
  chips: ReactNode;
  showMaps?: boolean;
  /** Real map URL. When set, the location row opens this link instead of starting an enquiry. */
  mapHref?: string | null;
  compact?: boolean;
  onEnquire?: () => void;
};

export function ListingCardMeta({ chips, showMaps = true, mapHref, compact = false, onEnquire }: ListingCardMetaProps) {
  const { t } = useTranslation();
  const locationLabel = t('discovery.location');
  const mapsLabel = t('discovery.openMaps');

  return (
    <div className={`rounded-2xl bg-[#EAF8F2] ${compact ? 'mt-1.5 p-2' : 'mt-2 p-2.5'}`}>
      {showMaps ? (
        mapHref?.trim() ? (
          <a
            href={mapHref.trim()}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center gap-2 rounded-xl bg-white px-2 py-1.5 text-left shadow-[0_1px_2px_rgba(11,28,22,0.04)] hover:bg-[#F3FBF7]"
          >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8F8EF] text-[#0F6B4C]">
              <Map aria-hidden className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold tracking-[0.12em] text-muted uppercase">
                {locationLabel}
              </span>
              <span className="block text-[12px] font-semibold text-[#0F6B4C] underline underline-offset-2">
                {mapsLabel}
              </span>
            </span>
          </a>
        ) : onEnquire ? (
          <button
            type="button"
            onClick={onEnquire}
            className="flex w-full items-center gap-2 rounded-xl bg-white px-2 py-1.5 text-left shadow-[0_1px_2px_rgba(11,28,22,0.04)] hover:bg-[#F3FBF7]"
            aria-label={`${mapsLabel}. ${t('discovery.getContactDetails')}`}
          >
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8F8EF] text-[#0F6B4C]">
              <Map aria-hidden className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-semibold tracking-[0.12em] text-muted uppercase">
                {locationLabel}
              </span>
              <span className="block text-[12px] font-semibold text-[#0F6B4C]">{mapsLabel}</span>
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-2 rounded-xl bg-white px-2 py-1.5">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#E8F8EF] text-[#0F6B4C]">
              <Map aria-hidden className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold tracking-[0.12em] text-muted uppercase">
                {locationLabel}
              </span>
              <span className="block text-[12px] font-semibold text-[#0F6B4C]">{mapsLabel}</span>
            </span>
          </div>
        )
      ) : null}
      <div className={showMaps ? 'mt-2' : undefined}>
        <p className={`inline-flex items-center gap-1 text-[10px] font-semibold tracking-[0.12em] text-[#0F6B4C] uppercase ${compact ? 'mb-1' : 'mb-1.5'}`}>
          <BadgeCheck aria-hidden className="h-3.5 w-3.5" />
          {t('discovery.infoAvailable')}
        </p>
        {chips}
      </div>
    </div>
  );
}
