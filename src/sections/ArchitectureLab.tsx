import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { architectures } from "../data/architectures";
import { system } from "../lib/system";

const kindStyles: Record<string, string> = {
  user: "border-fg/30 text-fg",
  app: "border-cyan/40 text-cyan",
  service: "border-blue/40 text-blue",
  data: "border-mint/40 text-mint",
  infra: "border-amber-400/40 text-amber-400",
  security: "border-violet/40 text-violet",
  ai: "border-pink-400/40 text-pink-400",
};

/** Animated dots travelling down the diagram spine while a layout is displayed. */
function DataFlow({ height }: { height: number }) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-full w-px">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan shadow-[0_0_8px_rgba(34,211,238,0.8)]"
          animate={{ top: [0, height], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: i * 1.15, ease: "linear" }}
        />
      ))}
    </div>
  );
}

export default function ArchitectureLab() {
  const [active, setActive] = useState(architectures[3].id); // DLP pipeline first — the differentiator
  const arch = architectures.find((a) => a.id === active)!;

  return (
    <section id="architecture" className="border-t border-line bg-panel/30">
      <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
        <SectionHeading
          index="04"
          label="Architecture"
          title="Architecture Lab"
          subtitle="Interactive reference architectures for the classes of systems I design and build. Switch layouts to compare approaches."
        />

        <Reveal className="mb-10 -mx-4 overflow-x-auto px-4">
          <div className="flex w-max gap-2 pb-1">
            {architectures.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  setActive(a.id);
                  system.log(`architecture: rendering ${a.name.toLowerCase()} layout`, "accent");
                }}
                aria-pressed={active === a.id}
                className={`whitespace-nowrap rounded border px-4 py-2 font-mono text-xs tracking-wider transition-colors ${
                  active === a.id
                    ? "border-cyan/60 bg-cyan/10 text-cyan"
                    : "border-line text-muted hover:border-line-bright hover:text-fg"
                }`}
              >
                {a.name.toUpperCase()}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="glass relative overflow-hidden rounded-lg p-6 md:p-10" data-cursor="inspect">
            <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
            <AnimatePresence mode="wait">
              <motion.div
                key={arch.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3 }}
                className="relative mx-auto max-w-md"
              >
                <div className="relative">
                  <DataFlow height={arch.nodes.length * 74} />
                  <div className="relative flex flex-col items-center">
                    {arch.nodes.map((node, i) => (
                      <div key={`${node.label}-${i}`} className="flex w-full flex-col items-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.94 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.06 }}
                          className={`w-full rounded-md border bg-ink/80 px-4 py-2.5 text-center backdrop-blur-sm ${kindStyles[node.kind]}`}
                        >
                          <div className="font-mono text-xs md:text-sm">{node.label}</div>
                          {node.sub && <div className="mt-0.5 font-mono text-[10px] text-muted">{node.sub}</div>}
                        </motion.div>
                        {i < arch.nodes.length - 1 && (
                          <span aria-hidden="true" className="h-4 w-px bg-line-bright" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Legend */}
            <div className="relative mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2">
              {Object.entries({
                user: "User / Input",
                app: "Frontend",
                service: "Services",
                security: "Security",
                ai: "AI",
                data: "Data",
                infra: "Infrastructure",
              }).map(([kind, label]) => (
                <span key={kind} className="flex items-center gap-1.5 font-mono text-[10px] text-muted">
                  <span
                    aria-hidden="true"
                    className={`h-2 w-2 rounded-sm border ${kindStyles[kind].split(" ")[0]}`}
                  />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
