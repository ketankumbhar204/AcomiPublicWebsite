import { PROPERTY_TYPE_OPTIONS } from '../../constants/propertyRegistration';
import { amenitiesInUse, RATING_PRESETS } from '../../data/listings/defaults';
import { amenityLabel } from '../../data/listings/query';
import type { PropertyListing, PropertyListingType, PropertyQuery } from '../../data/listings/types';
import { FilterCheck } from './FilterCheck';
import { FilterGroup } from './FilterGroup';
import { PriceRangeFilter } from './PriceRangeFilter';

type PropertyFiltersProps = {
  query: PropertyQuery;
  listings: readonly PropertyListing[];
  localities: string[];
  onChange: (next: PropertyQuery) => void;
};

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function PropertyFilters({ query, listings, localities, onChange }: PropertyFiltersProps) {
  const amenityCodes = amenitiesInUse(listings);

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

      <FilterGroup legend="Property type" layout="stack">
        {PROPERTY_TYPE_OPTIONS.map((option) => (
          <FilterCheck
            key={option.id}
            checked={query.types.includes(option.id as PropertyListingType)}
            onChange={() =>
              onChange({
                ...query,
                types: toggleValue(query.types, option.id as PropertyListingType),
              })
            }
          >
            {option.title}
          </FilterCheck>
        ))}
      </FilterGroup>

      <FilterGroup legend="Price range (per month)">
        <PriceRangeFilter
          id="property-price"
          minBound={2000}
          maxBound={25000}
          minValue={query.minPrice}
          maxValue={query.maxPrice}
          step={500}
          format={(value) => `₹${value.toLocaleString('en-IN')}`}
          onChange={(minPrice, maxPrice) => onChange({ ...query, minPrice, maxPrice })}
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

      {amenityCodes.length > 0 ? (
        <FilterGroup legend="Amenities" layout="stack">
          {amenityCodes.map((code) => (
            <FilterCheck
              key={code}
              checked={query.amenities.includes(code)}
              onChange={() => onChange({ ...query, amenities: toggleValue(query.amenities, code) })}
            >
              {amenityLabel(code)}
            </FilterCheck>
          ))}
        </FilterGroup>
      ) : null}
    </div>
  );
}
