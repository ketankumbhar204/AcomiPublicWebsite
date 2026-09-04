import type { TFunction } from 'i18next';
import {
  DEFAULT_MESS_QUERY,
  MESS_MEAL_PRESETS,
  MESS_MONTHLY_PRESETS,
  RATING_PRESETS,
} from '../../data/listings/defaults';
import type { MessQuery } from '../../data/listings/types';
import type { ActiveFilter } from './ActiveFilterChips';

export function messFilterChips(
  query: MessQuery,
  onChange: (next: MessQuery) => void,
  t: TFunction,
): ActiveFilter[] {
  const chips: ActiveFilter[] = query.localities.map((locality) => ({
    id: `loc-${locality}`,
    label: locality,
    onRemove: () =>
      onChange({ ...query, localities: query.localities.filter((item) => item !== locality) }),
  }));

  const monthly = MESS_MONTHLY_PRESETS.find(
    (preset) =>
      preset.min === query.minMonthly && preset.max === query.maxMonthly && preset.id !== 'any',
  );
  if (monthly) {
    chips.push({
      id: 'monthly',
      label: t(`discovery.pricePresets.${({
        any: 'anyMonthly',
        'under-25': 'under25',
        '25-30': '25to30',
        '30-plus': '30plus',
      } as const)[monthly.id]}`),
      onRemove: () =>
        onChange({
          ...query,
          minMonthly: DEFAULT_MESS_QUERY.minMonthly,
          maxMonthly: DEFAULT_MESS_QUERY.maxMonthly,
        }),
    });
  }

  const meal = MESS_MEAL_PRESETS.find(
    (preset) => preset.min === query.minMeal && preset.max === query.maxMeal && preset.id !== 'any',
  );
  if (meal) {
    chips.push({
      id: 'meal',
      label: t(`discovery.pricePresets.${({
        any: 'anyMeal',
        'under-85': 'under85',
        '85-100': '85to100',
        '100-plus': '100plus',
      } as const)[meal.id]}`),
      onRemove: () =>
        onChange({ ...query, minMeal: DEFAULT_MESS_QUERY.minMeal, maxMeal: DEFAULT_MESS_QUERY.maxMeal }),
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

  return chips;
}
