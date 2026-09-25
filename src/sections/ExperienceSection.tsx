import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, ChevronDown } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import FlowDiagram from "../components/FlowDiagram";
import { experience } from "../data/experience";
import { careerTimeline } from "../data/profile";

const gatewaySteps = [
  { label: "Employee" },
  { label: "Entra ID SSO" },
  { label: "AI Gateway", sub: "FastAPI · React · PostgreSQL · Redis" },
  { label: "Two-Layer DLP", sub: "Presidio + LLM Classifier" },
  { label: "Policy Engine + Audit Log" },
  { label: "OpenAI / Anthropic / Groq" },
];

const logisticsSteps = [
  { label: "Shipment" },
  { label: "Carrier API", sub: "APG · CTTExpress · PosteItaliane" },
  { label: "Tracking Service" },
  { label: "3,500+ Carriers" },
  { label: "Live Tracking", sub: "dmstrack.com" },
];

export default function ExperienceSection() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="experience" className="border-t border-line bg-panel/30">
      <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
        <SectionHeading index="02" label="Experience" title="Engineering Experience" />

        <div className="relative">
          {/* Timeline spine */}
          <div
            aria-hidden="true"
            className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-cyan/60 via-line-bright to-transparent md:left-[11px]"
          />

          <div className="space-y-6">
            {experience.map((exp, i) => {
              const open = openIdx === i;
              return (
                <Reveal key={exp.company} delay={i * 0.05} className="relative pl-8 md:pl-12">
                  {/* Timeline node */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-7 h-[15px] w-[15px] rounded-full border-2 md:h-[23px] md:w-[23px] md:border-4 ${
                      i === 0 ? "border-cyan bg-cyan/20" : "border-line-bright bg-panel"
                    }`}
                  />

                  <div
                    className={`rounded-lg border transition-colors duration-300 ${
                      open ? "border-cyan/30 bg-panel" : "border-line bg-panel/60 hover:border-line-bright"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIdx(open ? -1 : i)}
                      aria-expanded={open}
                      className="flex w-full items-start justify-between gap-4 p-5 text-left md:p-6"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <h3 className="font-display text-lg font-bold text-fg md:text-xl">
                            {exp.company}
                          </h3>
                          {i === 0 && (
                            <span className="rounded border border-mint/40 bg-mint/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-mint">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-sm font-medium text-cyan">{exp.role}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-muted">
                          <span>{exp.period}</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {exp.location}
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`mt-1 h-5 w-5 shrink-0 text-muted transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="grid gap-8 px-5 pb-6 md:px-6 lg:grid-cols-[1.5fr_1fr]">
                            <div>
                              <ul className="space-y-3">
                                {exp.highlights.map((h) => (
                                  <li key={h} className="flex gap-3 text-sm leading-relaxed text-muted">
                                    <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan" />
                                    {h}
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-6 flex flex-wrap gap-2">
                                {exp.stack.map((t, ti) => (
                                  <motion.span
                                    key={t}
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.15 + ti * 0.05 }}
                                    className="rounded border border-line bg-panel-2 px-2.5 py-1 font-mono text-[11px] text-muted"
                                  >
                                    {t}
                                  </motion.span>
                                ))}
                              </div>
                            </div>

                            {exp.visual && (
                              <div className="rounded-lg border border-line bg-ink/60 p-4">
                                <div className="tech-label mb-3">
                                  {exp.visual === "gateway" ? "AI Gateway Architecture" : "Logistics Network"}
                                </div>
                                <FlowDiagram
                                  compact
                                  steps={exp.visual === "gateway" ? gatewaySteps : logisticsSteps}
                                />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Horizontal career timeline */}
        <Reveal className="mt-20">
          <div className="tech-label mb-6">Career Trajectory</div>
          <div className="relative overflow-x-auto pb-2">
            <div className="flex min-w-[640px] items-stretch">
              {careerTimeline.map((t, i) => (
                <div key={t.year} className="relative flex-1">
                  <div className="flex items-center">
                    <span
                      className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                        i === careerTimeline.length - 1 ? "bg-cyan" : "bg-line-bright"
                      }`}
                    />
                    {i < careerTimeline.length - 1 && (
                      <span className="h-px flex-1 bg-gradient-to-r from-line-bright to-line" aria-hidden="true" />
                    )}
                  </div>
                  <div className="mt-3 pr-6">
                    <div className="font-mono text-xs text-cyan">{t.year}</div>
                    <div className="mt-0.5 font-mono text-[9px] tracking-[0.25em] text-violet">
                      {t.phase}
                    </div>
                    <div className="mt-1 text-sm font-medium text-fg">{t.role}</div>
                    <div className="text-xs text-muted">{t.org}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
