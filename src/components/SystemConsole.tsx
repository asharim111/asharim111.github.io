import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, TerminalSquare } from "lucide-react";
import { system, useSystem } from "../lib/system";

const kindClass = {
  info: "text-muted",
  ok: "text-mint",
  warn: "text-amber-400",
  accent: "text-cyan",
} as const;

/** SHARIM.OS terminal — a small collapsible console that narrates what the
 *  system is doing as the visitor navigates. */
export default function SystemConsole() {
  const lines = useSystem((s) => s.consoleLines);
  const open = useSystem((s) => s.consoleOpen);
  const booted = useSystem((s) => s.booted);
  const scrollRef = useRef<HTMLDivElement>(null);
  const latest = lines[lines.length - 1];

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, open]);

  if (!booted) return null;

  return (
    <div className="fixed bottom-4 left-4 z-[55] hidden font-mono sm:block">
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key="console"
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className="glass w-[320px] overflow-hidden rounded-lg shadow-2xl shadow-black/50"
          >
            <div className="flex items-center justify-between border-b border-line px-3 py-2">
              <span className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.25em] text-fg">
                <TerminalSquare className="h-3.5 w-3.5 text-cyan" /> SHARIM.OS
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[9px] tracking-[0.15em] text-mint">
                  <span className="h-1 w-1 rounded-full bg-mint [animation:pulse-soft_2s_ease-in-out_infinite]" />
                  ONLINE
                </span>
                <button
                  type="button"
                  aria-label="Collapse system console"
                  onClick={() => system.setConsoleOpen(false)}
                  className="rounded p-0.5 text-muted transition-colors hover:text-fg"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <div
              ref={scrollRef}
              aria-live="polite"
              className="max-h-44 space-y-1 overflow-y-auto px-3 py-2.5 text-[10.5px] leading-relaxed"
            >
              {lines.length === 0 && <div className="text-dim">&gt; awaiting activity...</div>}
              {lines.map((l) => (
                <div key={l.id} className={kindClass[l.kind]}>
                  <span className="text-dim">&gt; </span>
                  {l.text}
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="pill"
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22 }}
            onClick={() => system.setConsoleOpen(true)}
            aria-label="Open system console"
            className="glass group flex max-w-[300px] items-center gap-2 rounded-full py-2 pl-3 pr-4 text-[10px] shadow-lg shadow-black/40 transition-colors hover:border-cyan/40"
          >
            <TerminalSquare className="h-3.5 w-3.5 shrink-0 text-cyan" />
            <span className="tracking-[0.2em] text-fg">SHARIM.OS</span>
            {latest && (
              <span className={`truncate ${kindClass[latest.kind]}`}>&gt; {latest.text}</span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
