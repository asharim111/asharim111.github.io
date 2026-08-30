import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { isConstrainedDevice } from "../lib/telemetry";

export interface GatewayStage {
  id: string;
  /** Short label for the core itself. */
  core: string;
  /** Longer label for the floating status panel. */
  panel: string;
  tone: "cyan" | "violet" | "mint" | "blue";
  /** Which orbital ring lights up while this stage runs. */
  ring: 0 | 1 | 2;
}

/** The real AI Gateway pipeline, one stage per beat. Same seven steps the
 *  gateway simulation further down the page walks through. */
export const GATEWAY_STAGES: GatewayStage[] = [
  { id: "request", core: "REQUEST", panel: "PROMPT RECEIVED", tone: "cyan", ring: 0 },
  { id: "identity", core: "VERIFY", panel: "ENTRA ID · VERIFIED", tone: "blue", ring: 2 },
  { id: "dlp", core: "SCAN", panel: "PRESIDIO · SCANNING", tone: "violet", ring: 2 },
  { id: "classify", core: "CLASSIFY", panel: "LLM CLASSIFIER · 19 CATS", tone: "violet", ring: 2 },
  { id: "policy", core: "POLICY", panel: "DEPARTMENT POLICY · PASS", tone: "mint", ring: 1 },
  { id: "route", core: "ROUTE", panel: "OPENAI / ANTHROPIC / GROQ", tone: "cyan", ring: 2 },
  { id: "response", core: "RESPONSE", panel: "AUDIT LOG · WRITTEN", tone: "mint", ring: 0 },
];

const BEAT_MS = 1100;

/**
 * Drives the hero core through the gateway pipeline instead of spinning
 * decoratively — the hero demonstrates the thing the portfolio is about.
 *
 * Costs one interval, and only while it can be seen: paused off-screen, paused
 * in a background tab, and frozen entirely under reduced motion or on a
 * constrained device, where it settles on a legible resting state.
 */
export function useGatewayCycle(ref: React.RefObject<HTMLElement | null>) {
  const reduced = useReducedMotion();
  const frozen = reduced || isConstrainedDevice();
  const [index, setIndex] = useState(0);
  const visible = useRef(true);

  useEffect(() => {
    if (frozen) return;

    const el = ref.current;
    let timer = 0;

    const tick = () => {
      if (!document.hidden && visible.current) {
        setIndex((i) => (i + 1) % GATEWAY_STAGES.length);
      }
    };

    const start = () => {
      clearInterval(timer);
      timer = window.setInterval(tick, BEAT_MS);
    };

    const observer = el
      ? new IntersectionObserver(
          ([entry]) => {
            visible.current = entry.isIntersecting;
          },
          { threshold: 0.05 },
        )
      : null;
    if (el && observer) observer.observe(el);

    start();
    return () => {
      clearInterval(timer);
      observer?.disconnect();
    };
  }, [frozen, ref]);

  return {
    stage: GATEWAY_STAGES[index],
    index,
    total: GATEWAY_STAGES.length,
    frozen,
  };
}
