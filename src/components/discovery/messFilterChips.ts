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

  const mealLabel: Record<string, string> = { BREAKFAST: 'Breakfast', LUNCH: 'Lunch', DINNER: 'Dinner' };
  const foodLabel: Record<string, string> = {
    VEG: 'Vegetarian',
    NON_VEG: 'Non-vegetarian',
    EGG: 'Egg',
  };
  query.mealTypes.forEach((slot) => {
    chips.push({
      id: `meal-${slot}`,
      label: mealLabel[slot] ?? slot,
      onRemove: () => onChange({ ...query, mealTypes: query.mealTypes.filter((item) => item !== slot) }),
    });
  });
  query.foodTypes.forEach((food) => {
    chips.push({
      id: `food-type-${food}`,
      label: foodLabel[food] ?? food,
      onRemove: () => onChange({ ...query, foodTypes: query.foodTypes.filter((item) => item !== food) }),
    });
  });

  if (query.contactAvailable) {
    chips.push({
      id: 'contact',
      label: 'Contact Available',
      onRemove: () => onChange({ ...query, contactAvailable: false }),
    });
  }

  const monthly = MESS_MONTHLY_PRESETS.find(
    (preset) =>
      preset.min === query.minMonthly && preset.max === query.maxMonthly && preset.id !== 'any',
  );
  if (query.minMonthly != null || query.maxMonthly != null) {
    const format = (value: number) => `₹${value.toLocaleString('en-IN')}`;
    const label = monthly
      ? t(`discovery.pricePresets.${({
          any: 'anyMonthly',
          'under-25': 'under25',
          '25-30': '25to30',
          '30-plus': '30plus',
        } as const)[monthly.id]}`)
      : query.minMonthly != null && query.maxMonthly != null
        ? `${format(query.minMonthly)} – ${format(query.maxMonthly)}`
        : query.minMonthly != null
          ? `${format(query.minMonthly)}+`
          : query.maxMonthly != null
            ? `Under ${format(query.maxMonthly)}`
            : '';
    chips.push({
      id: 'monthly',
      label,
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
