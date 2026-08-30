/**
 * Privacy-first analytics shim.
 *
 * Provider-agnostic and inert by default: with no env configured, nothing is
 * injected, no request is made, and `track()` is a no-op — so the static build
 * stays exactly as fast and as private as it is today. Point it at a provider
 * and the same call sites start reporting.
 *
 *   Plausible:  VITE_PLAUSIBLE_DOMAIN=sharimansari.dev
 *               VITE_PLAUSIBLE_HOST=https://plausible.io   (optional)
 *   Umami:      VITE_UMAMI_ID=<website-id>
 *               VITE_UMAMI_SRC=https://cloud.umami.is/script.js
 *
 * Both are cookieless and need no consent banner. Do Not Track and Global
 * Privacy Control are honoured — the script is never loaded for those visitors.
 */

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: Props }) => void;
    umami?: { track: (event: string, data?: Props) => void };
  }
  interface Navigator {
    globalPrivacyControl?: boolean;
    /** Non-standard but widely shipped; used only to soften animation cost. */
    deviceMemory?: number;
    connection?: {
      effectiveType?: string;
      saveData?: boolean;
      addEventListener?: (t: string, fn: () => void) => void;
      removeEventListener?: (t: string, fn: () => void) => void;
    };
  }
}

const PLAUSIBLE_DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
const PLAUSIBLE_HOST =
  (import.meta.env.VITE_PLAUSIBLE_HOST as string | undefined) ?? "https://plausible.io";
const UMAMI_ID = import.meta.env.VITE_UMAMI_ID as string | undefined;
const UMAMI_SRC =
  (import.meta.env.VITE_UMAMI_SRC as string | undefined) ?? "https://cloud.umami.is/script.js";

const configured = Boolean(PLAUSIBLE_DOMAIN || UMAMI_ID);

function optedOut() {
  if (typeof navigator === "undefined") return true;
  return navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true;
}

let started = false;
/** Events fired before the provider script finishes loading. */
const queue: Array<[string, Props | undefined]> = [];

function flush() {
  while (queue.length) {
    const next = queue.shift();
    if (next) dispatch(next[0], next[1]);
  }
}

function dispatch(event: string, props?: Props) {
  if (window.plausible) {
    window.plausible(event, props ? { props } : undefined);
    return;
  }
  if (window.umami) {
    window.umami.track(event, props);
    return;
  }
  queue.push([event, props]);
}

/** Injects the configured provider. Safe to call more than once. */
export function initAnalytics() {
  if (started || !configured || optedOut() || typeof document === "undefined") return;
  started = true;

  const s = document.createElement("script");
  s.defer = true;

  if (PLAUSIBLE_DOMAIN) {
    s.src = `${PLAUSIBLE_HOST.replace(/\/$/, "")}/js/script.js`;
    s.dataset.domain = PLAUSIBLE_DOMAIN;
    // Plausible's snippet stub — queues until the script defines the real fn.
    window.plausible =
      window.plausible ||
      function (...args: unknown[]) {
        ((window.plausible as unknown as { q?: unknown[] }).q ??= []).push(args);
      };
  } else if (UMAMI_ID) {
    s.src = UMAMI_SRC;
    s.dataset.websiteId = UMAMI_ID;
  }

  s.addEventListener("load", flush, { once: true });
  document.head.appendChild(s);
}

/**
 * Report an interaction. Never throws, never blocks, and drops silently when
 * no provider is configured.
 */
export function track(event: string, props?: Props) {
  if (import.meta.env.DEV) {
    // Verifiable locally without signing up for anything.
    console.debug("[analytics]", event, props ?? "");
  }
  if (!configured || optedOut() || typeof window === "undefined") return;
  try {
    dispatch(event, props);
  } catch {
    /* analytics must never break the page */
  }
}

export const analyticsEnabled = configured;
