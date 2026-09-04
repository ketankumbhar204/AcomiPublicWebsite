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
    chips.push({
      id: `type-${type}`,
      label: t(`discovery.propertyTypes.${type}`),
      onRemove: () => onChange({ ...query, types: query.types.filter((item) => item !== type) }),
    });
  });

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
