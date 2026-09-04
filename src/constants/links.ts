export const APP = {
  register: 'https://app.acomi.in/register',
  login: 'https://app.acomi.in/login',
  web: 'https://app.acomi.in/',
  privacy: 'https://app.acomi.in/privacy',
  deleteAccount: 'https://app.acomi.in/delete-account',
} as const;

export const SITE = 'https://www.acomi.in';

export const NAV_LINKS = [
  { to: '/features', labelKey: 'nav.features' },
  { to: '/how-it-works', labelKey: 'nav.howItWorks' },
  { to: '/who-its-for', labelKey: 'nav.whoItsFor' },
  { to: '/platforms', labelKey: 'nav.platforms' },
] as const;
