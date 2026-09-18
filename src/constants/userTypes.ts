import { Building2, Home, Soup, UtensilsCrossed } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const USER_TYPES = [
  'ACCOMMODATION_SEEKER',
  'MEAL_SEEKER',
  'PROPERTY_OWNER',
  'MESS_VENDOR',
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
  /** Soft tint behind the square icon well. */
  iconWell: string;
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
    id: 'ACCOMMODATION_SEEKER',
    title: 'Find a rental property',
    description: 'PG • Hostel • Rental • Co-living',
    shortLabel: 'Looking for a place',
    Icon: Home,
    to: '/places',
    iconWell: 'bg-[#E8F1FF]',
    accent: 'text-blue',
    action: 'bg-blue',
    border: 'border-blue',
    ring: '[--focus-ring:var(--color-blue)]',
  },
  {
    id: 'MEAL_SEEKER',
    title: 'Find a meal service',
    description: 'Mess • Tiffin • Meal plans',
    shortLabel: 'Looking for meals',
    Icon: Soup,
    to: '/meals',
    iconWell: 'bg-[#F0EBFF]',
    accent: 'text-purple',
    action: 'bg-purple',
    border: 'border-purple',
    ring: '[--focus-ring:var(--color-purple)]',
  },
  {
    id: 'PROPERTY_OWNER',
    title: 'I own a property',
    description: 'PG • Hostel • Rental • Co-living',
    shortLabel: 'Property owner',
    Icon: Building2,
    to: '/property-owners',
    iconWell: 'bg-[#E7F4EE]',
    accent: 'text-primary',
    action: 'bg-register',
    border: 'border-primary',
    ring: '[--focus-ring:var(--color-primary)]',
  },
  {
    id: 'MESS_VENDOR',
    title: 'I run a food service',
    description: 'Mess • Tiffin • Meal service',
    shortLabel: 'Mess vendor',
    Icon: UtensilsCrossed,
    to: '/mess-vendors',
    iconWell: 'bg-[#FFF0E5]',
    accent: 'text-orange',
    action: 'bg-orange',
    border: 'border-orange',
    ring: '[--focus-ring:var(--color-orange)]',
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
