import { useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide-react";

/**
 * Back-to-top control. Presentational only — positioning, reveal and spacing
 * belong to `CommsDock`, which owns the whole bottom-right stack so nothing in
 * it can overlap anything else in it.
 */
export default function BackToTop() {
  const reduced = useReducedMotion();

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
      aria-label="Back to top"
      title="Back to top"
      className="glass elev group flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:border-cyan/50"
    >
      <ArrowUp className="h-4 w-4 text-muted transition-all duration-200 group-hover:-translate-y-0.5 group-hover:text-cyan" />
    </button>
  );
}
