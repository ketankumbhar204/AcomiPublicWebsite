import type { PriceBasis, PropertyType } from '../api/types';

export const PRICE_BASIS_OPTIONS: { id: PriceBasis; label: string }[] = [
  { id: 'PER_BED', label: 'per bed / month' },
  { id: 'PER_ROOM', label: 'per room / month' },
  { id: 'PER_UNIT', label: 'per month' },
];

const LABELS: Record<PriceBasis, string> = {
  PER_BED: 'per bed / month',
  PER_ROOM: 'per room / month',
  PER_UNIT: 'per month',
};

export function defaultPriceBasis(type: PropertyType | null | undefined): PriceBasis | null {
  if (type === 'PG' || type === 'HOSTEL') return 'PER_BED';
  if (type === 'CO_LIVING') return 'PER_ROOM';
  if (type === 'CORPORATE_STAY') return null;
  return 'PER_UNIT';
}

export function isPriceBasis(value: unknown): value is PriceBasis {
  return value === 'PER_BED' || value === 'PER_ROOM' || value === 'PER_UNIT';
}

export function priceBasisLabel(value: string | null | undefined, type?: string | null): string {
  if (isPriceBasis(value)) return LABELS[value];
  if (type === 'PG' || type === 'HOSTEL') return LABELS.PER_BED;
  if (type === 'CO_LIVING') return LABELS.PER_ROOM;
  if (type === 'CORPORATE_STAY') return 'choose per bed, room, or unit';
  return LABELS.PER_UNIT;
}
