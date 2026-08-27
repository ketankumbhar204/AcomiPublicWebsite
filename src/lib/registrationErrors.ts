import { ApiError } from '../api/client';

/*
 * Every branch returns copy authored here. Backend text is only ever matched against,
 * never rendered, so provider errors and exception messages cannot reach the page.
 */

const NETWORK = 'You appear to be offline. Check your connection and try again.';

function backendText(error: unknown): string {
  return error instanceof ApiError ? error.message.toLowerCase() : '';
}

function isNetwork(error: unknown): boolean {
  return error instanceof ApiError && error.isNetworkError;
}

function status(error: unknown): number {
  return error instanceof ApiError ? error.status : -1;
}

export function sendOtpErrorMessage(error: unknown): string {
  if (isNetwork(error)) {
    return NETWORK;
  }
  const text = backendText(error);
  if (text.includes('too many otp requests')) {
    return 'Too many OTP requests. Please try again later.';
  }
  if (status(error) === 429 || text.includes('please wait before requesting')) {
    return 'Please wait a moment before requesting another OTP.';
  }
  if (text.includes('valid 10-digit') || text.includes('mobile number')) {
    return 'Enter a valid 10-digit mobile number.';
  }
  return 'Unable to send OTP. Please try again.';
}

export function verifyOtpErrorMessage(error: unknown): string {
  if (isNetwork(error)) {
    return NETWORK;
  }
  const text = backendText(error);
  if (text.includes('expired')) {
    return 'OTP expired. Please request a new one.';
  }
  if (text.includes('too many incorrect attempts')) {
    return 'Too many incorrect attempts. Please request a new OTP.';
  }
  if (text.includes('no longer valid')) {
    return 'That OTP has already been used. Please request a new one.';
  }
  return 'Incorrect OTP. Please try again.';
}

export function submitErrorMessage(error: unknown): string {
  if (isNetwork(error)) {
    return NETWORK;
  }
  const text = backendText(error);
  if (text.includes('verification token') || text.includes('already been used')) {
    return 'Your mobile verification expired. Please verify your number again.';
  }
  return "We couldn't submit your property. Please try again.";
}

/** True when the stored verification token is no longer usable and step 3 must restart. */
export function isVerificationExpired(error: unknown): boolean {
  const text = backendText(error);
  return text.includes('verification token') || text.includes('already been used');
}
