/// <reference types="vite/client" />

/** Build provenance, replaced at compile time by `define` in vite.config.ts. */
declare const __BUILD_SHA__: string;
declare const __BUILD_BRANCH__: string;
declare const __BUILD_TIME__: string;
declare const __BUILD_RUN_ID__: string;
declare const __BUILD_REPO__: string;

interface ImportMetaEnv {
  /** Plausible site domain. Unset = analytics fully inert. */
  readonly VITE_PLAUSIBLE_DOMAIN?: string;
  readonly VITE_PLAUSIBLE_HOST?: string;
  /** Umami website id — alternative to Plausible. */
  readonly VITE_UMAMI_ID?: string;
  readonly VITE_UMAMI_SRC?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
