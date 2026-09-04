import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { readStored, writeStored } from '../lib/storage';
import en from './locales/en.json';
import hi from './locales/hi.json';
import kn from './locales/kn.json';
import mr from './locales/mr.json';
import ta from './locales/ta.json';
import te from './locales/te.json';

/** Shared with AcomiWeb / Mobile so language preference carries across surfaces. */
export const LANGUAGE_STORAGE_KEY = 'acomi.ui.language';

/** Same set as AcomiMobile. */
export const SUPPORTED_LANGUAGES = ['en', 'hi', 'mr', 'kn', 'te', 'ta'] as const;
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
  kn: { translation: kn },
  te: { translation: te },
  ta: { translation: ta },
} as const;

function isSupportedLanguage(code: string): code is AppLanguage {
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(code);
}

function detectLanguage(): AppLanguage {
  const stored = readStored(LANGUAGE_STORAGE_KEY);
  if (stored && isSupportedLanguage(stored)) {
    return stored;
  }
  if (typeof navigator !== 'undefined') {
    for (const candidate of [navigator.language, ...(navigator.languages ?? [])]) {
      const code = candidate?.split('-')[0]?.toLowerCase();
      if (code && isSupportedLanguage(code)) {
        return code;
      }
    }
  }
  return 'en';
}

void i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
  returnNull: false,
  react: { useSuspense: false },
});

export async function changeAppLanguage(language: AppLanguage): Promise<void> {
  await i18n.changeLanguage(language);
  writeStored(LANGUAGE_STORAGE_KEY, language);
  if (typeof document !== 'undefined') {
    document.documentElement.lang = language;
  }
}

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language?.split('-')[0] || 'en';
}

export { i18n };
