import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { systemMetrics } from "../data/profile";
import { useCountUp } from "../hooks/useCountUp";

function MetricCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, value: n } = useCountUp(value);
  return (
    <div ref={ref} className="glass rounded-lg p-6">
      <div className="font-display text-4xl font-bold text-fg">
        {n.toLocaleString()}
        <span className="text-cyan">{suffix}</span>
      </div>
      <div className="mt-3 h-px w-10 bg-cyan/50" aria-hidden="true" />
      <div className="tech-label mt-3">{label}</div>
    </div>
  );
}

export default function SystemMetrics() {
  return (
    <section className="border-t border-line bg-panel/30">
      <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
        <SectionHeading
          index="08"
          label="Metrics"
          title="System Metrics"
          subtitle="Measured outcomes from production systems."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {systemMetrics.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.05}>
              <MetricCard {...m} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
