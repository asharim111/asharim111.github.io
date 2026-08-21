import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import FlowDiagram from "../components/FlowDiagram";
import { projects, projectFilters, type Project, type ProjectCategory } from "../data/projects";
import { system } from "../lib/system";

/* ---------- per-project visuals ---------- */

function GatewayVisual() {
  return (
    <FlowDiagram
      compact
      steps={[
        { label: "Employee" },
        { label: "Entra ID Authentication" },
        { label: "AI Gateway" },
        { label: "Layer 1 — Microsoft Presidio" },
        { label: "Layer 2 — LLM Classifier" },
        { label: "Policy Engine" },
        { label: "OpenAI / Anthropic / Groq" },
      ]}
    />
  );
}

function AnalyticsVisual() {
  const bars = [42, 68, 55, 80, 62, 91, 74];
  return (
    <div className="rounded border border-line bg-ink/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.15em] text-dim">REVENUE / MARGIN</span>
        <span className="font-mono text-[10px] text-mint">LIVE · ERP</span>
      </div>
      <svg viewBox="0 0 280 120" className="w-full" role="img" aria-label="Sample analytics chart">
        {bars.map((h, i) => (
          <g key={i}>
            <rect x={12 + i * 38} y={110 - h} width="16" height={h} rx="2" fill="rgba(59,130,246,0.55)" />
            <rect x={30 + i * 38} y={110 - h * 0.6} width="6" height={h * 0.6} rx="2" fill="rgba(34,211,238,0.7)" />
          </g>
        ))}
        <polyline
          points={bars.map((h, i) => `${20 + i * 38},${104 - h * 0.85}`).join(" ")}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="1.5"
        />
      </svg>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
        {["KPIs", "Salesman Perf.", "Profit Margin"].map((k) => (
          <span key={k} className="rounded bg-panel-2 py-1 font-mono text-[9px] text-muted">{k}</span>
        ))}
      </div>
    </div>
  );
}

function CodeReviewVisual() {
  return (
    <div className="overflow-hidden rounded border border-line bg-ink/80 font-mono text-[11px]">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400/60" />
        <span className="h-2 w-2 rounded-full bg-amber-400/60" />
        <span className="h-2 w-2 rounded-full bg-mint/60" />
        <span className="ml-2 text-[9px] text-dim">review.js</span>
      </div>
      <div className="px-3 py-2 text-muted">
        <div><span className="text-violet">const</span> <span className="text-cyan">solution</span> = <span className="text-blue">analyze</span>(code);</div>
      </div>
      <div className="border-t border-line bg-panel px-3 py-2">
        <div className="text-[9px] tracking-[0.2em] text-dim">AI REVIEW</div>
        <div className="mt-1 text-fg">Potential issue detected</div>
        <div className="mt-0.5 text-amber-400/90">Severity: Medium</div>
        <div className="mt-0.5 text-muted">Recommendation: Improve error handling…</div>
      </div>
    </div>
  );
}

function CatalogVisual() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="rounded border border-line bg-panel-2 p-2">
          <div className="h-8 rounded bg-gradient-to-br from-blue/20 to-violet/15" />
          <div className="mt-1.5 h-1.5 w-3/4 rounded bg-line-bright" />
          <div className="mt-1 h-1.5 w-1/2 rounded bg-line" />
        </div>
      ))}
    </div>
  );
}

const visuals = {
  gateway: GatewayVisual,
  analytics: AnalyticsVisual,
  codereview: CodeReviewVisual,
  catalog: CatalogVisual,
} as const;

/* ---------- detail modal ---------- */

/** Short "system boot" shown while a project opens — INITIALIZING → module
 *  checks → SYSTEM READY. Skipped under reduced motion. */
function ModalBoot({ project }: { project: Project }) {
  const modules = project.detail.architecture.slice(0, 4);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timers = project.detail.architecture
      .slice(0, 4)
      .map((_, i) => window.setTimeout(() => setCount(i + 1), 150 + i * 180));
    return () => timers.forEach(clearTimeout);
  }, [project]);

  return (
    <div className="flex min-h-[280px] items-center justify-center p-8 font-mono" aria-hidden="true">
      <div className="w-64">
        <div className="text-[10px] tracking-[0.3em] text-cyan">
          INITIALIZING {project.name.toUpperCase()}
        </div>
        <div className="mt-4 space-y-1.5 text-[10.5px]">
          {modules.map((m, i) => (
            <div key={m} className="flex items-center justify-between">
              <span className={i < count ? "text-muted" : "text-dim/40"}>
                {m.toUpperCase().slice(0, 26)}
              </span>
              <span className={i < count ? "text-mint" : "text-dim/40"}>
                {i < count ? "OK" : "···"}
              </span>
            </div>
          ))}
        </div>
        {count >= modules.length && (
          <div className="mt-4 text-center text-[10px] tracking-[0.3em] text-mint">
            SYSTEM READY
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const reduced = useReducedMotion();
  const [booting, setBooting] = useState(!reduced);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (!booting) return;
    const t = window.setTimeout(() => setBooting(false), 1150);
    return () => clearTimeout(t);
  }, [booting]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-ink/80 p-4 backdrop-blur-sm md:p-8"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} details`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="glass my-8 w-full max-w-3xl rounded-lg"
      >
        {booting ? (
          <ModalBoot project={project} />
        ) : (
          <motion.div initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <div className="flex items-start justify-between border-b border-line p-6">
          <div>
            <div className="tech-label text-cyan">{project.index} / {project.dates}</div>
            <h3 className="mt-2 font-display text-2xl font-bold text-fg">{project.name}</h3>
            <p className="mt-1 text-sm text-muted">{project.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="rounded border border-line p-2 text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-8 p-6 md:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            {(
              [
                ["Overview", project.detail.overview],
                ["Problem", project.detail.problem],
                ["Solution", project.detail.solution],
              ] as const
            ).map(([label, text]) => (
              <div key={label}>
                <div className="tech-label mb-2">{label}</div>
                <p className="text-sm leading-relaxed text-muted">{text}</p>
              </div>
            ))}
            <div>
              <div className="tech-label mb-2">Key Results</div>
              <ul className="space-y-2">
                {project.detail.results.map((r) => (
                  <li key={r} className="flex gap-2 text-sm text-muted">
                    <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mint" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="tech-label mb-3">Architecture</div>
              <FlowDiagram compact steps={project.detail.architecture.map((label) => ({ label }))} />
            </div>
            <div>
              <div className="tech-label mb-2">Technology Stack</div>
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((t) => (
                  <span key={t} className="rounded border border-line bg-panel-2 px-2 py-1 font-mono text-[10px] text-muted">
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="tech-label mb-1">Role</div>
                <div className="text-xs text-fg">{project.detail.role}</div>
              </div>
              <div>
                <div className="tech-label mb-1">Timeline</div>
                <div className="text-xs text-fg">{project.detail.timeline}</div>
              </div>
            </div>
          </div>
        </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ---------- section ---------- */

export default function Projects() {
  const [filter, setFilter] = useState<"All" | ProjectCategory>("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const hoverTimer = useRef(0);

  const visible =
    filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter));

  const openProject = (p: Project) => {
    system.visitProject(p.id, p.name);
    setSelected(p);
  };

  // Dwell-hover cues — fire once per session after 1.6s over a card
  const onCardEnter = (p: Project) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      if (p.id === "ai-gateway") {
        system.logOnce("hover-gateway", "this is where AI meets enterprise security.", "accent");
      } else {
        system.logOnce("hover-project", "looks like this one caught your attention.", "info");
      }
    }, 1600);
  };
  const onCardLeave = () => window.clearTimeout(hoverTimer.current);

  return (
    <section id="projects" className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
      <SectionHeading
        index="03"
        label="Projects"
        title="Selected Systems"
        subtitle="Production systems spanning AI governance, business intelligence, developer tooling, and product platforms."
      />

      {/* Filters */}
      <Reveal className="mb-10 flex flex-wrap gap-2">
        {projectFilters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`rounded border px-4 py-2 font-mono text-xs tracking-wider transition-colors ${
              filter === f
                ? "border-cyan/60 bg-cyan/10 text-cyan"
                : "border-line text-muted hover:border-line-bright hover:text-fg"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </Reveal>

      <motion.div layout className="grid gap-6 lg:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => {
            const Visual = visuals[p.visual];
            return (
              <motion.article
                layout
                key={p.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
                data-cursor="view"
                className={`group relative flex cursor-pointer flex-col rounded-lg border bg-panel p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan/40 hover:shadow-[0_16px_50px_rgba(34,211,238,0.07)] md:p-8 ${
                  p.hero ? "border-cyan/25 lg:col-span-2" : "border-line"
                }`}
                onClick={() => openProject(p)}
                onMouseEnter={() => onCardEnter(p)}
                onMouseLeave={onCardLeave}
              >
                {p.hero && (
                  <span className="absolute right-6 top-6 rounded border border-violet/40 bg-violet/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-violet">
                    FLAGSHIP
                  </span>
                )}

                {/* Module readout — slides in on hover like a system inspector */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 rounded-b-lg border-t border-line bg-ink/90 px-6 py-3 font-mono text-[10px] opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:px-8"
                >
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                    <span>
                      <span className="text-dim">STATUS </span>
                      <span className="text-mint">MODULE READY</span>
                    </span>
                    <span>
                      <span className="text-dim">TYPE </span>
                      <span className="text-cyan">{p.categories[0].toUpperCase()}</span>
                    </span>
                    <span className="hidden sm:inline">
                      <span className="text-dim">STACK </span>
                      <span className="text-fg">{p.stack.slice(0, 3).join(" / ").toUpperCase()}</span>
                    </span>
                    <span className="ml-auto tracking-[0.2em] text-cyan">[ OPEN SYSTEM ]</span>
                  </div>
                </div>

                <div className={p.hero ? "grid gap-8 lg:grid-cols-[1.2fr_1fr]" : ""}>
                  <div>
                    <div className="tech-label text-cyan">{p.index} / {p.dates}</div>
                    <h3 className="mt-3 font-display text-2xl font-bold text-fg md:text-3xl">{p.name}</h3>
                    <p className="mt-1 text-sm font-medium text-muted md:text-base">{p.subtitle}</p>
                    <p className="mt-4 text-sm leading-relaxed text-muted">{p.description}</p>

                    <div className="mt-5 inline-flex items-center gap-2 rounded border border-mint/30 bg-mint/5 px-3 py-1.5 font-mono text-xs text-mint">
                      ▸ {p.keyAchievement}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {p.stack.map((t) => (
                        <span key={t} className="rounded border border-line bg-panel-2 px-2 py-1 font-mono text-[10px] text-muted">
                          {t}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cyan transition-transform group-hover:translate-x-1"
                    >
                      Open System <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className={`${p.hero ? "" : "mt-6"} opacity-80 transition-opacity duration-300 group-hover:opacity-100`}>
                    <Visual />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
