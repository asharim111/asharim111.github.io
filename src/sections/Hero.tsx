import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, Download, IdCard, Terminal } from "lucide-react";
import { profile } from "../data/profile";
import { heroHeadline } from "../data/journeys";
import ParticleField from "../components/ParticleField";
import Typewriter from "../components/Typewriter";
import Magnetic from "../components/Magnetic";
import EnterSystem from "../components/EnterSystem";
import { system, useSystem } from "../lib/system";
import { onResumeDownload } from "../lib/contact";
import { useGatewayCycle, GATEWAY_STAGES } from "../hooks/useGatewayCycle";

const ORBIT_TECHS = [
  ["React", "Node.js", "Python", "PHP"],
  ["PostgreSQL", "MongoDB", "AWS", "Docker"],
  ["AI", "API", "Security"],
];

/** Tone → classes. Every variant is spelled out: Tailwind scans source text,
 *  so a class assembled at runtime (`border-cyan/70`.replace(…)) would never be
 *  generated and the element would render unstyled. */
const TONES = {
  cyan: {
    text: "text-cyan",
    ring: "border-cyan/70",
    ringIdle: "border-cyan/35",
    chip: "border-cyan/50",
    glow: "shadow-[0_0_90px_rgba(34,211,238,0.30)]",
    dot: "bg-cyan",
  },
  blue: {
    text: "text-blue",
    ring: "border-blue/70",
    ringIdle: "border-blue/35",
    chip: "border-blue/50",
    glow: "shadow-[0_0_90px_rgba(59,130,246,0.28)]",
    dot: "bg-blue",
  },
  violet: {
    text: "text-violet",
    ring: "border-violet/70",
    ringIdle: "border-violet/35",
    chip: "border-violet/50",
    glow: "shadow-[0_0_90px_rgba(167,139,250,0.28)]",
    dot: "bg-violet",
  },
  mint: {
    text: "text-mint",
    ring: "border-mint/70",
    ringIdle: "border-mint/35",
    chip: "border-mint/50",
    glow: "shadow-[0_0_90px_rgba(52,211,153,0.28)]",
    dot: "bg-mint",
  },
} as const;

/**
 * Orbital "AI / Enterprise Architecture Core".
 *
 * The rings no longer just spin: the core steps through the real gateway
 * pipeline — request, identity, DLP scan, classification, policy, routing,
 * audited response — and the orbit ring belonging to the active stage lights
 * with it. The hero demonstrates the system instead of decorating around it.
 * Clicking the core still "expands the system".
 */
function AICore() {
  const reduced = useReducedMotion();
  const ringSizes = [220, 320, 420];
  const [expanded, setExpanded] = useState(false);
  const expandTimer = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const { stage, index, total, frozen } = useGatewayCycle(rootRef);

  const tone = TONES[stage.tone];
  const label = frozen ? "CORE" : stage.core;

  const activate = () => {
    if (expanded) return;
    setExpanded(true);
    system.logOnce("core-expand", "core interaction detected", "accent");
    system.log(`SYSTEM EXPANDED · ${stage.panel.toLowerCase()}`, "ok");
    window.clearTimeout(expandTimer.current);
    expandTimer.current = window.setTimeout(() => setExpanded(false), 1300);
  };

  return (
    <div
      ref={rootRef}
      className={`relative mx-auto aspect-square w-full max-w-[420px] transition-transform duration-500 ease-out lg:max-w-[480px] ${
        expanded && !reduced ? "scale-[1.06]" : ""
      }`}
    >
      {/* Radial glow behind the core */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_65%)] transition-opacity duration-500 ${
          expanded ? "opacity-100" : "opacity-70"
        }`}
      />

      {/* Central data core */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <button
          type="button"
          onClick={activate}
          aria-label={`Expand the system core — pipeline stage ${index + 1} of ${total}: ${stage.panel}`}
          className={`relative flex h-28 w-28 items-center justify-center rounded-full border bg-panel-2 transition-all duration-500 ${
            expanded ? `${tone.ring} ${tone.glow}` : `${tone.ringIdle} shadow-[0_0_60px_rgba(34,211,238,0.14)]`
          }`}
        >
          <div className="absolute inset-2 rounded-full border border-blue/25 [animation:spin-slow_14s_linear_infinite]">
            <span className={`absolute -top-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full transition-colors duration-500 ${tone.dot}`} />
          </div>
          <div className="absolute inset-5 rounded-full border border-violet/25 [animation:spin-slow-reverse_10s_linear_infinite]">
            <span className={`absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full transition-colors duration-500 ${tone.dot}`} />
          </div>
          <span className={`font-mono text-[10px] tracking-[0.2em] transition-colors duration-300 ${tone.text}`}>
            {expanded ? "ACTIVE" : label}
          </span>
        </button>

        {/* Stage readout — the pipeline narrating itself */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-full mt-3 w-56 -translate-x-1/2 text-center font-mono"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={expanded ? "expanded" : stage.id}
              initial={reduced ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.25 }}
              className={`text-[9px] tracking-[0.24em] ${tone.text}`}
            >
              {expanded ? "SYSTEM EXPANDED" : frozen ? "PIPELINE READY" : stage.panel}
            </motion.div>
          </AnimatePresence>
          {!frozen && (
            <div className="mt-2 flex justify-center gap-1">
              {GATEWAY_STAGES.map((s, i) => (
                <span
                  key={s.id}
                  className={`h-0.5 w-4 rounded-full transition-colors duration-300 ${
                    i === index ? tone.dot : i < index ? "bg-line-bright" : "bg-line"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Orbiting technology chips — the ring carrying the active stage lifts */}
      {ringSizes.map((size, ring) => {
        const live = !frozen && stage.ring === ring;
        return (
          <div
            key={size}
            aria-hidden="true"
            className={`absolute left-1/2 top-1/2 rounded-full border transition-colors duration-500 ${
              live ? "border-line-bright" : "border-line"
            }`}
            style={{
              width: size,
              height: size,
              marginLeft: -size / 2,
              marginTop: -size / 2,
              animation: reduced
                ? undefined
                : `${ring % 2 === 0 ? "spin-slow" : "spin-slow-reverse"} ${34 + ring * 16}s linear infinite`,
            }}
          >
            {ORBIT_TECHS[ring].map((tech, i) => {
              const angle = (i / ORBIT_TECHS[ring].length) * 360;
              return (
                <div
                  key={tech}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `rotate(${angle}deg) translateY(${-size / 2}px) rotate(${-angle}deg)`,
                  }}
                >
                  <span
                    className={`block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded border px-2 py-1 font-mono text-[10px] transition-colors duration-500 ${
                      live ? `${tone.chip} bg-panel-2 ${tone.text}` : "border-line bg-panel text-muted"
                    }`}
                    style={{
                      animation: reduced
                        ? undefined
                        : `${ring % 2 === 0 ? "spin-slow-reverse" : "spin-slow"} ${34 + ring * 16}s linear infinite`,
                    }}
                  >
                    {tech}
                  </span>
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Floating status panels — two are live, two are steady state */}
      {[
        { label: "SYSTEM STATUS", value: "ONLINE", tone: "text-mint", pos: "left-0 top-6" },
        { label: "AI GATEWAY", value: frozen ? "READY" : stage.core, tone: tone.text, pos: "right-0 top-16" },
        { label: "PIPELINE", value: frozen ? `${total} STAGES` : `${index + 1} / ${total}`, tone: "text-blue", pos: "left-2 bottom-20" },
        { label: "AUTOMATION", value: "RUNNING", tone: "text-violet", pos: "right-4 bottom-8" },
      ].map((p, i) => (
        <motion.div
          key={p.label}
          aria-hidden="true"
          className={`glass absolute ${p.pos} hidden rounded px-3 py-2 sm:block`}
          animate={reduced ? undefined : { y: [0, -7, 0] }}
          transition={{ duration: 4.5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
        >
          <div className="font-mono text-[9px] tracking-[0.18em] text-dim">{p.label}</div>
          <div className={`mt-0.5 flex items-center gap-1.5 font-mono text-xs font-semibold ${p.tone}`}>
            <span className="h-1 w-1 rounded-full bg-current [animation:pulse-soft_2s_ease-in-out_infinite]" />
            {p.value}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Hero() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [entering, setEntering] = useState(false);
  const interest = useSystem((s) => s.interest);

  // Mouse-follow parallax + tilt on the core — the architecture leans with the cursor
  const coreRef = useRef<HTMLDivElement>(null);
  const onMouseMove = (e: React.MouseEvent) => {
    if (reduced || !coreRef.current || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width - 0.5;
    const dy = (e.clientY - rect.top) / rect.height - 0.5;
    coreRef.current.style.transform = `translate(${dx * 14}px, ${dy * 14}px) rotate(${dx * 3}deg)`;
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="grid-bg relative flex min-h-[92svh] items-center overflow-hidden pt-24 pb-12"
    >
      <ParticleField className="absolute inset-0 h-full w-full" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_55%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-4 md:px-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="tech-label mb-5 text-cyan"
          >
            <Typewriter text={profile.title.toUpperCase()} startDelay={300} />
          </motion.p>

          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl font-bold leading-[1.08] tracking-tight text-fg sm:text-5xl lg:text-6xl"
          >
            Engineering the Future of{" "}
            <span className="bg-gradient-to-r from-cyan via-blue to-violet bg-clip-text text-transparent">
              Enterprise Software.
            </span>
          </motion.h1>

          {/* Sub-headline follows the chosen journey — same person, framed for
              the reader who just told us what they came for. */}
          <div className="mt-6 min-h-[3.5rem] max-w-xl">
            <AnimatePresence mode="wait">
              <motion.p
                key={interest ?? "default"}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="text-base leading-relaxed text-muted md:text-lg"
              >
                {heroHeadline(interest)}
              </motion.p>
            </AnimatePresence>
          </div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-5 font-mono text-xs tracking-[0.22em] text-dim"
          >
            {profile.yearsExperience} YEARS EXPERIENCE · {profile.location.toUpperCase()}
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded bg-gradient-to-r from-cyan to-blue px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
              >
                View My Work <ArrowRight className="h-4 w-4" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded border border-line-bright px-6 py-3 text-sm font-medium text-fg transition-colors hover:border-cyan/50 hover:text-cyan"
              >
                Let's Connect <ArrowRight className="h-4 w-4" />
              </a>
            </Magnetic>
            <a
              href={profile.resumeFile}
              download
              onClick={() => onResumeDownload("hero")}
              className="inline-flex items-center gap-2 px-2 py-3 text-sm text-muted transition-colors hover:text-fg"
            >
              <Download className="h-4 w-4" /> Download Resume
            </a>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3"
          >
            <button
              type="button"
              onClick={() => setEntering(true)}
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-dim transition-colors hover:text-cyan"
            >
              <Terminal className="h-3.5 w-3.5" /> [ ENTER SYSTEM → ]
            </button>
            {/* The opposite of Discovery Mode: for the visitor with 15 seconds. */}
            <button
              type="button"
              onClick={() => system.setRecruiterOpen(true)}
              className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] text-dim transition-colors hover:text-mint"
            >
              <IdCard className="h-3.5 w-3.5" /> [ 15-SECOND BRIEFING ]
            </button>
          </motion.div>

          {/* Floating engineer snapshot — code-style panel */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="glass mt-10 hidden max-w-sm rounded-lg p-4 font-mono text-[11px] leading-relaxed md:block"
            aria-hidden="true"
          >
            <div className="mb-2 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-danger/50" />
              <span className="h-2 w-2 rounded-full bg-warn/50" />
              <span className="h-2 w-2 rounded-full bg-mint/50" />
              <span className="ml-2 text-[9px] text-dim">engineer.ts</span>
            </div>
            <div className="text-muted">
              <span className="text-violet">const</span> <span className="text-cyan">engineer</span> = {"{"}
              <br />
              &nbsp;&nbsp;experience: <span className="text-mint">"7+ years"</span>,
              <br />
              &nbsp;&nbsp;focus: [<span className="text-mint">"AI"</span>, <span className="text-mint">"Enterprise"</span>,{" "}
              <span className="text-mint">"Automation"</span>, <span className="text-mint">"Security"</span>],
              <br />
              &nbsp;&nbsp;status: <span className="text-mint">"online"</span>
              <br />
              {"}"};
            </div>
          </motion.div>
        </div>

        <motion.div
          ref={coreRef}
          initial={reduced ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="transition-transform duration-300 ease-out will-change-transform"
        >
          <AICore />
        </motion.div>
      </div>

      <AnimatePresence>
        {entering && <EnterSystem onDone={() => setEntering(false)} />}
      </AnimatePresence>
    </section>
  );
}
