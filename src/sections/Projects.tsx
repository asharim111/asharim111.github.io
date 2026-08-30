import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import FlowDiagram from "../components/FlowDiagram";
import {
  projects,
  projectFilters,
  type Project,
  type ProjectCategory,
} from "../data/projects";
import { useScrollLock } from "../hooks/useScrollLock";
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

/** The platform's defining decision: a product is entered once, tagged to a
 *  company and its streams, then surfaces on both pages automatically. */
function CmsVisual() {
  const inputs = [
    { label: "COMPANY", cx: 44, x: 4, color: "#3b82f6" },
    { label: "CATEGORY", cx: 140, x: 98, color: "#8b5cf6" },
    { label: "STREAM", cx: 236, x: 196, color: "#22d3ee" },
  ];

  return (
    <div className="rounded border border-line bg-ink/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.15em] text-dim">
          CONTENT MODEL
        </span>
        <span className="font-mono text-[10px] text-mint">
          ENTER ONCE · SURFACE TWICE
        </span>
      </div>

      <svg
        viewBox="0 0 280 136"
        className="mx-auto w-full max-w-90 font-mono"
        role="img"
        aria-label="Content model: company, category and stream feed one product record, which surfaces on both the company page and the stream page"
      >
        {/* inputs → product */}
        {inputs.map(({ label, cx, x, color }) => (
          <g key={label}>
            <rect
              x={x}
              y={4}
              width={label === "CATEGORY" ? 84 : 80}
              height={20}
              rx="3"
              fill={`${color}14`}
              stroke={`${color}80`}
            />
            <text
              x={cx}
              y={15}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fill={color}
            >
              {label}
            </text>
            <line
              x1={cx}
              y1={26}
              x2={cx === 140 ? 140 : cx < 140 ? 128 : 152}
              y2={56}
              stroke="var(--color-line-bright)"
              strokeWidth="1"
            />
          </g>
        ))}

        {/* the single product record */}
        <rect
          x="86"
          y="58"
          width="108"
          height="24"
          rx="3"
          fill="rgba(52,211,153,0.1)"
          stroke="rgba(52,211,153,0.55)"
        />
        <text
          x="140"
          y="70"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fill="var(--color-mint)"
        >
          PRODUCT
        </text>

        {/* product → the two surfaces it appears on */}
        {[
          { x1: 126, x2: 68, href: "/companies/sigs" },
          { x1: 154, x2: 212, href: "/what-we-do/upstream" },
        ].map(({ x1, x2, href }) => (
          <g key={href}>
            <line
              x1={x1}
              y1={84}
              x2={x2}
              y2={110}
              stroke="rgba(52,211,153,0.4)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <rect
              x={x2 - 62}
              y={112}
              width="124"
              height="20"
              rx="3"
              fill="var(--color-panel-2)"
              stroke="var(--color-line-bright)"
            />
            <text
              x={x2}
              y={123}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fill="var(--color-muted)"
            >
              {href}
            </text>
          </g>
        ))}
      </svg>

      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
        {["6 Companies", "44 Products", "21 Routes"].map((k) => (
          <span
            key={k}
            className="rounded bg-panel-2 py-1 font-mono text-[9px] text-muted"
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}

function AnalyticsVisual() {
  const bars = [42, 68, 55, 80, 62, 91, 74];
  return (
    <div className="rounded border border-line bg-ink/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.15em] text-dim">
          REVENUE / MARGIN
        </span>
        <span className="font-mono text-[10px] text-mint">LIVE · ERP</span>
      </div>
      <svg
        viewBox="0 0 280 120"
        className="w-full"
        role="img"
        aria-label="Sample analytics chart"
      >
        {bars.map((h, i) => (
          <g key={i}>
            <rect
              x={12 + i * 38}
              y={110 - h}
              width="16"
              height={h}
              rx="2"
              fill="rgba(59,130,246,0.55)"
            />
            <rect
              x={30 + i * 38}
              y={110 - h * 0.6}
              width="6"
              height={h * 0.6}
              rx="2"
              fill="rgba(34,211,238,0.7)"
            />
          </g>
        ))}
        <polyline
          points={bars
            .map((h, i) => `${20 + i * 38},${104 - h * 0.85}`)
            .join(" ")}
          fill="none"
          stroke="var(--color-violet)"
          strokeWidth="1.5"
        />
      </svg>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
        {["KPIs", "Salesman Perf.", "Profit Margin"].map((k) => (
          <span
            key={k}
            className="rounded bg-panel-2 py-1 font-mono text-[9px] text-muted"
          >
            {k}
          </span>
        ))}
      </div>
    </div>
  );
}

function CodeReviewVisual() {
  return (
    <div className="overflow-hidden rounded border border-line bg-ink/80 font-mono text-[11px]">
      <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-danger/60" />
        <span className="h-2 w-2 rounded-full bg-warn/60" />
        <span className="h-2 w-2 rounded-full bg-mint/60" />
        <span className="ml-2 text-[9px] text-dim">review.js</span>
      </div>
      <div className="px-3 py-2 text-muted">
        <div>
          <span className="text-violet">const</span>{" "}
          <span className="text-cyan">solution</span> ={" "}
          <span className="text-blue">analyze</span>(code);
        </div>
      </div>
      <div className="border-t border-line bg-panel px-3 py-2">
        <div className="text-[9px] tracking-[0.2em] text-dim">AI REVIEW</div>
        <div className="mt-1 text-fg">Potential issue detected</div>
        <div className="mt-0.5 text-warn">Severity: Medium</div>
        <div className="mt-0.5 text-muted">
          Recommendation: Improve error handling…
        </div>
      </div>
    </div>
  );
}

function CatalogVisual() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="rounded border border-line bg-panel-2 p-2">
          <div className="h-8 rounded bg-linear-to-br from-blue/20 to-violet/15" />
          <div className="mt-1.5 h-1.5 w-3/4 rounded bg-line-bright" />
          <div className="mt-1 h-1.5 w-1/2 rounded bg-line" />
        </div>
      ))}
    </div>
  );
}

const visuals = {
  gateway: GatewayVisual,
  cms: CmsVisual,
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
    <div
      className="flex min-h-70 items-center justify-center p-8 font-mono"
      aria-hidden="true"
    >
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

type Tab = "overview" | "approach" | "decisions" | "results";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "overview", label: "OVERVIEW" },
  { id: "approach", label: "APPROACH" },
  { id: "decisions", label: "DECISIONS" },
  { id: "results", label: "RESULTS" },
];

/**
 * Case study.
 *
 * Problem -> constraints -> approach -> decision log -> measured result. The
 * decision log is the point: what was chosen, why, and what it cost. A
 * decision with no stated tradeoff was not a decision, and a case study
 * without one reads as a feature list. Tabbed so the depth does not become a
 * wall, with architecture, stack and role pinned beside every tab.
 */
function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const [booting, setBooting] = useState(!reduced);
  const [tab, setTab] = useState<Tab>("overview");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useScrollLock(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!booting) return;
    const t = window.setTimeout(() => setBooting(false), 1150);
    return () => clearTimeout(t);
  }, [booting]);

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next =
      (i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length;
    setTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  const { detail } = project;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-70 flex items-start justify-center overflow-y-auto bg-ink/80 p-4 backdrop-blur-sm md:p-8"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.name} case study`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.3 }}
        onMouseDown={(e) => e.stopPropagation()}
        className="glass elev-panel my-8 w-full max-w-4xl rounded-lg"
      >
        {booting ? (
          <ModalBoot project={project} />
        ) : (
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line p-6">
              <div>
                <div className="tech-label text-cyan">
                  {project.index} / {project.dates}
                </div>
                <h3 className="mt-2 font-display text-2xl font-bold text-fg">
                  {project.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{project.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close project details"
                className="shrink-0 rounded border border-line p-2 text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div
              role="tablist"
              aria-label="Case study sections"
              className="flex gap-1 overflow-x-auto border-b border-line px-6 pt-3"
            >
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  type="button"
                  id={`tab-${project.id}-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`panel-${project.id}-${t.id}`}
                  tabIndex={tab === t.id ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={`whitespace-nowrap border-b-2 px-4 pb-2.5 pt-1 font-mono text-[10px] tracking-[0.2em] transition-colors ${
                    tab === t.id
                      ? "border-cyan text-cyan"
                      : "border-transparent text-dim hover:text-fg"
                  }`}
                >
                  {t.label}
                  {t.id === "decisions" && (
                    <span className="ml-1.5 text-[9px] text-dim">
                      {detail.decisions.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="grid gap-8 p-6 md:grid-cols-[1.5fr_1fr]">
              <div
                role="tabpanel"
                id={`panel-${project.id}-${tab}`}
                aria-labelledby={`tab-${project.id}-${tab}`}
                className="min-w-0 space-y-6"
              >
                {tab === "overview" && (
                  <>
                    <div>
                      <div className="tech-label mb-2">Overview</div>
                      <p className="text-sm leading-relaxed text-muted">
                        {detail.overview}
                      </p>
                    </div>
                    <div>
                      <div className="tech-label mb-2">Problem</div>
                      <p className="text-sm leading-relaxed text-muted">
                        {detail.problem}
                      </p>
                    </div>
                    <div>
                      <div className="tech-label mb-2">Constraints</div>
                      <ul className="space-y-2">
                        {detail.constraints.map((c) => (
                          <li
                            key={c}
                            className="flex gap-2 text-sm leading-relaxed text-muted"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-violet"
                            />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {tab === "approach" && (
                  <div>
                    <div className="tech-label mb-2">Solution</div>
                    <p className="text-sm leading-relaxed text-muted">
                      {detail.solution}
                    </p>
                    <div className="mt-6 rounded border border-mint/25 bg-mint/5 p-4">
                      <div className="font-mono text-[10px] tracking-[0.2em] text-mint">
                        KEY OUTCOME
                      </div>
                      <p className="mt-1.5 text-sm text-fg">
                        {project.keyAchievement}
                      </p>
                    </div>
                  </div>
                )}

                {tab === "decisions" && (
                  <div className="space-y-4">
                    <p className="font-mono text-[10px] leading-relaxed tracking-[0.12em] text-dim">
                      WHAT WAS CHOSEN &middot; WHY &middot; WHAT IT COST
                    </p>
                    {detail.decisions.map((d, i) => (
                      <article
                        key={d.choice}
                        className="rounded-lg border border-line bg-panel p-5"
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 font-mono text-[10px] text-dim">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <h4 className="font-display text-sm font-bold leading-snug text-fg">
                            {d.choice}
                          </h4>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted">
                          {d.why}
                        </p>
                        <p className="mt-3 flex gap-2 border-t border-line pt-3 text-[13px] leading-relaxed text-muted">
                          <span className="shrink-0 font-mono text-[10px] tracking-[0.15em] text-warn">
                            TRADEOFF
                          </span>
                          {d.tradeoff}
                        </p>
                      </article>
                    ))}
                  </div>
                )}

                {tab === "results" && (
                  <div>
                    <div className="tech-label mb-2">Measured results</div>
                    <ul className="space-y-2">
                      {detail.results.map((r) => (
                        <li
                          key={r}
                          className="flex gap-2 text-sm leading-relaxed text-muted"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-mint"
                          />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Pinned context - the same beside every tab */}
              <div className="min-w-0 space-y-6">
                <div>
                  <div className="tech-label mb-3">Architecture</div>
                  <FlowDiagram
                    compact
                    steps={detail.architecture.map((label) => ({ label }))}
                  />
                </div>
                <div>
                  <div className="tech-label mb-2">Technology Stack</div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((t) => (
                      <span
                        key={t}
                        className="rounded border border-line bg-panel-2 px-2 py-1 font-mono text-[10px] text-muted"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="tech-label mb-1">Role</div>
                    <div className="text-xs text-fg">{detail.role}</div>
                  </div>
                  <div>
                    <div className="tech-label mb-1">Timeline</div>
                    <div className="text-xs text-fg">{detail.timeline}</div>
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
    filter === "All"
      ? projects
      : projects.filter((p) => p.categories.includes(filter));

  const openProject = (p: Project) => {
    system.visitProject(p.id, p.name);
    setSelected(p);
  };

  // Dwell-hover cues — fire once per session after 1.6s over a card
  const onCardEnter = (p: Project) => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => {
      if (p.id === "ai-gateway") {
        system.logOnce(
          "hover-gateway",
          "this is where AI meets enterprise security.",
          "accent",
        );
      } else if (p.id === "oil-gas-platform") {
        system.logOnce(
          "hover-cms",
          "one record, two surfaces — the content model doing the work.",
          "accent",
        );
      } else {
        system.logOnce(
          "hover-project",
          "looks like this one caught your attention.",
          "info",
        );
      }
    }, 1600);
  };
  const onCardLeave = () => window.clearTimeout(hoverTimer.current);

  // A dwell timer that outlives the section would fire into a dead tree.
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  return (
    <section
      id="projects"
      className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32"
    >
      <SectionHeading
        index="03"
        label="Projects"
        title="Selected Systems"
        subtitle="Production systems spanning AI governance, enterprise content platforms, business intelligence, developer tooling, and product showcases."
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
                      <span className="text-cyan">
                        {p.categories[0].toUpperCase()}
                      </span>
                    </span>
                    <span className="hidden sm:inline">
                      <span className="text-dim">STACK </span>
                      <span className="text-fg">
                        {p.stack.slice(0, 3).join(" / ").toUpperCase()}
                      </span>
                    </span>
                    <span className="ml-auto tracking-[0.2em] text-cyan">
                      [ OPEN SYSTEM ]
                    </span>
                  </div>
                </div>

                <div
                  className={
                    p.hero ? "grid gap-8 lg:grid-cols-[1.2fr_1fr]" : ""
                  }
                >
                  <div>
                    <div className="tech-label text-cyan">
                      {p.index} / {p.dates}
                    </div>
                    <h3 className="mt-3 font-display text-2xl font-bold text-fg md:text-3xl">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-muted md:text-base">
                      {p.subtitle}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-muted">
                      {p.description}
                    </p>

                    <div className="mt-5 inline-flex items-center gap-2 rounded border border-mint/30 bg-mint/5 px-3 py-1.5 font-mono text-xs text-mint">
                      ▸ {p.keyAchievement}
                    </div>

                    <div className="mt-5 flex flex-wrap gap-1.5">
                      {p.stack.map((t) => (
                        <span
                          key={t}
                          className="rounded border border-line bg-panel-2 px-2 py-1 font-mono text-[10px] text-muted"
                        >
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

                  <div
                    className={`${p.hero ? "" : "mt-6"} opacity-80 transition-opacity duration-300 group-hover:opacity-100`}
                  >
                    <Visual />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selected && (
          <ProjectModal project={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
