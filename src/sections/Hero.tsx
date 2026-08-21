import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { profile } from "../data/profile";
import ParticleField from "../components/ParticleField";

const ORBIT_TECHS = [
  ["React", "Node.js", "Python", "PHP"],
  ["PostgreSQL", "MongoDB", "AWS", "Docker"],
  ["AI", "API", "Security"],
];

const STATUS_PANELS = [
  { label: "SYSTEM STATUS", value: "ONLINE", tone: "text-mint", pos: "left-0 top-6" },
  { label: "AI GATEWAY", value: "ACTIVE", tone: "text-cyan", pos: "right-0 top-16" },
  { label: "API SERVICES", value: "12+", tone: "text-blue", pos: "left-2 bottom-20" },
  { label: "AUTOMATION", value: "RUNNING", tone: "text-violet", pos: "right-4 bottom-8" },
];

/** Orbital "AI / Enterprise Architecture Core" — CSS/SVG, no WebGL needed. */
function AICore() {
  const reduced = useReducedMotion();
  const ringSizes = [220, 320, 420];

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px] lg:max-w-[480px]" aria-hidden="true">
      {/* Radial glow behind the core */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18),transparent_65%)]" />

      {/* Central data core */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-cyan/30 bg-panel-2 shadow-[0_0_60px_rgba(34,211,238,0.15)]">
          <div className="absolute inset-2 rounded-full border border-blue/25 [animation:spin-slow_14s_linear_infinite]">
            <span className="absolute -top-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan" />
          </div>
          <div className="absolute inset-5 rounded-full border border-violet/25 [animation:spin-slow-reverse_10s_linear_infinite]">
            <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-violet" />
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] text-cyan">CORE</span>
        </div>
      </div>

      {/* Orbiting technology chips */}
      {ringSizes.map((size, ring) => (
        <div
          key={size}
          className="absolute left-1/2 top-1/2 rounded-full border border-line"
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
                  className="block -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded border border-line bg-panel px-2 py-1 font-mono text-[10px] text-muted"
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
      ))}

      {/* Floating status panels */}
      {STATUS_PANELS.map((p, i) => (
        <motion.div
          key={p.label}
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

  // Subtle mouse-follow parallax on the core
  const coreRef = useRef<HTMLDivElement>(null);
  const onMouseMove = (e: React.MouseEvent) => {
    if (reduced || !coreRef.current || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width - 0.5;
    const dy = (e.clientY - rect.top) / rect.height - 0.5;
    coreRef.current.style.transform = `translate(${dx * 14}px, ${dy * 14}px)`;
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
            {profile.title}
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

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted md:text-lg"
          >
            {profile.subheadline}
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-5 font-mono text-xs tracking-[0.22em] text-dim"
          >
            7+ YEARS EXPERIENCE · {profile.location.toUpperCase()}
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded bg-gradient-to-r from-cyan to-blue px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              View My Work <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded border border-line-bright px-6 py-3 text-sm font-medium text-fg transition-colors hover:border-cyan/50 hover:text-cyan"
            >
              Let's Connect <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={profile.resumeFile}
              download
              className="inline-flex items-center gap-2 px-2 py-3 text-sm text-muted transition-colors hover:text-fg"
            >
              <Download className="h-4 w-4" /> Download Resume
            </a>
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
    </section>
  );
}
