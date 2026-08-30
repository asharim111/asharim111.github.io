import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { system } from "../lib/system";
import { useScrollLock } from "../hooks/useScrollLock";

const MODULES = ["AI MODULE", "API ENGINE", "SECURITY", "AUTOMATION"];

/** ~1.7s cinematic boot sequence. Plays once per *visitor* (the flag lives in
 *  localStorage now, so a second tab doesn't replay it), is skippable
 *  (click / Esc / Enter), and is skipped entirely under prefers-reduced-motion. */
export default function BootScreen() {
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [moduleCount, setModuleCount] = useState(0);
  const [done, setDone] = useState(false);

  /**
   * Captured once, on first render.
   *
   * This used to read `booted` live from the store — so the moment the
   * sequence finished and called `markBooted()`, `skip` flipped true, the
   * component returned null, and the blur-out exit animation never played: the
   * screen vanished on a hard cut. The decision to show the boot at all is a
   * mount-time decision, so it's frozen here.
   */
  const skip = useRef(system.get().booted || reduced).current;

  useScrollLock(!skip && !done);

  useEffect(() => {
    if (skip) {
      if (!system.get().booted) system.markBooted();
      // Only narrate the skip when nothing was logged yet (returning visitor /
      // reduced motion) — after a live boot the sequence already spoke.
      if (system.get().consoleLines.length === 0) {
        system.logOnce("boot", "SHARIM.OS · systems online.", "ok");
      }
      return;
    }

    system.log("initializing Sharim's engineering environment...", "info");

    const t0 = performance.now();
    let raf = 0;
    let finishTimer = 0;
    const DURATION = 1250;

    const finish = () => {
      setDone(true);
      system.markBooted();
      system.log("access granted. welcome, visitor.", "ok");
    };

    const tick = (now: number) => {
      const t = Math.min((now - t0) / DURATION, 1);
      setProgress(Math.round(t * 100));
      setModuleCount(Math.min(MODULES.length, Math.floor(t * (MODULES.length + 1))));
      if (t < 1) raf = requestAnimationFrame(tick);
      else finishTimer = window.setTimeout(finish, 420);
    };
    raf = requestAnimationFrame(tick);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        cancelAnimationFrame(raf);
        clearTimeout(finishTimer);
        finish();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(finishTimer);
      window.removeEventListener("keydown", onKey);
    };
  }, [skip]);

  if (skip) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          role="status"
          aria-label="Loading portfolio"
          exit={{ opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.45, ease: "easeInOut" }}
          className="fixed inset-0 z-[90] flex cursor-pointer items-center justify-center bg-ink"
          onClick={() => {
            setDone(true);
            system.markBooted();
          }}
        >
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
          <div className="relative w-[300px] font-mono">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold tracking-[0.3em] text-fg">SHARIM.OS</span>
              <span className="text-[10px] text-dim">v7.0</span>
            </div>
            <div className="mt-1 text-[10px] tracking-[0.25em] text-cyan">INITIALIZING...</div>

            {/* Progress bar */}
            <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-panel-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan to-blue transition-[width] duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-1.5 text-right text-[10px] text-muted">{progress}%</div>

            {/* Module checks */}
            <div className="mt-4 space-y-1.5 text-[11px]">
              {MODULES.map((m, i) => (
                <div key={m} className="flex items-center justify-between">
                  <span className={i < moduleCount ? "text-muted" : "text-dim/40"}>{m}</span>
                  <span className={i < moduleCount ? "text-mint" : "text-dim/40"}>
                    {i < moduleCount ? "ONLINE" : "· · ·"}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 text-center text-[10px] tracking-[0.3em] text-dim">
              {progress >= 100 ? <span className="text-fg">WELCOME.</span> : "PRESS ESC TO SKIP"}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
