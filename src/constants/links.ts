export const APP = {
  register: 'https://app.acomi.in/register',
  login: 'https://app.acomi.in/login',
  web: 'https://app.acomi.in/',
  privacy: 'https://app.acomi.in/privacy',
  deleteAccount: 'https://app.acomi.in/delete-account',
} as const;

export const SITE = 'https://www.acomi.in';

export const NAV_LINKS = [
  { to: '/features', label: 'Features' },
  { to: '/how-it-works', label: 'How it works' },
  { to: '/who-its-for', label: "Who it's for" },
  { to: '/platforms', label: 'Platforms' },
] as const;
