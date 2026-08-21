import { heroMetrics } from "../data/profile";
import { useCountUp } from "../hooks/useCountUp";

function Metric({ value, suffix, label, prefix }: { value: number; suffix: string; label: string; prefix?: string }) {
  const { ref, value: n } = useCountUp(value);
  return (
    <div ref={ref} className="px-4 py-6 text-center">
      <div className="font-display text-3xl font-bold text-fg md:text-4xl">
        {prefix && <span className="text-lg font-medium text-muted">{prefix}</span>}
        {n.toLocaleString()}
        <span className="text-cyan">{suffix}</span>
      </div>
      <div className="tech-label mt-2">{label}</div>
    </div>
  );
}

export default function MetricsStrip() {
  return (
    <section aria-label="Key metrics" className="border-y border-line bg-panel/50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-line px-4 sm:grid-cols-3 md:px-8 lg:grid-cols-5">
        {heroMetrics.map((m) => (
          <Metric key={m.label} {...m} />
        ))}
      </div>
    </section>
  );
}
