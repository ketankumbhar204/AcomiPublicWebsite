import type { EnquireListingKind } from '../constants/links';

const INTENT_KEY = 'acomi.public.enquireIntent';

export type EnquireIntent = {
  listingId: string;
  listingName: string;
  listingKind: EnquireListingKind;
  path: string;
  /** Only intents saved for post-login resume may reopen the enquire dialog. */
  resumeAfterAuth?: boolean;
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

/**
 * Accept a post-login enquire resume for this listing kind, then clear storage.
 * Stale intents (no resumeAfterAuth) are cleared so a plain refresh never reopens the dialog.
 */
export function takeEnquireResumeIntent(
  listingKind: EnquireListingKind,
): EnquireIntent | null {
  const intent = readEnquireIntent();
  if (!intent) return null;
  if (!intent.resumeAfterAuth) {
    clearEnquireIntent();
    return null;
  }
  if (intent.listingKind !== listingKind) {
    return null;
  }
  clearEnquireIntent();
  return intent;
}

/** Same as takeEnquireResumeIntent, but matched to a specific listing id (detail pages). */
export function takeEnquireResumeIntentForListing(listingId: string): EnquireIntent | null {
  const intent = readEnquireIntent();
  if (!intent) return null;
  if (!intent.resumeAfterAuth) {
    clearEnquireIntent();
    return null;
  }
  if (intent.listingId !== listingId) {
    return null;
  }
  clearEnquireIntent();
  return intent;
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
