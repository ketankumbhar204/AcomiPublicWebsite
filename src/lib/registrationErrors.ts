import type { TFunction } from 'i18next';
import { ApiError } from '../api/client';

/*
 * Every branch returns copy authored here. Backend text is only ever matched against,
 * never rendered, so provider errors and exception messages cannot reach the page.
 */

function backendText(error: unknown): string {
  return error instanceof ApiError ? error.message.toLowerCase() : '';
}

function isNetwork(error: unknown): boolean {
  return error instanceof ApiError && error.isNetworkError;
}

function status(error: unknown): number {
  return error instanceof ApiError ? error.status : -1;
}

export function sendOtpErrorMessage(error: unknown, t: TFunction): string {
  if (isNetwork(error)) {
    return t('registration.errors.network');
  }
  const text = backendText(error);
  if (text.includes('too many otp requests')) {
    return t('registration.errors.otpTooMany');
  }
  if (status(error) === 429 || text.includes('please wait before requesting')) {
    return t('registration.errors.otpWait');
  }
  if (text.includes('valid 10-digit') || text.includes('mobile number')) {
    return t('registration.errors.invalidMobile');
  }
  return t('registration.errors.otpSendFailed');
}

export function verifyOtpErrorMessage(error: unknown, t: TFunction): string {
  if (isNetwork(error)) {
    return t('registration.errors.network');
  }
  const text = backendText(error);
  if (text.includes('expired')) {
    return t('registration.errors.otpExpired');
  }
  if (text.includes('too many incorrect attempts')) {
    return t('registration.errors.otpTooManyAttempts');
  }
  if (text.includes('no longer valid')) {
    return t('registration.errors.otpAlreadyUsed');
  }
  return t('registration.errors.otpIncorrect');
}

export function submitErrorMessage(
  error: unknown,
  t: TFunction,
  mode: 'create' | 'edit' = 'create',
): string {
  if (isNetwork(error)) {
    return t('registration.errors.network');
  }
  const text = backendText(error);
  if (text.includes('verification token') || text.includes('already been used')) {
    return t('registration.errors.verificationExpired');
  }
  return mode === 'edit'
    ? t('registration.errors.saveFailed')
    : t('registration.errors.submitFailed');
}

/** True when the stored verification token is no longer usable and step 3 must restart. */
export function isVerificationExpired(error: unknown): boolean {
  const text = backendText(error);
  return text.includes('verification token') || text.includes('already been used');
}
