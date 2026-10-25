import {
  IndianRupee,
  Info,
  Map,
  MapPin,
  Phone,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  INFO_GRID_KEYS,
  listingInfoFlags,
  type ListingInfoFlags,
  type ListingInfoSource,
  type ListingSection,
} from '../../data/listings/listingInfo';

type ListingInfoChipsProps = {
  listing: ListingInfoSource;
  variant: 'card' | 'detail';
  surface?: 'places' | 'meals';
  compact?: boolean;
  onEnquire?: () => void;
  /** Opens the matching section on the listing detail. */
  onSelect?: (section: ListingSection) => void;
  /** Opens the existing listing detail. Card layout only. */
  onViewAll?: () => void;
};

const PLACE_LABELS: Record<keyof ListingInfoFlags, string> = {
  contact: 'infoContact',
  address: 'infoAddress',
  map: 'infoMap',
  rent: 'infoRent',
  amenities: 'infoAmenities',
  food: 'infoFood',
};

const MEAL_RENT_LABEL = 'infoPrice';

const CHIP_ICONS: Record<keyof ListingInfoFlags, LucideIcon> = {
  contact: Phone,
  address: MapPin,
  map: Map,
  rent: IndianRupee,
  amenities: Sparkles,
  food: UtensilsCrossed,
};

function Chip({
  available,
  label,
  Icon,
  ariaLabel,
  compact = false,
  onSelect,
}: {
  available: boolean;
  label: string;
  Icon: LucideIcon;
  ariaLabel: string;
  compact?: boolean;
  onSelect?: () => void;
}) {
  const className = `flex w-full min-w-0 items-center gap-1.5 rounded-xl border px-2 text-left text-[12px] leading-4 font-semibold ${
    compact ? 'h-9' : 'h-10'
  } ${
    available
      ? 'border-[#C6EBD7] bg-[#F3FBF7] text-navy'
      : 'border-[#E6E8EC] bg-[#F4F5F7] text-[#8B95A1]'
  }`;
  const iconClass = `inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${
    available ? 'bg-white text-[#059669]' : 'bg-white text-[#A3ABB6]'
  }`;
  const inner = (
    <>
      <span aria-hidden className={iconClass}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0">{label}</span>
    </>
  );
  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className={`${className} cursor-pointer`} aria-label={ariaLabel}>
        {inner}
      </button>
    );
  }
  return (
    <span className={className} aria-label={ariaLabel}>
      {inner}
    </span>
  );
}

export function ListingInfoChips({
  listing,
  variant,
  surface = 'places',
  compact = false,
  onSelect,
  onViewAll,
}: ListingInfoChipsProps) {
  const { t } = useTranslation();
  const flags = listingInfoFlags(listing);
  const meals = surface === 'meals';

  if (variant === 'card') {
    return (
      <section aria-label={t('discovery.availableInformation', { defaultValue: 'Available Information' })}>
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="inline-flex min-w-0 items-center gap-1.5 text-[14px] font-bold text-[#0F6B4C]">
            <Info aria-hidden className="h-4 w-4 shrink-0" />
            <span className="truncate">{t('discovery.availableInformation', { defaultValue: 'Available Information' })}</span>
          </p>
          {onViewAll ? (
            <button
              type="button"
              onClick={onViewAll}
              className="shrink-0 text-[13px] font-semibold text-[#0F6B4C] hover:underline"
            >
              {`${t('discovery.viewAllInfo', { defaultValue: 'View all' })} →`}
            </button>
          ) : null}
        </div>
        <ul className="flex items-start justify-between gap-0.5">
          {INFO_GRID_KEYS.map((key) => {
            const labelKey = meals && key === 'rent' ? MEAL_RENT_LABEL : PLACE_LABELS[key];
            const label = t(`discovery.${labelKey}`);
            const available = flags[key];
            const state = t(available ? 'discovery.infoAvailableState' : 'discovery.infoUnavailableState', {
              field: label,
            });
            const Icon = CHIP_ICONS[key];
            const itemClass = `flex w-full flex-col items-center gap-1.5 text-center ${available ? 'text-[#0F6B4C]' : 'text-[#94A3B8]'}`;
            const itemInner = (
              <>
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    available ? 'bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)]' : 'bg-[#EEF1F4]'
                  }`}
                >
                  <Icon aria-hidden className="h-4 w-4" strokeWidth={2.1} />
                </span>
                <span className="w-full text-[9px] leading-tight font-semibold">{label}</span>
              </>
            );
            return (
              <li key={key} className="min-w-0 flex-1">
                {onSelect ? (
                  <button
                    type="button"
                    onClick={() => onSelect(key)}
                    className={`${itemClass} cursor-pointer border-0 bg-transparent p-0`}
                    aria-label={state}
                  >
                    {itemInner}
                  </button>
                ) : (
                  <span className={itemClass} aria-label={state}>
                    {itemInner}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  return (
    <ul className={`grid grid-cols-2 ${compact ? 'gap-1.5' : 'gap-2'}`} aria-label={t('discovery.infoAvailable')}>
      {INFO_GRID_KEYS.map((key) => {
        const labelKey = meals && key === 'rent' ? MEAL_RENT_LABEL : PLACE_LABELS[key];
        const label = t(`discovery.${labelKey}`);
        const available = flags[key];
        const state = t(available ? 'discovery.infoAvailableState' : 'discovery.infoUnavailableState', {
          field: label,
        });
        return (
          <li key={key} className="min-w-0">
            <Chip
              available={available}
              label={`${available ? '✓' : '—'} ${label}`}
              Icon={CHIP_ICONS[key]}
              ariaLabel={state}
              compact={compact}
              onSelect={onSelect ? () => onSelect(key) : undefined}
            />
          </li>
        );
      })}
    </ul>
  );
}
