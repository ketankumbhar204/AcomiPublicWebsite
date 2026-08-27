import { getPropertyTypeOption } from '../../constants/propertyRegistration';
import {
  PROPERTY_PRICE_PRESETS,
  RATING_PRESETS,
  DEFAULT_PROPERTY_QUERY,
} from '../../data/listings/defaults';
import { amenityLabel } from '../../data/listings/query';
import type { PropertyQuery } from '../../data/listings/types';
import type { ActiveFilter } from './ActiveFilterChips';

export function propertyFilterChips(
  query: PropertyQuery,
  onChange: (next: PropertyQuery) => void,
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
      label: getPropertyTypeOption(type).title,
      onRemove: () => onChange({ ...query, types: query.types.filter((item) => item !== type) }),
    });
  });

  const price = PROPERTY_PRICE_PRESETS.find(
    (preset) => preset.min === query.minPrice && preset.max === query.maxPrice && preset.id !== 'any',
  );
  if (price) {
    chips.push({
      id: 'price',
      label: price.label,
      onRemove: () =>
        onChange({ ...query, minPrice: DEFAULT_PROPERTY_QUERY.minPrice, maxPrice: DEFAULT_PROPERTY_QUERY.maxPrice }),
    });
  }

  const rating = RATING_PRESETS.find((preset) => preset.value === query.minRating && preset.value != null);
  if (rating) {
    chips.push({
      id: 'rating',
      label: rating.label,
      onRemove: () => onChange({ ...query, minRating: null }),
    });
  }

  query.amenities.forEach((code) => {
    chips.push({
      id: `amenity-${code}`,
      label: amenityLabel(code),
      onRemove: () => onChange({ ...query, amenities: query.amenities.filter((item) => item !== code) }),
    });
  });

  return chips;
}
