/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the ACOMI backend, including the /api/v1 prefix. */
  readonly VITE_API_BASE_URL?: string;
  /** Origin of the authenticated ACOMI web app (login / find-a-place). */
  readonly VITE_APP_ORIGIN?: string;
  /** Official Google Play listing for ACOMI Android (override when finalized). */
  readonly VITE_ANDROID_PLAY_STORE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
