import type { EnquireListingKind } from '../constants/links';

const INTENT_KEY = 'acomi.public.enquireIntent';

export type EnquireIntent = {
  listingId: string;
  listingName: string;
  listingKind: EnquireListingKind;
  path: string;
};

export function saveEnquireIntent(intent: EnquireIntent): void {
  try {
    sessionStorage.setItem(INTENT_KEY, JSON.stringify(intent));
  } catch {
    // ignore
  }
}

export function readEnquireIntent(): EnquireIntent | null {
  try {
    const raw = sessionStorage.getItem(INTENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as EnquireIntent;
    if (!parsed.listingId || !parsed.listingName || !parsed.path) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearEnquireIntent(): void {
  try {
    sessionStorage.removeItem(INTENT_KEY);
  } catch {
    // ignore
  }
}

export function intentContainsSecrets(raw: string): boolean {
  const lower = raw.toLowerCase();
  return (
    lower.includes('access_token') ||
    lower.includes('owner') ||
    lower.includes('mobile') ||
    lower.includes('password')
  );
}
