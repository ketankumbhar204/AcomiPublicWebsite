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

function Chip({
  available,
  label,
  compact,
}: {
  available: boolean;
  label: string;
  compact: boolean;
}) {
  const mark = available ? '✓' : '—';
  const state = available ? 'available' : 'unavailable';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 ${
        compact ? 'text-[10px] leading-4' : 'text-[12px] leading-5'
      } ${available ? 'bg-mint/70 text-navy' : 'bg-black/[0.04] text-muted'}`}
      title={`${label}: ${state}`}
    >
      <span aria-hidden>{mark}</span>
      <span>{label}</span>
    </span>
  );
}

export function ListingInfoChips({ listing, variant, surface = 'places' }: ListingInfoChipsProps) {
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
      className={`flex flex-wrap ${compact ? 'gap-1' : 'gap-1.5'}`}
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
        return (
          <li key={chip.key}>
            <Chip available={chip.available} label={label} compact={compact} />
            <span className="sr-only">{state}</span>
          </li>
        );
      })}
    </ul>
  );
}
