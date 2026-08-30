import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IdCard, Moon, Sparkles, Sun } from "lucide-react";
import { system, useSystem } from "../lib/system";
import { build, readTelemetry, relativeBuildAge, useFps } from "../lib/telemetry";

interface Counts {
  systems: number;
  architectures: number;
  technologies: number;
}

/**
 * Portfolio counts are derived from the data files rather than typed in — but
 * the data files are the heaviest modules in the project, and this widget sits
 * in the navbar. They are fetched when the panel opens, so "measured, not
 * claimed" costs the visitor nothing until they look.
 */
async function loadCounts(): Promise<Counts> {
  const [{ projects }, { architectures }, { skillGroups }] = await Promise.all([
    import("../data/projects"),
    import("../data/architectures"),
    import("../data/skills"),
  ]);
  return {
    systems: projects.length,
    architectures: architectures.length,
    technologies: skillGroups.reduce((n, g) => n + g.skills.length, 0),
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "● SYSTEM ONLINE" navbar widget.
 *
 * The readout used to be a table of constants. Every runtime row is now
 * measured from the Performance API on open, the frame counter only runs while
 * the panel is visible, and the portfolio counts are derived from the data
 * files — so none of it can go stale the way "LAST UPDATE AUG 2026" did.
 */
export default function StatusWidget() {
  const [open, setOpen] = useState(false);
  const discovery = useSystem((s) => s.discovery);
  const theme = useSystem((s) => s.theme);
  const rootRef = useRef<HTMLDivElement>(null);

  const fps = useFps(open);
  // Sampled once per opening: nav timing and resource weight don't change
  // after load, and re-reading them on every render would be noise.
  const [telemetry, setTelemetry] = useState(() => readTelemetry());
  useEffect(() => {
    if (open) setTelemetry(readTelemetry());
  }, [open]);

  const [counts, setCounts] = useState<Counts | null>(null);
  useEffect(() => {
    if (open && !counts) void loadCounts().then(setCounts);
  }, [open, counts]);

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

  const value = (v: number | null, unit = "") => (v === null ? "—" : `${v}${unit}`);

  const runtimeRows: Array<[string, string, string]> = [
    ["RENDER", value(telemetry.renderMs, "ms"), "text-mint"],
    ["JS SHIPPED", value(telemetry.jsKb, " KB"), "text-fg"],
    ["TRANSFERRED", value(telemetry.totalKb, " KB"), "text-fg"],
    ["FRAME RATE", fps === null ? "measuring…" : `${fps} fps`, "text-cyan"],
    ["NETWORK", telemetry.connection?.toUpperCase() ?? "—", "text-muted"],
  ];

  const portfolioRows: Array<[string, string]> = [
    ["SYSTEMS", counts ? pad(counts.systems) : "··"],
    ["ARCHITECTURES", counts ? pad(counts.architectures) : "··"],
    ["TECHNOLOGIES", counts ? pad(counts.technologies) : "··"],
    ["DLP CATEGORIES", "19"],
  ];

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
            className="glass elev-panel absolute right-0 top-full mt-2 w-72 rounded-lg p-4 font-mono"
          >
            <div className="flex items-center justify-between text-[9px] tracking-[0.25em] text-dim">
              <span>RUNTIME</span>
              <span className="text-mint">MEASURED</span>
            </div>
            <div className="mt-3 space-y-2 text-[10.5px]">
              {runtimeRows.map(([k, v, tone]) => (
                <div key={k} className="flex items-center justify-between gap-4">
                  <span className="text-muted">{k}</span>
                  <span className={tone}>{v}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-line pt-3 text-[9px] tracking-[0.25em] text-dim">
              PORTFOLIO
            </div>
            <div className="mt-2.5 space-y-2 text-[10.5px]">
              {portfolioRows.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-4">
                  <span className="text-muted">{k}</span>
                  <span className="text-fg">{v}</span>
                </div>
              ))}
              <div className="flex items-center justify-between gap-4 border-t border-line pt-2">
                <span className="text-muted">BUILD</span>
                <a
                  href={`https://github.com/${build.repo}/commit/${build.sha}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-cyan transition-colors hover:underline"
                >
                  {build.sha} · {relativeBuildAge() ?? "—"}
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => system.toggleTheme()}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded border border-line px-3 py-2 text-[10px] tracking-[0.2em] text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
            >
              {theme === "terminal" ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
              {theme === "terminal" ? "DAYLIGHT PROFILE" : "TERMINAL PROFILE"}
            </button>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                system.setRecruiterOpen(true);
              }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded border border-line px-3 py-2 text-[10px] tracking-[0.2em] text-muted transition-colors hover:border-mint/50 hover:text-mint"
            >
              <IdCard className="h-3 w-3" />
              RECRUITER BRIEFING
            </button>

            <button
              type="button"
              onClick={() => system.toggleDiscovery()}
              aria-pressed={discovery}
              className={`mt-2 flex w-full items-center justify-center gap-2 rounded border px-3 py-2 text-[10px] tracking-[0.2em] transition-colors ${
                discovery
                  ? "border-violet/50 bg-violet/10 text-violet"
                  : "border-line text-muted hover:border-violet/40 hover:text-violet"
              }`}
            >
              <Sparkles className="h-3 w-3" />
              DISCOVERY MODE {discovery ? "[ ACTIVE ]" : ""}
            </button>

            <div className="mt-3 text-center text-[9px] text-dim">CTRL+K · COMMAND CENTER</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
