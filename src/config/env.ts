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
