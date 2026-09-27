import {
  CalendarDays,
  ClipboardList,
  Clock3,
  IndianRupee,
  Leaf,
  Map,
  MapPin,
  Phone,
  Sparkles,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  CARD_INFO_KEYS,
  EXTRA_INFO_KEYS,
  MEAL_EXTRA_INFO_KEYS,
  listingInfoFlags,
  listingMealInfoFlags,
  type ListingInfoFlags,
  type ListingInfoSource,
  type MealInfoFlags,
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

const MEAL_LABELS: Record<keyof MealInfoFlags, string> = {
  contact: 'infoContact',
  address: 'infoAddress',
  map: 'infoMap',
  rent: 'infoPrice',
  amenities: 'infoAmenities',
  food: 'infoFood',
  menu: 'infoMenu',
  mealTiming: 'infoMealTiming',
  foodType: 'infoFoodType',
  subscription: 'infoSubscription',
};

const CHIP_ICONS: Record<string, LucideIcon> = {
  contact: Phone,
  address: MapPin,
  map: Map,
  rent: IndianRupee,
  amenities: Sparkles,
  food: UtensilsCrossed,
  menu: ClipboardList,
  mealTiming: Clock3,
  foodType: Leaf,
  subscription: CalendarDays,
};

function Chip({
  available,
  label,
  compact,
  Icon,
  onEnquire,
}: {
  available: boolean;
  label: string;
  compact: boolean;
  Icon: LucideIcon;
  onEnquire?: () => void;
}) {
  const className = `inline-flex items-center gap-1.5 rounded-xl border ${
    compact ? 'px-2 py-1 text-[11px] leading-4' : 'px-2.5 py-1.5 text-[12px] leading-5'
  } ${
    available
      ? 'border-[#C6EBD7] bg-white text-navy shadow-[0_1px_2px_rgba(11,28,22,0.04)]'
      : 'border-transparent bg-white/50 text-muted'
  } ${onEnquire ? 'cursor-pointer hover:bg-[#F3FBF7]' : ''}`;

  const inner = (
    <>
      <span
        aria-hidden
        className={`inline-flex shrink-0 items-center justify-center rounded-lg ${
          compact ? 'h-5 w-5' : 'h-6 w-6'
        } ${available ? 'bg-[#E8F8EF] text-[#059669]' : 'bg-black/[0.04] text-muted'}`}
      >
        <Icon className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      </span>
      <span className="font-medium">{label}</span>
    </>
  );

  if (onEnquire) {
    return (
      <button
        type="button"
        onClick={onEnquire}
        className={className}
        title={`${label}: ${available ? 'available' : 'unavailable'}`}
      >
        {inner}
      </button>
    );
  }

  return (
    <span className={className} title={`${label}: ${available ? 'available' : 'unavailable'}`}>
      <span
        aria-hidden
        className={`inline-flex shrink-0 items-center justify-center rounded-lg ${
          compact ? 'h-5 w-5' : 'h-6 w-6'
        } ${available ? 'bg-[#E8F8EF] text-[#059669]' : 'bg-black/[0.04] text-muted'}`}
      >
        <Icon className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      </span>
      <span className="font-medium">{label}</span>
    </span>
  );
}

export function ListingInfoChips({ listing, variant, surface = 'places', onEnquire }: ListingInfoChipsProps) {
  const { t } = useTranslation();
  const compact = variant === 'card';
  const meals = surface === 'meals';
  const mealFlags = meals ? listingMealInfoFlags(listing) : null;
  const placeFlags = meals ? null : listingInfoFlags(listing);
  const flags = mealFlags ?? placeFlags;
  if (!flags) {
    return null;
  }
  const required = CARD_INFO_KEYS.map((key) => ({
    key,
    available: flags[key],
    show: variant === 'card' || flags[key],
  }));
  const extras = mealFlags
    ? MEAL_EXTRA_INFO_KEYS.filter((key) => mealFlags[key]).map((key) => ({
        key,
        available: true,
        show: true,
      }))
    : EXTRA_INFO_KEYS.filter((key) => placeFlags?.[key]).map((key) => ({
        key,
        available: true,
        show: true,
      }));
  const chips = [...required, ...extras].filter((item) => item.show);
  if (chips.length === 0) {
    return null;
  }

  return (
    <ul
      className={`flex flex-wrap ${compact ? 'gap-1.5' : 'gap-2'}`}
      aria-label={t('discovery.infoAvailable')}
    >
      {chips.map((chip) => {
        const labelKey = meals
          ? MEAL_LABELS[chip.key as keyof MealInfoFlags]
          : PLACE_LABELS[chip.key as keyof ListingInfoFlags];
        const label = t(`discovery.${labelKey}`);
        const state = t(chip.available ? 'discovery.infoAvailableState' : 'discovery.infoUnavailableState', {
          field: label,
        });
        const Icon = CHIP_ICONS[chip.key] ?? Sparkles;
        return (
          <li key={chip.key}>
            <Chip available={chip.available} label={label} compact={compact} Icon={Icon} onEnquire={onEnquire} />
            <span className="sr-only">{state}</span>
          </li>
        );
      })}
    </ul>
  );
}
