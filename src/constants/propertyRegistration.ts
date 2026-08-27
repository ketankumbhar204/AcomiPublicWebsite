import { BedDouble, Building2, Home, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { PropertyType } from '../api/types';

export type PropertyTypeOption = {
  id: PropertyType;
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  /** Shown next to the price field. The backend derives the stored basis independently. */
  priceSuffix: string;
  capacityLabel: string;
  capacityPlaceholder: string;
  /** Mirrors SpaceAmenityService.supportsAmenities on the backend. */
  supportsAmenities: boolean;
};

export const PROPERTY_TYPE_OPTIONS: readonly PropertyTypeOption[] = [
  {
    id: 'PG',
    title: 'PG',
    subtitle: 'Paying guest',
    Icon: Building2,
    priceSuffix: 'per bed / month',
    capacityLabel: 'Approximate beds',
    capacityPlaceholder: 'e.g. 24',
    supportsAmenities: true,
  },
  {
    id: 'HOSTEL',
    title: 'Hostel',
    subtitle: 'Hostel accommodation',
    Icon: BedDouble,
    priceSuffix: 'per bed / month',
    capacityLabel: 'Approximate beds',
    capacityPlaceholder: 'e.g. 60',
    supportsAmenities: true,
  },
  {
    id: 'RENTAL',
    title: 'Rental',
    subtitle: 'Rental property',
    Icon: Home,
    priceSuffix: 'per month',
    capacityLabel: 'Units',
    capacityPlaceholder: 'e.g. 4',
    supportsAmenities: false,
  },
  {
    id: 'CO_LIVING',
    title: 'Co-living',
    subtitle: 'Shared accommodation',
    Icon: Users,
    priceSuffix: 'per room / month',
    capacityLabel: 'Approximate residents',
    capacityPlaceholder: 'e.g. 12',
    supportsAmenities: true,
  },
];

export const MESS_TYPE_OPTION: PropertyTypeOption = {
  id: 'MESS',
  title: 'Mess',
  subtitle: 'Mess / tiffin / meal service',
  Icon: Building2,
  priceSuffix: 'per month',
  capacityLabel: 'Approximate customers',
  capacityPlaceholder: 'e.g. 80',
  supportsAmenities: false,
};

export function getPropertyTypeOption(id: PropertyType): PropertyTypeOption {
  if (id === 'MESS') {
    return MESS_TYPE_OPTION;
  }
  const option = PROPERTY_TYPE_OPTIONS.find((item) => item.id === id);
  if (!option) {
    throw new Error(`Unknown property type: ${id}`);
  }
  return option;
}

/**
 * Codes must exist in the backend AmenityCode enum or the submission is rejected.
 * Labels here are display-only; the backend stores the code.
 */
export type AmenityOption = {
  code: string;
  label: string;
};

export const PRIMARY_AMENITIES: readonly AmenityOption[] = [
  { code: 'WIFI', label: 'Wi-Fi' },
  { code: 'FOOD_INCLUDED', label: 'Meals' },
  { code: 'WASHING_MACHINE', label: 'Laundry' },
  { code: 'PARKING', label: 'Parking' },
];

export const MORE_AMENITIES: readonly AmenityOption[] = [
  { code: 'HOUSEKEEPING', label: 'Housekeeping' },
  { code: 'POWER_BACKUP', label: 'Power backup' },
  { code: 'RO_WATER', label: 'RO water' },
  { code: 'CCTV', label: 'CCTV' },
  { code: 'HOT_WATER', label: 'Hot water' },
  { code: 'REFRIGERATOR', label: 'Refrigerator' },
  { code: 'WARDROBE', label: 'Wardrobe' },
];

export const ALL_AMENITIES: readonly AmenityOption[] = [...PRIMARY_AMENITIES, ...MORE_AMENITIES];

export const REGISTRATION_DRAFT_KEY = 'acomi.propertyRegistrationDraft';
