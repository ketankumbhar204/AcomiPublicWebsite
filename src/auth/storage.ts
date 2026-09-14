import type { PublicUser } from './types';

const TOKEN_KEY = 'acomi.auth.token';
const USER_KEY = 'acomi.auth.user';

export function readStoredToken(): string | null {
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function writeStoredToken(token: string | null): void {
  try {
    if (!token) {
      window.localStorage.removeItem(TOKEN_KEY);
      return;
    }
    window.localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // ignore quota / private mode
  }
}

export function readStoredUser(): PublicUser | null {
  try {
    const raw = window.localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PublicUser;
  } catch {
    return null;
  }
}

export function writeStoredUser(user: PublicUser | null): void {
  try {
    if (!user) {
      window.localStorage.removeItem(USER_KEY);
      return;
    }
    window.localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        id: user.id,
        fullName: user.fullName,
        email: user.email ?? null,
        enquiryEmails: user.enquiryEmails ?? [],
      }),
    );
  } catch {
    // ignore
  }
}

export function clearStoredAuth(): void {
  writeStoredToken(null);
  writeStoredUser(null);
}
