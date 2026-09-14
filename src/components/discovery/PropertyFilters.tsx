import { useTranslation } from 'react-i18next';
import { PROPERTY_TYPE_OPTIONS } from '../../constants/propertyRegistration';
import { amenitiesInUse } from '../../data/listings/defaults';
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
  const { t } = useTranslation();
  const amenityCodes = amenitiesInUse(listings);

  return (
    <div className="space-y-6">
      {localities.length > 0 ? (
      <FilterGroup legend={t('discovery.location')} layout="stack">
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
      ) : null}

      <FilterGroup legend={t('discovery.filterGroups.propertyType')} layout="stack">
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
            {t(`discovery.propertyTypes.${option.id}`)}
          </FilterCheck>
        ))}
      </FilterGroup>

      <FilterGroup legend={t('discovery.filterGroups.priceRangeMonth')}>
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

      {amenityCodes.length > 0 ? (
        <FilterGroup legend={t('discovery.amenities')} layout="stack">
          {amenityCodes.map((code) => (
            <FilterCheck
              key={code}
              checked={query.amenities.includes(code)}
              onChange={() => onChange({ ...query, amenities: toggleValue(query.amenities, code) })}
            >
              {t(`discovery.amenity.${code}`)}
            </FilterCheck>
          ))}
        </FilterGroup>
      ) : null}
    </div>
  );
}
