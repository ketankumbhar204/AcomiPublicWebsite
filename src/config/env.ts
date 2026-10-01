/**
 * Only ever read public, non-secret configuration here. Anything in import.meta.env is
 * inlined into the browser bundle at build time.
 */
const DEFAULT_API_BASE_URL = 'http://localhost:8080/api/v1';

function readApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim();
  return (configured || DEFAULT_API_BASE_URL).replace(/\/+$/, '');
}

export const API_BASE_URL = readApiBaseUrl();

/** Local Vite + local API only — never shown in production builds. */
export const IS_LOCAL_DEV =
  import.meta.env.DEV && /localhost|127\.0\.0\.1/.test(API_BASE_URL);
