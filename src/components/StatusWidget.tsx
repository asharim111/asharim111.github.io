import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Sparkles } from "lucide-react";
import { system, useSystem } from "../lib/system";

const STATUS_ROWS = [
  ["PORTFOLIO", "ONLINE", "text-mint"],
  ["INTERACTIONS", "ACTIVE", "text-cyan"],
  ["PROJECTS", "04", "text-fg"],
  ["ARCHITECTURES", "05", "text-fg"],
  ["DLP CATEGORIES", "19", "text-fg"],
] as const;

/** "● SYSTEM ONLINE" navbar widget — opens a status readout with real
 *  portfolio facts and the Discovery Mode toggle. */
export default function StatusWidget() {
  const [open, setOpen] = useState(false);
  const discovery = useSystem((s) => s.discovery);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative hidden md:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="System status"
        className="flex items-center gap-2 rounded border border-transparent px-2 py-1.5 font-mono text-[10px] tracking-[0.15em] text-mint transition-colors hover:border-line"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-mint [animation:pulse-soft_2.4s_ease-in-out_infinite]" />
        SYSTEM ONLINE
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            className="glass absolute right-0 top-full mt-2 w-60 rounded-lg p-4 font-mono shadow-2xl shadow-black/50"
          >
            <div className="text-[9px] tracking-[0.25em] text-dim">SYSTEM STATUS</div>
            <div className="mt-3 space-y-2 text-[10.5px]">
              {STATUS_ROWS.map(([k, v, tone]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-muted">{k}</span>
                  <span className={tone}>{v}</span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-line pt-2">
                <span className="text-muted">LAST UPDATE</span>
                <span className="text-fg">AUG 2026</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => system.toggleDiscovery()}
              aria-pressed={discovery}
              className={`mt-4 flex w-full items-center justify-center gap-2 rounded border px-3 py-2 text-[10px] tracking-[0.2em] transition-colors ${
                discovery
                  ? "border-violet/50 bg-violet/10 text-violet"
                  : "border-line text-muted hover:border-violet/40 hover:text-violet"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              DISCOVERY MODE {discovery ? "[ ACTIVE ]" : ""}
            </button>
            <div className="mt-2 text-center text-[9px] text-dim">CTRL+K · COMMAND CENTER</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
