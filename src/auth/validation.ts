export const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;

export function normalizeIndianMobileDigits(value: string): string {
  return value.replace(/\D/g, '').slice(0, 10);
}

export function isValidIndianMobile(value: string): boolean {
  return INDIAN_MOBILE_REGEX.test(normalizeIndianMobileDigits(value));
}

export function isValidPassword(value: string): boolean {
  return value.length >= PASSWORD_MIN_LENGTH && value.length <= PASSWORD_MAX_LENGTH;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function assertNoTokenInUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return (
    !lower.includes('access_token=') &&
    !lower.includes('refresh_token=') &&
    !lower.includes('?token=') &&
    !lower.includes('&token=')
  );
}
