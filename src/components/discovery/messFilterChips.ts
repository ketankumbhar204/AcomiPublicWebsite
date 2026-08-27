import {
  DEFAULT_MESS_QUERY,
  MESS_MEAL_PRESETS,
  MESS_MONTHLY_PRESETS,
  RATING_PRESETS,
} from '../../data/listings/defaults';
import type { MessQuery } from '../../data/listings/types';
import type { ActiveFilter } from './ActiveFilterChips';

export function messFilterChips(query: MessQuery, onChange: (next: MessQuery) => void): ActiveFilter[] {
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
      label: monthly.label,
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
      label: meal.label,
      onRemove: () =>
        onChange({ ...query, minMeal: DEFAULT_MESS_QUERY.minMeal, maxMeal: DEFAULT_MESS_QUERY.maxMeal }),
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

  return chips;
}
