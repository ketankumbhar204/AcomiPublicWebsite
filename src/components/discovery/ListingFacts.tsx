import type { ReactNode } from 'react';
import { Users, UtensilsCrossed } from 'lucide-react';
import type { FoodFilter, GenderFilter } from '../../data/listings/types';

type ListingFactsProps = {
  leading?: ReactNode;
  genderPolicy?: GenderFilter | null;
  sharingNotes?: string | null;
  foodAvailability?: FoodFilter | null;
  appearance?: 'default' | 'pills';
};

const GENDER_LABEL: Record<GenderFilter, string> = {
  MALE: 'Gents',
  FEMALE: 'Ladies',
  MIXED: 'Gents & Ladies',
};

const FOOD_LABEL: Record<FoodFilter, string> = {
  INCLUDED: 'Food Included',
  AVAILABLE: 'Food Available',
  NONE: 'No Food',
};

export function sharingChipLabel(notes?: string | null): string | null {
  const raw = notes?.trim();
  if (!raw || raw === '-' || raw === '—' || raw === '–') return null;
  const text = ` ${raw.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `;
  if (text.trim() === '') return null;
  const sharingContext = /shar|occup|bed|person|room/.test(text);
  const numbers = [...text.matchAll(/\b(\d{1,2})\b/g)].map((match) => Number(match[1]));
  const labels: string[] = [];
  if (/\bsingle\b/.test(text) || (sharingContext && numbers.includes(1))) labels.push('Single');
  if (/\bdouble\b|\btwin\b/.test(text) || (sharingContext && numbers.includes(2))) labels.push('2 Sharing');
  if (/\btriple\b/.test(text) || (sharingContext && numbers.includes(3))) labels.push('3 Sharing');
  if (sharingContext && numbers.includes(4)) labels.push('4 Sharing');
  if (sharingContext && numbers.includes(5)) labels.push('5 Sharing');
  const high = numbers.some((value) => value >= 6 && value <= 30);
  if (sharingContext && high && labels.length === 0) labels.push('6+ Sharing');
  if (labels.length === 1) return labels[0] ?? null;
  if (labels.length > 1) {
    const numeric = labels.every((label) => /^\d+ Sharing$/.test(label) || label === '6+ Sharing');
    if (numeric) {
      return `${labels.map((label) => label.replace(' Sharing', '')).join('/')} Sharing`;
    }
    return labels.join(' / ');
  }
  return null;
}

export function ListingFacts({
  leading,
  genderPolicy,
  sharingNotes,
  foodAvailability,
  appearance = 'default',
}: ListingFactsProps) {
  const gender = genderPolicy ? GENDER_LABEL[genderPolicy] : null;
  const sharing = sharingChipLabel(sharingNotes);
  const food = foodAvailability ? FOOD_LABEL[foodAvailability] : null;
  if (!leading && !gender && !sharing && !food) return null;
  const pills = appearance === 'pills';

  return (
    <div className={`flex items-center ${pills ? 'flex-nowrap gap-1' : 'mb-2 flex-wrap gap-1.5'}`}>
      {leading}
      {gender ? <Fact icon="people" label={gender} pills={pills} /> : null}
      {sharing ? <Fact icon="people" label={sharing} pills={pills} /> : null}
      {food ? <Fact icon="food" label={food} pills={pills} /> : null}
    </div>
  );
}

function Fact({ icon, label, pills = false }: { icon: 'people' | 'food'; label: string; pills?: boolean }) {
  const Icon = icon === 'food' ? UtensilsCrossed : Users;
  return (
    <span
      className={`inline-flex max-w-full items-center bg-[#E7F6EE] leading-none font-semibold whitespace-nowrap text-[#0F6B4C] ${
        pills ? 'gap-0.5 rounded-full px-1.5 py-1 text-[10px]' : 'gap-1 rounded-md px-2 py-1 text-[12px]'
      }`}
    >
      <Icon aria-hidden className={pills ? 'h-3 w-3 shrink-0' : 'h-3.5 w-3.5 shrink-0'} />
      <span className="truncate">{label}</span>
    </span>
  );
}
