import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { profile, philosophy } from "../data/profile";
import { DraftingCompass, Workflow, ShieldCheck, Gauge } from "lucide-react";

const icons = { DraftingCompass, Workflow, ShieldCheck, Gauge } as const;

function ProfileCard() {
  const rows = [
    { label: "ROLE", value: profile.title },
    { label: "EXPERIENCE", value: "7+ Years" },
    { label: "FOCUS", value: "Enterprise Software · AI Integration · Automation · Security" },
    { label: "LOCATION", value: profile.location },
  ];
  return (
    <div className="glass relative overflow-hidden rounded-lg p-6 md:p-8">
      {/* Animated scan line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent"
      />
      <div className="tech-label mb-1">Profile</div>
      <div className="mb-6 h-px w-full bg-line" />
      <dl className="space-y-5">
        {rows.map((r) => (
          <div key={r.label}>
            <dt className="font-mono text-[10px] tracking-[0.2em] text-dim">{r.label}</dt>
            <dd className="mt-1 text-sm font-medium text-fg md:text-base">{r.value}</dd>
          </div>
        ))}
        <div>
          <dt className="font-mono text-[10px] tracking-[0.2em] text-dim">STATUS</dt>
          <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-mint md:text-base">
            <span className="h-1.5 w-1.5 rounded-full bg-mint [animation:pulse-soft_2.4s_ease-in-out_infinite]" />
            {profile.status}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
      <SectionHeading index="01" label="About" title="Engineer Behind the System" />

      <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <p className="text-lg leading-relaxed text-muted">{profile.intro}</p>
          <p className="mt-6 text-base leading-relaxed text-muted">
            Strong background in REST API integrations, marketplace and carrier integrations, Zoho
            Creator/Catalyst, Microsoft PowerApps, AWS services, and Agile/Scrum delivery — with a
            Master's degree in Information Security informing how every system is built.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {profile.aboutExpertise.map((s) => (
              <span
                key={s}
                className="rounded border border-line bg-panel px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
              >
                {s}
              </span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <ProfileCard />
        </Reveal>
      </div>

      {/* Engineering philosophy */}
      <div className="mt-24">
        <Reveal>
          <div className="mb-10 flex items-center gap-4">
            <h3 className="font-display text-xl font-bold tracking-tight text-fg md:text-2xl">
              HOW I BUILD
            </h3>
            <span className="h-px flex-1 bg-line" aria-hidden="true" />
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {philosophy.map((p, i) => {
            const Icon = icons[p.icon as keyof typeof icons];
            return (
              <Reveal key={p.id} delay={i * 0.08}>
                <div className="group h-full rounded-lg border border-line bg-panel p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan/40">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-cyan transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-mono text-xs text-dim">{p.id}</span>
                  </div>
                  <h4 className="mt-5 font-display text-sm font-bold tracking-[0.12em] text-fg">
                    {p.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{p.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
