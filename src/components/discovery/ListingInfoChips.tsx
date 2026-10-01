import {
  IndianRupee,
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
} from '../../data/listings/listingInfo';

type ListingInfoChipsProps = {
  listing: ListingInfoSource;
  variant: 'card' | 'detail';
  surface?: 'places' | 'meals';
  onEnquire?: () => void;
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
  onEnquire,
  ariaLabel,
}: {
  available: boolean;
  label: string;
  Icon: LucideIcon;
  onEnquire?: () => void;
  ariaLabel: string;
}) {
  const className = `flex h-10 w-full min-w-0 items-center gap-1.5 rounded-xl border px-2 text-left text-[12px] leading-4 font-semibold ${
    available
      ? 'border-[#C6EBD7] bg-[#F3FBF7] text-navy'
      : 'border-[#E6E8EC] bg-[#F4F5F7] text-[#8B95A1]'
  } ${onEnquire ? 'cursor-pointer hover:brightness-[0.98]' : ''}`;
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
  if (onEnquire) {
    return (
      <button type="button" onClick={onEnquire} className={className} aria-label={ariaLabel}>
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

export function ListingInfoChips({ listing, surface = 'places', onEnquire }: ListingInfoChipsProps) {
  const { t } = useTranslation();
  const flags = listingInfoFlags(listing);
  const meals = surface === 'meals';

  return (
    <ul className="grid grid-cols-2 gap-2" aria-label={t('discovery.infoAvailable')}>
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
              onEnquire={onEnquire}
              ariaLabel={state}
            />
          </li>
        );
      })}
    </ul>
  );
}
