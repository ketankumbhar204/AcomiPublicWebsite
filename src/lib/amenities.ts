import type { LucideIcon } from 'lucide-react';
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
} from 'lucide-react';

/**
 * Same codes, labels, and limits as the mobile create-space amenity field
 * (`src/utils/amenities.ts`) and the backend `AmenityCode` enum.
 */
export type AmenityCode =
  | 'WIFI'
  | 'FOOD_INCLUDED'
  | 'WASHING_MACHINE'
  | 'HOT_WATER'
  | 'PARKING'
  | 'REFRIGERATOR'
  | 'HOUSEKEEPING'
  | 'CCTV'
  | 'POWER_BACKUP'
  | 'RO_WATER'
  | 'BEDS'
  | 'WARDROBE'
  | 'CUSTOM';

export type AmenityAssignment = {
  code: AmenityCode;
  label: string;
};

export const PRESET_AMENITY_CODES: readonly Exclude<AmenityCode, 'CUSTOM'>[] = [
  'WIFI',
  'FOOD_INCLUDED',
  'WASHING_MACHINE',
  'HOT_WATER',
  'PARKING',
  'REFRIGERATOR',
  'HOUSEKEEPING',
  'CCTV',
  'POWER_BACKUP',
  'RO_WATER',
  'BEDS',
  'WARDROBE',
] as const;

export const MAX_SPACE_AMENITIES = 20;
export const MAX_CUSTOM_AMENITY_LABEL_LENGTH = 120;

export const PRESET_AMENITY_LABELS: Record<Exclude<AmenityCode, 'CUSTOM'>, string> = {
  WIFI: 'WiFi',
  FOOD_INCLUDED: 'Food',
  WASHING_MACHINE: 'Washing Machine',
  HOT_WATER: 'Hot Water',
  PARKING: 'Parking',
  REFRIGERATOR: 'Refrigerator',
  HOUSEKEEPING: 'Housekeeping',
  CCTV: 'CCTV',
  POWER_BACKUP: 'Power Backup',
  RO_WATER: 'RO Water',
  BEDS: 'Beds',
  WARDROBE: 'Wardrobe / Cupboard',
};

/** Lucide icons used by the mobile SpaceAmenitiesField. */
export const AMENITY_ICONS: Record<AmenityCode, LucideIcon> = {
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

const PRESET_LABEL_KEYS = new Map(
  PRESET_AMENITY_CODES.map((code) => [PRESET_AMENITY_LABELS[code].toLowerCase(), code]),
);

export function isAmenityCode(value: string): value is AmenityCode {
  return value === 'CUSTOM' || PRESET_AMENITY_CODES.includes(value as Exclude<AmenityCode, 'CUSTOM'>);
}

export function amenityKey(amenity: Pick<AmenityAssignment, 'code' | 'label'>): string {
  if (amenity.code === 'CUSTOM') {
    return `CUSTOM::${amenity.label.trim().toLowerCase()}`;
  }
  return amenity.code;
}

export function normalizeAmenityAssignments(raw: unknown): AmenityAssignment[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const normalized: AmenityAssignment[] = [];
  for (const entry of raw) {
    const parsed = parseAmenity(entry);
    if (!parsed) continue;
    const key = amenityKey(parsed);
    if (seen.has(key)) continue;
    seen.add(key);
    normalized.push(parsed);
    if (normalized.length >= MAX_SPACE_AMENITIES) break;
  }
  return normalized;
}

function parseAmenity(entry: unknown): AmenityAssignment | null {
  if (typeof entry === 'string') {
    const code = entry.trim().toUpperCase();
    if (!isAmenityCode(code) || code === 'CUSTOM') return null;
    return { code, label: PRESET_AMENITY_LABELS[code] };
  }
  if (!entry || typeof entry !== 'object' || !('code' in entry)) return null;
  const code = String((entry as { code: unknown }).code ?? '').trim().toUpperCase();
  if (!isAmenityCode(code)) return null;
  const provided = 'label' in entry ? String((entry as { label: unknown }).label ?? '').trim() : '';
  if (code === 'CUSTOM') {
    if (!provided || provided.length > MAX_CUSTOM_AMENITY_LABEL_LENGTH) return null;
    return { code, label: provided };
  }
  return { code, label: provided || PRESET_AMENITY_LABELS[code] };
}

export function togglePresetAmenity(
  selected: AmenityAssignment[],
  code: Exclude<AmenityCode, 'CUSTOM'>,
): AmenityAssignment[] {
  if (selected.some((item) => item.code === code)) {
    return selected.filter((item) => item.code !== code);
  }
  if (selected.length >= MAX_SPACE_AMENITIES) return selected;
  return normalizeAmenityAssignments([...selected, { code, label: PRESET_AMENITY_LABELS[code] }]);
}

export function removeCustomAmenity(selected: AmenityAssignment[], label: string): AmenityAssignment[] {
  const key = `CUSTOM::${label.trim().toLowerCase()}`;
  return selected.filter((item) => amenityKey(item) !== key);
}

export type CustomAmenityError = 'required' | 'tooLong' | 'duplicate' | 'maxReached';

export function customAmenityError(label: string, selected: AmenityAssignment[]): CustomAmenityError | null {
  const trimmed = label.trim();
  if (!trimmed) return 'required';
  if (trimmed.length > MAX_CUSTOM_AMENITY_LABEL_LENGTH) return 'tooLong';
  if (selected.length >= MAX_SPACE_AMENITIES) return 'maxReached';
  const key = trimmed.toLowerCase();
  if (selected.some((item) => item.code === 'CUSTOM' && item.label.trim().toLowerCase() === key)) {
    return 'duplicate';
  }
  if (PRESET_LABEL_KEYS.has(key)) return 'duplicate';
  return null;
}

export function addCustomAmenity(
  selected: AmenityAssignment[],
  label: string,
): { amenities: AmenityAssignment[]; error: CustomAmenityError | null } {
  const error = customAmenityError(label, selected);
  if (error) return { amenities: selected, error };
  return {
    amenities: normalizeAmenityAssignments([...selected, { code: 'CUSTOM', label: label.trim() }]),
    error: null,
  };
}
