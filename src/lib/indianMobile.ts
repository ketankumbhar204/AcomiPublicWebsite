/** Indian mobile numbers are 10 digits starting 6-9. Matches the backend @Pattern. */
const INDIAN_MOBILE = /^[6-9]\d{9}$/;
const INDIAN_PINCODE = /^[1-9]\d{5}$/;

/** Strips spaces, dashes and a pasted +91 / 0 prefix so paste-from-contacts works. */
export function normalizeMobile(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) {
    return digits.slice(-10);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  return digits.slice(0, 10);
}

export function isValidMobile(value: string): boolean {
  return INDIAN_MOBILE.test(value);
}

export function isValidPincode(value: string): boolean {
  return INDIAN_PINCODE.test(value);
}

export function digitsOnly(raw: string, maxLength: number): string {
  return raw.replace(/\D/g, '').slice(0, maxLength);
}

export function formatCountdown(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatRupees(value: number): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);
}
