import { Brain, ShieldCheck, ScrollText } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import GatewayDemo from "../components/GatewayDemo";

const pillars = [
  {
    icon: Brain,
    title: "AI INTEGRATION",
    accent: "text-violet",
    items: ["OpenAI", "Anthropic", "Groq", "Gemini"],
  },
  {
    icon: ShieldCheck,
    title: "SECURITY",
    accent: "text-cyan",
    items: ["Microsoft Presidio", "Entra ID", "OAuth 2.0", "RBAC", "OWASP Top 10"],
  },
  {
    icon: ScrollText,
    title: "GOVERNANCE",
    accent: "text-mint",
    items: ["DLP", "Policy Controls", "Audit Logging", "Real-time Alerts"],
  },
];

export default function AISecurity() {
  return (
    <section id="ai-security" className="border-t border-line bg-panel/30">
      <div className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
        <SectionHeading
          index="05"
          label="AI Engineering"
          title="AI Without Losing Control"
          subtitle="Building intelligent systems with security, governance, and enterprise control."
        />

        <div className="mb-14 grid gap-4 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="glass h-full rounded-lg p-6 transition-colors duration-300 hover:border-line-bright">
                <p.icon className={`h-6 w-6 ${p.accent}`} />
                <h3 className="mt-4 font-display text-sm font-bold tracking-[0.12em] text-fg">{p.title}</h3>
                <ul className="mt-4 space-y-2">
                  {p.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 font-mono text-xs text-muted">
                      <span aria-hidden="true" className={`h-1 w-1 rounded-full bg-current ${p.accent}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <GatewayDemo />
        </Reveal>
      </div>
    </section>
  );
}
