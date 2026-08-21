import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { system } from "../lib/system";
import { profile } from "../data/profile";

const NODES = ["REACT", "API", "NODE / FASTAPI", "DATABASE", "SECURITY", "AI"];

/** Signature experience: a ~3s cinematic dive through the stack that ends on
 *  the engineer's name, then lands the visitor on About. Skippable at any
 *  moment; reduced motion goes straight to About. */
export default function EnterSystem({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0); // 1..NODES.length nodes lit, then name
  const [showName, setShowName] = useState(false);

  const finish = () => {
    onDone();
    document.getElementById("about")?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  useEffect(() => {
    if (reduced) {
      finish();
      return;
    }
    system.log("entering the system...", "accent");
    const timers: number[] = [];
    NODES.forEach((_, i) => {
      timers.push(window.setTimeout(() => setStep(i + 1), 250 + i * 320));
    });
    timers.push(
      window.setTimeout(() => setShowName(true), 250 + NODES.length * 320 + 200),
      window.setTimeout(() => {
        system.log("system entered. welcome.", "ok");
        finish();
      }, 250 + NODES.length * 320 + 1500),
    );
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  if (reduced) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[88] flex cursor-pointer items-center justify-center bg-ink/95 backdrop-blur-sm"
      onClick={finish}
      role="status"
      aria-label="Entering the system"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="relative font-mono">
        <AnimatePresence mode="wait">
          {!showName ? (
            <motion.div key="nodes" exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.25 }}>
              {NODES.map((n, i) => (
                <div key={n} className="flex flex-col items-center">
                  <div
                    className={`w-52 rounded border px-4 py-2 text-center text-xs tracking-[0.2em] transition-all duration-300 ${
                      step > i
                        ? "border-cyan/60 bg-cyan/10 text-cyan shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                        : "border-line/50 text-dim/50"
                    }`}
                  >
                    {n}
                  </div>
                  {i < NODES.length - 1 && (
                    <span
                      className={`h-4 w-px transition-colors duration-300 ${step > i + 1 ? "bg-cyan/60" : "bg-line"}`}
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="name"
              initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="font-display text-3xl font-bold tracking-[0.15em] text-fg md:text-4xl">
                {profile.name.toUpperCase()}
              </div>
              <div className="mt-3 text-[11px] tracking-[0.35em] text-cyan">
                {profile.title.toUpperCase()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] tracking-[0.3em] text-dim">
          CLICK TO SKIP
        </div>
      </div>
    </motion.div>
  );
}
