import { useTranslation } from 'react-i18next';
import type {
  FoodFilter,
  FurnishingFilter,
  GenderFilter,
  PlaceFilterType,
  PropertyListing,
  PropertyQuery,
  SharingFilter,
} from '../../data/listings/types';
import { ALL_AMENITIES } from '../../constants/propertyRegistration';
import { FilterCheck } from './FilterCheck';
import { FilterGroup } from './FilterGroup';
import { PriceRangeFilter } from './PriceRangeFilter';

type PropertyFiltersProps = {
  query: PropertyQuery;
  listings: readonly PropertyListing[];
  localities: string[];
  onChange: (next: PropertyQuery) => void;
};

const PROPERTY_TYPES: readonly { id: PlaceFilterType; label: string }[] = [
  { id: 'PG', label: 'PG' },
  { id: 'HOSTEL', label: 'Hostel' },
  { id: 'RENTAL', label: 'Rental' },
  { id: 'CO_LIVING', label: 'Co-living' },
  { id: 'MESS', label: 'Mess / Tiffin' },
  { id: 'SERVICED', label: 'Serviced / Corporate Apartment' },
];

const GENDERS: readonly { id: GenderFilter; label: string }[] = [
  { id: 'MALE', label: 'Gents' },
  { id: 'FEMALE', label: 'Ladies' },
  { id: 'MIXED', label: 'Gents & Ladies' },
];

const SHARINGS: readonly { id: SharingFilter; label: string }[] = [
  { id: 'SINGLE', label: 'Single' },
  { id: 'TWO', label: '2 Sharing' },
  { id: 'THREE', label: '3 Sharing' },
  { id: 'FOUR', label: '4 Sharing' },
  { id: 'FIVE', label: '5 Sharing' },
  { id: 'SIX_PLUS', label: '6+ Sharing' },
];

const FOODS: readonly { id: FoodFilter; label: string }[] = [
  { id: 'INCLUDED', label: 'Food Included' },
  { id: 'AVAILABLE', label: 'Food Available' },
  { id: 'NONE', label: 'No Food' },
];

const FURNISHINGS: readonly { id: FurnishingFilter; label: string }[] = [
  { id: 'FULL', label: 'Fully Furnished' },
  { id: 'SEMI', label: 'Semi Furnished' },
  { id: 'UNFURNISHED', label: 'Unfurnished' },
];

function toggleValue<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function PropertyFilters(props: PropertyFiltersProps) {
  const { query, localities, onChange } = props;
  const { t } = useTranslation();

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
        {PROPERTY_TYPES.map((option) => (
          <FilterCheck
            key={option.id}
            checked={query.types.includes(option.id)}
            onChange={() => onChange({ ...query, types: toggleValue(query.types, option.id) })}
          >
            {option.id === 'MESS' || option.id === 'SERVICED'
              ? option.label
              : t(`discovery.propertyTypes.${option.id}`, { defaultValue: option.label })}
          </FilterCheck>
        ))}
      </FilterGroup>

      <FilterGroup legend={t('discovery.filterGroups.gender', { defaultValue: 'Gender' })} layout="stack">
        {GENDERS.map((option) => (
          <FilterCheck
            key={option.id}
            checked={query.genders.includes(option.id)}
            onChange={() => onChange({ ...query, genders: toggleValue(query.genders, option.id) })}
          >
            {option.label}
          </FilterCheck>
        ))}
      </FilterGroup>

      <FilterGroup legend={t('discovery.filterGroups.sharing', { defaultValue: 'Sharing' })} layout="stack">
        {SHARINGS.map((option) => (
          <FilterCheck
            key={option.id}
            checked={query.sharings.includes(option.id)}
            onChange={() => onChange({ ...query, sharings: toggleValue(query.sharings, option.id) })}
          >
            {option.label}
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

      <FilterGroup legend={t('discovery.filterGroups.food', { defaultValue: 'Food' })} layout="stack">
        {FOODS.map((option) => (
          <FilterCheck
            key={option.id}
            checked={query.foods.includes(option.id)}
            onChange={() => onChange({ ...query, foods: toggleValue(query.foods, option.id) })}
          >
            {option.label}
          </FilterCheck>
        ))}
      </FilterGroup>

      <FilterGroup legend={t('discovery.amenities')} layout="stack">
        {ALL_AMENITIES.map((option) => (
          <FilterCheck
            key={option.code}
            checked={query.amenities.includes(option.code)}
            onChange={() => onChange({ ...query, amenities: toggleValue(query.amenities, option.code) })}
          >
            {t(`discovery.amenity.${option.code}`, { defaultValue: option.label })}
          </FilterCheck>
        ))}
      </FilterGroup>

      <FilterGroup legend={t('discovery.filterGroups.furnishing', { defaultValue: 'Furnishing' })} layout="stack">
        {FURNISHINGS.map((option) => (
          <FilterCheck
            key={option.id}
            checked={query.furnishings.includes(option.id)}
            onChange={() => onChange({ ...query, furnishings: toggleValue(query.furnishings, option.id) })}
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
