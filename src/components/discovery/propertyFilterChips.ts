import type { TFunction } from 'i18next';
import {
  PROPERTY_PRICE_PRESETS,
  RATING_PRESETS,
  DEFAULT_PROPERTY_QUERY,
} from '../../data/listings/defaults';
import type { PropertyQuery } from '../../data/listings/types';
import type { ActiveFilter } from './ActiveFilterChips';

export function propertyFilterChips(
  query: PropertyQuery,
  onChange: (next: PropertyQuery) => void,
  t: TFunction,
): ActiveFilter[] {
  const chips: ActiveFilter[] = query.localities.map((locality) => ({
    id: `loc-${locality}`,
    label: locality,
    onRemove: () =>
      onChange({ ...query, localities: query.localities.filter((item) => item !== locality) }),
  }));

  query.types.forEach((type) => {
    const label =
      type === 'MESS'
        ? 'Mess / Tiffin'
        : type === 'SERVICED'
          ? 'Serviced / Corporate Apartment'
          : t(`discovery.propertyTypes.${type}`);
    chips.push({
      id: `type-${type}`,
      label,
      onRemove: () => onChange({ ...query, types: query.types.filter((item) => item !== type) }),
    });
  });

  query.genders.forEach((gender) => {
    const label = gender === 'MALE' ? 'Gents' : gender === 'FEMALE' ? 'Ladies' : 'Gents & Ladies';
    chips.push({
      id: `gender-${gender}`,
      label,
      onRemove: () => onChange({ ...query, genders: query.genders.filter((item) => item !== gender) }),
    });
  });

  query.sharings.forEach((sharing) => {
    const label = {
      SINGLE: 'Single',
      TWO: '2 Sharing',
      THREE: '3 Sharing',
      FOUR: '4 Sharing',
      FIVE: '5 Sharing',
      SIX_PLUS: '6+ Sharing',
    }[sharing];
    chips.push({
      id: `sharing-${sharing}`,
      label,
      onRemove: () => onChange({ ...query, sharings: query.sharings.filter((item) => item !== sharing) }),
    });
  });

  query.foods.forEach((food) => {
    const label = food === 'INCLUDED' ? 'Food Included' : food === 'AVAILABLE' ? 'Food Available' : 'No Food';
    chips.push({
      id: `food-${food}`,
      label,
      onRemove: () => onChange({ ...query, foods: query.foods.filter((item) => item !== food) }),
    });
  });

  query.furnishings.forEach((level) => {
    const label = level === 'FULL' ? 'Fully Furnished' : level === 'SEMI' ? 'Semi Furnished' : 'Unfurnished';
    chips.push({
      id: `furnishing-${level}`,
      label,
      onRemove: () => onChange({ ...query, furnishings: query.furnishings.filter((item) => item !== level) }),
    });
  });

  if (query.contactAvailable) {
    chips.push({
      id: 'contact',
      label: 'Contact Available',
      onRemove: () => onChange({ ...query, contactAvailable: false }),
    });
  }

  const price = PROPERTY_PRICE_PRESETS.find(
    (preset) => preset.min === query.minPrice && preset.max === query.maxPrice && preset.id !== 'any',
  );
  if (price) {
    chips.push({
      id: 'price',
      label: t(`discovery.pricePresets.${({
        any: 'any',
        'under-8': 'under8',
        '8-12': '8to12',
        '12-18': '12to18',
        '18-plus': '18plus',
      } as const)[price.id]}`),
      onRemove: () =>
        onChange({ ...query, minPrice: DEFAULT_PROPERTY_QUERY.minPrice, maxPrice: DEFAULT_PROPERTY_QUERY.maxPrice }),
    });
  }

  const rating = RATING_PRESETS.find((preset) => preset.value === query.minRating && preset.value != null);
  if (rating) {
    chips.push({
      id: 'rating',
      label: t(`discovery.ratingPresets.${rating.id}`),
      onRemove: () => onChange({ ...query, minRating: null }),
    });
  }

  query.amenities.forEach((code) => {
    chips.push({
      id: `amenity-${code}`,
      label: t(`discovery.amenity.${code}`),
      onRemove: () => onChange({ ...query, amenities: query.amenities.filter((item) => item !== code) }),
    });
  });

  return chips;
}
