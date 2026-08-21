import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { system, useSystem } from "../lib/system";

const MODULES = ["AI MODULE", "API ENGINE", "SECURITY", "AUTOMATION"];

/** ~1.8s cinematic boot sequence. Plays once per browser session, is
 *  skippable (click / Esc / Enter), and is skipped entirely under
 *  prefers-reduced-motion. */
export default function BootScreen() {
  const reduced = useReducedMotion();
  const booted = useSystem((s) => s.booted);
  const [progress, setProgress] = useState(0);
  const [moduleCount, setModuleCount] = useState(0);
  const [done, setDone] = useState(false);

  const skip = booted || reduced;

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

    document.body.style.overflow = "hidden";
    system.log("initializing Sharim's engineering environment...", "info");

    const t0 = performance.now();
    let raf = 0;
    const DURATION = 1250;
    const tick = (now: number) => {
      const t = Math.min((now - t0) / DURATION, 1);
      setProgress(Math.round(t * 100));
      setModuleCount(Math.min(MODULES.length, Math.floor(t * (MODULES.length + 1))));
      if (t < 1) raf = requestAnimationFrame(tick);
      else finishTimer = window.setTimeout(finish, 420);
    };
    let finishTimer = 0;
    raf = requestAnimationFrame(tick);

    const finish = () => {
      setDone(true);
      system.markBooted();
      system.log("access granted. welcome, visitor.", "ok");
      document.body.style.overflow = "";
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") finish();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(finishTimer);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            document.body.style.overflow = "";
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
