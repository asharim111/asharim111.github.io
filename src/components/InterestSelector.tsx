import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ListRestart } from "lucide-react";
import Reveal from "./Reveal";
import { system, useSystem } from "../lib/system";
import { JOURNEYS } from "../data/journeys";
import { goToSection } from "../lib/navigate";

/**
 * Personalization strip.
 *
 * Picking an interest no longer only *suggests* a route — it resequences the
 * page beneath this strip and swaps the hero sub-headline, so the first thing
 * the visitor scrolls into is the thing they came for. Stored as a preference,
 * so the order holds on the next visit too.
 */
export default function InterestSelector() {
  const interest = useSystem((s) => s.interest);
  const journey = JOURNEYS.find((j) => j.id === interest);

  return (
    <section aria-label="Choose your journey" className="border-b border-line bg-panel/30">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <Reveal>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <span className="tech-label text-cyan">WHAT BROUGHT YOU HERE?</span>
            <div className="flex flex-wrap gap-2">
              {JOURNEYS.map((j) => (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => system.setInterest(interest === j.id ? null : j.id)}
                  aria-pressed={interest === j.id}
                  className={`rounded border px-3.5 py-1.5 font-mono text-[10px] tracking-[0.15em] transition-colors ${
                    interest === j.id
                      ? "border-cyan/60 bg-cyan/10 text-cyan"
                      : "border-line text-muted hover:border-line-bright hover:text-fg"
                  }`}
                >
                  [ {j.label} ]
                </button>
              ))}
            </div>
            {interest && (
              <button
                type="button"
                onClick={() => system.setInterest(null)}
                className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.15em] text-dim transition-colors hover:text-fg"
              >
                <ListRestart className="h-3 w-3" /> RESET ORDER
              </button>
            )}
          </div>
        </Reveal>

        <AnimatePresence>
          {journey && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap items-center gap-2 pt-5">
                <span className="font-mono text-[10px] tracking-[0.2em] text-dim">
                  SECTIONS RESEQUENCED
                </span>
                {journey.steps.map((s, i) => (
                  <span key={`${s.label}-${i}`} className="flex items-center gap-2">
                    <a
                      href={s.href}
                      onClick={(e) => {
                        e.preventDefault();
                        goToSection(s.href.replace("#", ""));
                      }}
                      className="rounded border border-mint/30 bg-mint/5 px-3 py-1.5 font-mono text-[10px] text-mint transition-colors hover:bg-mint/15"
                    >
                      {s.label}
                    </a>
                    {i < journey.steps.length - 1 && (
                      <ArrowRight className="h-3 w-3 text-dim" aria-hidden="true" />
                    )}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
