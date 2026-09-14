const APP_ORIGIN = (
  import.meta.env.VITE_APP_ORIGIN?.trim() ||
  (import.meta.env.DEV ? 'http://localhost:5173' : 'https://app.acomi.in')
).replace(/\/+$/, '');

export const APP = {
  register: `${APP_ORIGIN}/register`,
  login: `${APP_ORIGIN}/login`,
  web: `${APP_ORIGIN}/`,
  admin: `${APP_ORIGIN}/admin`,
  profile: `${APP_ORIGIN}/profile`,
  privacy: `${APP_ORIGIN}/privacy`,
  deleteAccount: `${APP_ORIGIN}/delete-account`,
} as const;

export type EnquireListingKind = 'places' | 'mess';

export const SITE = 'https://www.acomi.in';

export const NAV_LINKS = [
  { to: '/features', labelKey: 'nav.features' },
  { to: '/how-it-works', labelKey: 'nav.howItWorks' },
  { to: '/who-its-for', labelKey: 'nav.whoItsFor' },
  { to: '/platforms', labelKey: 'nav.platforms' },
] as const;
