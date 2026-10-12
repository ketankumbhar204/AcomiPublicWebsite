import {
  BatteryCharging,
  BedDouble,
  BrushCleaning,
  Camera,
  Car,
  Droplets,
  GlassWater,
  Plus,
  Refrigerator,
  Shirt,
  UtensilsCrossed,
  WashingMachine,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import type { TFunction } from 'i18next';
import { getPropertyTypeOption } from '../../constants/propertyRegistration';
import type { PropertyListing } from '../../data/listings/types';

const AMENITY_ICONS: Record<string, LucideIcon> = {
  WIFI: Wifi,
  FOOD_INCLUDED: UtensilsCrossed,
  WASHING_MACHINE: WashingMachine,
  HOT_WATER: Droplets,
  PARKING: Car,
  REFRIGERATOR: Refrigerator,
  HOUSEKEEPING: BrushCleaning,
  CCTV: Camera,
  POWER_BACKUP: BatteryCharging,
  RO_WATER: GlassWater,
  BEDS: BedDouble,
  WARDROBE: Shirt,
  CUSTOM: Plus,
};

export function amenityIcon(code: string): LucideIcon {
  return AMENITY_ICONS[code] ?? Plus;
}

export function amenityDisplayLabel(code: string, label: string | undefined, t: TFunction): string {
  const stored = label?.trim();
  if (stored) return stored;
  return t(`discovery.amenity.${code}`, { defaultValue: code.replaceAll('_', ' ') });
}

export function propertyAvailabilityLabel(listing: PropertyListing, t: TFunction): string | null {
  const available = listing.listingMetadata.availableCount;
  if (available == null) {
    return null;
  }
  if (listing.type === 'RENTAL') {
    return available > 0 ? t('discovery.availableNow') : t('discovery.currentlyOccupied');
  }
  return t(listing.type === 'CO_LIVING' ? 'discovery.roomsAvailable' : 'discovery.bedsAvailable', {
    count: available,
  });
}

export { getPropertyTypeOption };
