import { useTranslation } from 'react-i18next';
import type { MealFoodTypeFilter, MealSlotFilter, MessQuery } from '../../data/listings/types';
import { FilterCheck } from './FilterCheck';
import { FilterGroup } from './FilterGroup';
import { PriceRangeFilter } from './PriceRangeFilter';

type MessFiltersProps = {
  query: MessQuery;
  onChange: (next: MessQuery) => void;
};

const MEAL_SLOTS: readonly { id: MealSlotFilter; label: string }[] = [
  { id: 'BREAKFAST', label: 'Breakfast' },
  { id: 'LUNCH', label: 'Lunch' },
  { id: 'DINNER', label: 'Dinner' },
];

const FOOD_TYPES: readonly { id: MealFoodTypeFilter; label: string }[] = [
  { id: 'VEG', label: 'Vegetarian' },
  { id: 'NON_VEG', label: 'Non-vegetarian' },
  { id: 'EGG', label: 'Egg' },
];

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function MessFilters({ query, onChange }: MessFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <FilterGroup legend={t('discovery.filterGroups.priceRangeMonth')}>
        <PriceRangeFilter
          id="mess-price"
          minBound={500}
          maxBound={10000}
          minValue={query.minMonthly}
          maxValue={query.maxMonthly}
          step={100}
          format={(value) => `₹${value.toLocaleString('en-IN')}`}
          onChange={(minMonthly, maxMonthly) => onChange({ ...query, minMonthly, maxMonthly })}
        />
      </FilterGroup>

      <FilterGroup legend={t('discovery.filterGroups.mealType', { defaultValue: 'Meal type' })} layout="stack">
        {MEAL_SLOTS.map((option) => (
          <FilterCheck
            key={option.id}
            checked={query.mealTypes.includes(option.id)}
            onChange={() => onChange({ ...query, mealTypes: toggleValue(query.mealTypes, option.id) })}
          >
            {option.label}
          </FilterCheck>
        ))}
      </FilterGroup>

      <FilterGroup legend={t('discovery.filterGroups.foodType', { defaultValue: 'Food type' })} layout="stack">
        {FOOD_TYPES.map((option) => (
          <FilterCheck
            key={option.id}
            checked={query.foodTypes.includes(option.id)}
            onChange={() => onChange({ ...query, foodTypes: toggleValue(query.foodTypes, option.id) })}
          >
            {option.label}
          </FilterCheck>
        ))}
      </FilterGroup>

      <FilterGroup legend={t('discovery.filterGroups.contact', { defaultValue: 'Contact' })} layout="stack">
        <FilterCheck
          checked={query.contactAvailable}
          onChange={() => onChange({ ...query, contactAvailable: !query.contactAvailable })}
        >
          {t('discovery.contactAvailable', { defaultValue: 'Contact Available' })}
        </FilterCheck>
      </FilterGroup>
    </div>
  );
}
