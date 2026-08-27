/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the ACOMI backend, including the /api/v1 prefix. */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
