import {
  Car,
  Cctv,
  Droplets,
  Refrigerator,
  Shirt,
  Sparkles,
  SquareStack,
  UtensilsCrossed,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { getPropertyTypeOption } from '../../constants/propertyRegistration';
import type { PropertyListing } from '../../data/listings/types';

const AMENITY_ICONS: Record<string, LucideIcon> = {
  WIFI: Wifi,
  FOOD_INCLUDED: UtensilsCrossed,
  WASHING_MACHINE: Shirt,
  PARKING: Car,
  HOUSEKEEPING: Sparkles,
  POWER_BACKUP: Zap,
  RO_WATER: Droplets,
  CCTV: Cctv,
  HOT_WATER: Droplets,
  REFRIGERATOR: Refrigerator,
  WARDROBE: SquareStack,
};

export function amenityIcon(code: string): LucideIcon {
  return AMENITY_ICONS[code] ?? Wifi;
}

export function propertyAvailabilityLabel(listing: PropertyListing): string {
  const available = listing.listingMetadata.availableCount;
  if (listing.type === 'RENTAL') {
    return available > 0 ? 'Available now' : 'Currently occupied';
  }
  const unit = listing.type === 'CO_LIVING' ? 'rooms' : 'beds';
  return `${available} ${unit} available`;
}

export { getPropertyTypeOption };
