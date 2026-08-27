import { Building2, Home, Soup, UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const USER_TYPES = [
  'PROPERTY_OWNER',
  'MESS_VENDOR',
  'ACCOMMODATION_SEEKER',
  'MEAL_SEEKER',
] as const;

export type UserType = (typeof USER_TYPES)[number];

export type UserTypeOption = {
  id: UserType;
  title: string;
  description: string;
  /** Compact form used by the navbar switcher. */
  shortLabel: string;
  Icon: LucideIcon;
  /** Destination for this user type. Each type stays on its own route. */
  to: string;
  /** Pastel panel tint, matching the existing site card tints. */
  surface: string;
  /** Domain accent used for the icon glyph and the title. */
  accent: string;
  /** Solid domain colour for the circular action indicator. */
  action: string;
  /** Border colour for the currently selected card. */
  border: string;
  /** Recolours the shared :focus-visible outline for this card. */
  ring: string;
};

export const USER_TYPE_OPTIONS: readonly UserTypeOption[] = [
  {
    id: 'PROPERTY_OWNER',
    title: 'I manage a property',
    description: 'PG • Hostel • Rental • Co-living',
    shortLabel: 'Property owner',
    Icon: Building2,
    to: '/property-owners',
    surface: 'bg-mint',
    accent: 'text-primary',
    action: 'bg-register',
    border: 'border-primary',
    ring: '[--focus-ring:var(--color-primary)]',
  },
  {
    id: 'MESS_VENDOR',
    title: 'I run a mess / food service',
    description: 'Mess • Tiffin • Meal service',
    shortLabel: 'Mess vendor',
    Icon: UtensilsCrossed,
    to: '/mess-vendors',
    surface: 'bg-[#FFF8F1]',
    accent: 'text-orange',
    action: 'bg-orange',
    border: 'border-orange',
    ring: '[--focus-ring:var(--color-orange)]',
  },
  {
    id: 'ACCOMMODATION_SEEKER',
    title: "I'm looking for a place",
    description: 'Find PGs • Hostels • Rentals • Co-living',
    shortLabel: 'Looking for a place',
    Icon: Home,
    to: '/places',
    surface: 'bg-[#F4F8FF]',
    accent: 'text-blue',
    action: 'bg-blue',
    border: 'border-blue',
    ring: '[--focus-ring:var(--color-blue)]',
  },
  {
    id: 'MEAL_SEEKER',
    title: "I'm looking for meals",
    description: 'Find messes • Tiffin • Meal plans',
    shortLabel: 'Looking for meals',
    Icon: Soup,
    to: '/meals',
    surface: 'bg-[#F7F4FF]',
    accent: 'text-purple',
    action: 'bg-purple',
    border: 'border-purple',
    ring: '[--focus-ring:var(--color-purple)]',
  },
];

export const USER_TYPE_STORAGE_KEY = 'acomi.userType';
export const USER_TYPE_PROMPT_KEY = 'acomi.userTypePromptSeen';

export function isUserType(value: unknown): value is UserType {
  return typeof value === 'string' && (USER_TYPES as readonly string[]).includes(value);
}

export function getUserTypeOption(id: UserType): UserTypeOption {
  const option = USER_TYPE_OPTIONS.find((item) => item.id === id);
  if (!option) {
    throw new Error(`Unknown user type: ${id}`);
  }
  return option;
}
