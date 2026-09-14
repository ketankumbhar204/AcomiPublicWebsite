/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the ACOMI backend, including the /api/v1 prefix. */
  readonly VITE_API_BASE_URL?: string;
  /** Origin of the authenticated ACOMI web app (login / find-a-place). */
  readonly VITE_APP_ORIGIN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
