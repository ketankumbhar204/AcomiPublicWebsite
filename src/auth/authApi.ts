import { publicApi, publicApiVoid } from '../lib/apiClient';
import type { AuthTokenResponse, PublicUser, SendOtpResponse, VerifyOtpResponse } from './types';

export const publicAuthApi = {
  login: (mobileNumber: string, password: string) =>
    publicApi<AuthTokenResponse>('/auth/login', {
      method: 'POST',
      skipAuthClear: true,
      body: { mobileNumber, password },
    }),

  loginWithOtp: (mobileNumber: string, verificationToken: string) =>
    publicApi<AuthTokenResponse>('/auth/login-with-otp', {
      method: 'POST',
      skipAuthClear: true,
      body: { mobileNumber, verificationToken },
    }),

  register: (payload: {
    fullName: string;
    mobileNumber: string;
    password: string;
    confirmPassword: string;
    verificationToken?: string;
  }) =>
    publicApi<AuthTokenResponse>('/auth/register', {
      method: 'POST',
      skipAuthClear: true,
      body: payload,
    }),

  sendOtp: (mobileNumber: string, purpose: 'LOGIN' | 'REGISTER') =>
    publicApi<SendOtpResponse>('/auth/send-otp', {
      method: 'POST',
      skipAuthClear: true,
      body: { mobileNumber, purpose },
    }),

  verifyOtp: (mobileNumber: string, otp: string, purpose: 'LOGIN' | 'REGISTER') =>
    publicApi<VerifyOtpResponse>('/auth/verify-otp', {
      method: 'POST',
      skipAuthClear: true,
      body: { mobileNumber, otp, purpose },
    }),

  me: (token?: string | null) =>
    publicApi<PublicUser>('/auth/me', { skipAuthClear: true, token }),

  logout: () => publicApiVoid('/auth/logout', { method: 'POST', skipAuthClear: true }),
};
