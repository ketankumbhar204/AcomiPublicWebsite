const hasWindow = typeof window !== 'undefined';

export function readStored(key: string): string | null {
  if (!hasWindow) {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Safari private mode and hardened browser settings throw on access.
    return null;
  }
}

export function writeStored(key: string, value: string): void {
  if (!hasWindow) {
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage being unavailable or full must never break the page.
  }
}

export function removeStored(key: string): void {
  if (!hasWindow) {
    return;
  }
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Same hardened-browser cases as above.
  }
}
