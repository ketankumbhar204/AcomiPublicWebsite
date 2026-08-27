import { API_BASE_URL } from '../config/env';

/**
 * Carries the transport-level facts only. Callers turn these into user-facing copy so
 * raw backend text never reaches the DOM.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly errorCode: string | null;
  readonly isNetworkError: boolean;

  constructor(status: number, message: string, errorCode: string | null = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorCode = errorCode;
    this.isNetworkError = status === 0;
  }
}

/** Envelope produced by the backend's ApiResponse. */
type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  errorCode?: string;
  data?: T;
};

export async function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Network request failed');
  }

  let envelope: ApiEnvelope<TResponse> | null = null;
  try {
    envelope = (await response.json()) as ApiEnvelope<TResponse>;
  } catch {
    // A proxy or gateway can return a non-JSON body. Fall through to the status check.
  }

  if (!response.ok || envelope?.success === false) {
    throw new ApiError(
      response.status,
      envelope?.message ?? `Request failed with status ${response.status}`,
      envelope?.errorCode ?? null,
    );
  }

  if (envelope?.data === undefined) {
    throw new ApiError(response.status, 'Response payload was empty');
  }

  return envelope.data;
}
