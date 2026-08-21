import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface FlowDiagramProps {
  steps: Array<{ label: string; sub?: string; accent?: string }>;
  /** Index currently "active" during a running simulation; -1 = idle (all shown) */
  activeIndex?: number;
  compact?: boolean;
}

/** Vertical animated node flow used for architecture and pipeline visuals. */
export default function FlowDiagram({ steps, activeIndex = -1, compact = false }: FlowDiagramProps) {
  const reduced = useReducedMotion();
  const running = activeIndex >= 0;

  return (
    <div className="flex flex-col items-stretch">
      {steps.map((step, i) => {
        const isActive = running && i === activeIndex;
        const isDone = running && i < activeIndex;
        return (
          <div key={`${step.label}-${i}`} className="flex flex-col items-center">
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: reduced ? 0 : i * 0.07 }}
              className={`w-full rounded-md border px-4 text-center transition-colors duration-300 ${
                compact ? "py-2" : "py-3"
              } ${
                isActive
                  ? "border-cyan/70 bg-cyan/10"
                  : isDone
                    ? "border-mint/40 bg-mint/5"
                    : "border-line bg-panel"
              }`}
            >
              <div
                className={`font-mono ${compact ? "text-[11px]" : "text-xs md:text-sm"} tracking-wide ${
                  isActive ? "text-cyan" : isDone ? "text-mint" : "text-fg"
                }`}
              >
                {step.label}
              </div>
              {step.sub && (
                <div className="mt-0.5 font-mono text-[10px] text-muted">{step.sub}</div>
              )}
            </motion.div>
            {i < steps.length - 1 && (
              <ArrowDown
                aria-hidden="true"
                className={`my-1 h-3.5 w-3.5 shrink-0 ${
                  running && i < activeIndex ? "text-mint" : "text-dim"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
