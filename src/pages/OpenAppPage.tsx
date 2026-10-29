import { useEffect } from 'react';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.acomi&hl=en_IN';

/**
 * Same behavior as public/open.html, for hosts that send every path to the app shell.
 * Android: open the installed ACOMI app. Otherwise: Play Store.
 */
export function OpenAppPage() {
  useEffect(() => {
    const android = /Android/i.test(navigator.userAgent || '');
    if (!android) {
      window.location.replace(PLAY_STORE_URL);
      return;
    }
    const intent =
      'intent:#Intent;action=android.intent.action.MAIN;category=android.intent.category.LAUNCHER;package=com.acomi;S.browser_fallback_url=' +
      `${encodeURIComponent(PLAY_STORE_URL)};end`;
    window.location.href = intent;
    const timer = window.setTimeout(() => {
      if (!document.hidden) {
        window.location.replace(PLAY_STORE_URL);
      }
    }, 1500);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', padding: 24 }}>
        <p>Opening ACOMI…</p>
        <p>
          <a href={PLAY_STORE_URL}>Get ACOMI on Google Play</a>
        </p>
      </div>
    </main>
  );
}
