/**
 * Android app open + Play Store fallback for Public Website enquiry CTAs.
 * Same browsing context only — no target=_blank / window.open.
 *
 * Override with VITE_ANDROID_PLAY_STORE_URL when the listing is finalized.
 */

export const ACOMI_ANDROID_PACKAGE = 'com.acomi';
export const ACOMI_ANDROID_APP_SCHEME = 'acomi';

export const ACOMI_PLAY_STORE_URL = (
  import.meta.env.VITE_ANDROID_PLAY_STORE_URL?.trim() ||
  `https://play.google.com/store/apps/details?id=${ACOMI_ANDROID_PACKAGE}`
).replace(/\s+/g, '');

function isAndroidBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent || '');
}

function buildDeepLinkPath(enquiryId?: string | null): string {
  const id = enquiryId?.trim();
  return id ? `enquiries/${encodeURIComponent(id)}` : 'enquiries';
}

export function openAcomiAndroidApp(options?: { enquiryId?: string | null }): void {
  const path = buildDeepLinkPath(options?.enquiryId);
  const playStoreUrl = ACOMI_PLAY_STORE_URL;

  if (isAndroidBrowser()) {
    const intentUrl =
      `intent://${path}` +
      `#Intent;scheme=${ACOMI_ANDROID_APP_SCHEME};package=${ACOMI_ANDROID_PACKAGE};` +
      `S.browser_fallback_url=${encodeURIComponent(playStoreUrl)};end`;
    window.location.assign(intentUrl);
    return;
  }

  window.location.assign(playStoreUrl);
}
