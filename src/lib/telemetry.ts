import { useEffect, useState } from "react";

/**
 * Real runtime telemetry — the numbers this page actually produced, read from
 * the Performance API rather than typed into a constant. Everything degrades
 * to `null` where a browser doesn't expose it, and callers render "—" instead
 * of guessing.
 */

export interface StaticTelemetry {
  /** First Contentful Paint in ms, else DOMContentLoaded. */
  renderMs: number | null;
  /** Time to first byte in ms. */
  ttfbMs: number | null;
  /** Weight of all JavaScript this page pulled, in KiB. */
  jsKb: number | null;
  /** Everything the page transferred, in KiB. */
  totalKb: number | null;
  /** "4g" | "3g" | … */
  connection: string | null;
  /** Logical CPU cores. */
  cores: number | null;
  /** Approximate device memory in GB. */
  memoryGb: number | null;
}

function nav(): PerformanceNavigationTiming | undefined {
  try {
    return performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  } catch {
    return undefined;
  }
}

function paintMs(): number | null {
  try {
    const fcp = performance
      .getEntriesByType("paint")
      .find((e) => e.name === "first-contentful-paint");
    return fcp ? Math.round(fcp.startTime) : null;
  } catch {
    return null;
  }
}

/** Resource weight. `transferSize` is 0 for cached or opaque responses, so we
 *  fall back to the decoded body — the honest floor, never an invented number. */
function weight() {
  try {
    const entries = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    const n = nav();
    let js = 0;
    let total = n?.transferSize || n?.decodedBodySize || 0;

    for (const e of entries) {
      const bytes = e.transferSize || e.encodedBodySize || e.decodedBodySize || 0;
      total += bytes;
      if (e.initiatorType === "script" || /\.m?js(\?|$)/.test(e.name)) js += bytes;
    }
    return {
      jsKb: js > 0 ? Math.round(js / 1024) : null,
      totalKb: total > 0 ? Math.round(total / 1024) : null,
    };
  } catch {
    return { jsKb: null, totalKb: null };
  }
}

export function readTelemetry(): StaticTelemetry {
  const n = nav();
  const fcp = paintMs();
  const { jsKb, totalKb } = weight();

  return {
    renderMs:
      fcp ??
      (n && n.domContentLoadedEventEnd > 0 ? Math.round(n.domContentLoadedEventEnd) : null),
    ttfbMs: n && n.responseStart > 0 ? Math.round(n.responseStart - n.requestStart) : null,
    jsKb,
    totalKb,
    connection: navigator.connection?.effectiveType ?? null,
    cores: navigator.hardwareConcurrency ?? null,
    memoryGb: navigator.deviceMemory ?? null,
  };
}

/** True when the visitor is on a metered/slow connection or a weak device —
 *  used to trim animation work rather than to show anything. */
export function isConstrainedDevice() {
  if (typeof navigator === "undefined") return false;
  const c = navigator.connection;
  if (c?.saveData) return true;
  if (c?.effectiveType && /^(slow-)?2g$/.test(c.effectiveType)) return true;
  if (typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 2) return true;
  return false;
}

/**
 * Live frame rate, sampled in ~600ms windows. Only runs while `active` — a
 * status readout nobody has open must not hold a rAF loop awake.
 */
export function useFps(active: boolean) {
  const [fps, setFps] = useState<number | null>(null);

  useEffect(() => {
    if (!active) return;

    let raf = 0;
    let frames = 0;
    let windowStart = performance.now();
    let stopped = false;

    const tick = (now: number) => {
      if (stopped) return;
      frames += 1;
      const elapsed = now - windowStart;
      if (elapsed >= 600) {
        setFps(Math.round((frames * 1000) / elapsed));
        frames = 0;
        windowStart = now;
      }
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        frames = 0;
        windowStart = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [active]);

  return fps;
}

/** Static build stamp injected at compile time (see vite.config.ts). */
export const build = {
  sha: __BUILD_SHA__,
  branch: __BUILD_BRANCH__,
  time: __BUILD_TIME__,
  runId: __BUILD_RUN_ID__,
  repo: __BUILD_REPO__,
};

export function buildCommitUrl() {
  return `https://github.com/${build.repo}/commit/${build.sha}`;
}

export function buildRunUrl() {
  return build.runId
    ? `https://github.com/${build.repo}/actions/runs/${build.runId}`
    : `https://github.com/${build.repo}/actions`;
}

/** "4d ago" / "3h ago" — relative to the compile-time stamp. */
export function relativeBuildAge(now = Date.now()) {
  const then = Date.parse(build.time);
  if (Number.isNaN(then)) return null;
  const mins = Math.max(0, Math.round((now - then) / 60000));
  if (mins < 60) return `${mins || 1}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  return months < 12 ? `${months}mo ago` : `${Math.round(months / 12)}y ago`;
}
