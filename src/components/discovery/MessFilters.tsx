import { RATING_PRESETS } from '../../data/listings/defaults';
import type { MessQuery } from '../../data/listings/types';
import { FilterCheck } from './FilterCheck';
import { FilterGroup } from './FilterGroup';
import { PriceRangeFilter } from './PriceRangeFilter';

type MessFiltersProps = {
  query: MessQuery;
  localities: string[];
  onChange: (next: MessQuery) => void;
};

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function MessFilters({ query, localities, onChange }: MessFiltersProps) {
  return (
    <div className="space-y-6">
      <FilterGroup legend="Location" layout="stack">
        {localities.map((locality) => (
          <FilterCheck
            key={locality}
            checked={query.localities.includes(locality)}
            onChange={() => onChange({ ...query, localities: toggleValue(query.localities, locality) })}
          >
            {locality}
          </FilterCheck>
        ))}
      </FilterGroup>

      <FilterGroup legend="Monthly price range">
        <PriceRangeFilter
          id="mess-monthly"
          minBound={1000}
          maxBound={6000}
          minValue={query.minMonthly}
          maxValue={query.maxMonthly}
          step={100}
          format={(value) => `₹${value.toLocaleString('en-IN')}`}
          onChange={(minMonthly, maxMonthly) => onChange({ ...query, minMonthly, maxMonthly })}
        />
      </FilterGroup>

      <FilterGroup legend="Per meal price range">
        <PriceRangeFilter
          id="mess-meal"
          minBound={40}
          maxBound={200}
          minValue={query.minMeal}
          maxValue={query.maxMeal}
          step={5}
          format={(value) => `₹${value}`}
          onChange={(minMeal, maxMeal) => onChange({ ...query, minMeal, maxMeal })}
        />
      </FilterGroup>

      <FilterGroup legend="Rating" layout="stack">
        {RATING_PRESETS.filter((preset) => preset.value != null).map((preset) => (
          <FilterCheck
            key={preset.id}
            checked={query.minRating === preset.value}
            onChange={() =>
              onChange({ ...query, minRating: query.minRating === preset.value ? null : preset.value })
            }
          >
            {preset.label}
          </FilterCheck>
        ))}
      </FilterGroup>
    </div>
  );
}
