import { API_BASE_URL } from '../config/env';

export type ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  errorCode?: string;
  data?: T;
};

export class PublicApiError extends Error {
  readonly status: number;
  readonly errorCode?: string;
  readonly data?: unknown;

  constructor(message: string, status: number, errorCode?: string, data?: unknown) {
    super(message);
    this.name = 'PublicApiError';
    this.status = status;
    this.errorCode = errorCode;
    this.data = data;
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
  skipAuthClear?: boolean;
};

let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setPublicAccessToken(token: string | null): void {
  accessToken = token;
}

export function getPublicAccessToken(): string | null {
  return accessToken;
}

export function setPublicUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

export async function publicApi<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-ACOMI-CLIENT': 'WEB',
  };
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  const token = options.token ?? accessToken;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    credentials: 'include',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (response.status === 204) {
    return undefined as T;
  }

  let envelope: ApiEnvelope<T> | null = null;
  try {
    envelope = (await response.json()) as ApiEnvelope<T>;
  } catch {
    envelope = null;
  }

  if (!response.ok || envelope?.success === false) {
    if (response.status === 401 && !options.skipAuthClear) {
      onUnauthorized?.();
    }
    throw new PublicApiError(
      envelope?.message || 'Request failed',
      response.status,
      envelope?.errorCode,
      envelope?.data,
    );
  }

  if (envelope?.data === undefined || envelope.data === null) {
    throw new PublicApiError(envelope?.message || 'No data in response', response.status, envelope?.errorCode);
  }

  return envelope.data;
}

export async function publicApiVoid(path: string, options: RequestOptions = {}): Promise<void> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'X-ACOMI-CLIENT': 'WEB',
  };
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  const token = options.token ?? accessToken;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'POST',
    credentials: 'include',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (response.status === 204 || response.ok) {
    return;
  }

  throw new PublicApiError('Request failed', response.status);
}
