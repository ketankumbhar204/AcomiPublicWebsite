import { postJson } from './client';
import type { OtpPurpose, SendOtpResponse, VerifyOtpResponse } from './types';

export function sendOtp(mobileNumber: string, purpose: OtpPurpose): Promise<SendOtpResponse> {
  return postJson<SendOtpResponse>('/auth/send-otp', { mobileNumber, purpose });
}

export function verifyOtp(
  mobileNumber: string,
  otp: string,
  purpose: OtpPurpose,
): Promise<VerifyOtpResponse> {
  return postJson<VerifyOtpResponse>('/auth/verify-otp', { mobileNumber, otp, purpose });
}
