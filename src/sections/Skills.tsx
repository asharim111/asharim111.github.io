import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { skillGroups } from "../data/skills";

export default function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
      <SectionHeading
        index="06"
        label="Skills"
        title="Technology Stack"
        subtitle="An ecosystem built over 7 years — hover any technology for how it's been used."
      />

      {/* Central identity node */}
      <Reveal className="mb-10 flex justify-center">
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-0 -m-4 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.12),transparent_70%)]"
          />
          <div className="relative rounded-full border border-cyan/40 bg-panel px-8 py-3 font-display text-sm font-bold tracking-[0.25em] text-cyan">
            SHARIM
          </div>
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, gi) => (
          <Reveal key={group.id} delay={gi * 0.06}>
            <div className="group/panel relative h-full overflow-hidden rounded-lg border border-line bg-panel p-6 transition-colors duration-300 hover:border-line-bright">
              {/* Connection line up toward the center node */}
              <span
                aria-hidden="true"
                className="absolute -top-px left-1/2 h-px w-16 -translate-x-1/2 bg-gradient-to-r from-transparent to-transparent transition-all duration-500"
                style={{ backgroundImage: `linear-gradient(90deg, transparent, ${group.accent}66, transparent)` }}
              />
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: group.accent }} />
                <h3 className="font-display text-sm font-bold tracking-[0.14em] text-fg">
                  {group.name.toUpperCase()}
                </h3>
                <span className="ml-auto font-mono text-[10px] text-dim">{group.skills.length}</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.skills.map((s) => (
                  <span key={s.name} className="group/chip relative">
                    <span
                      tabIndex={0}
                      className="inline-block cursor-default rounded border border-line bg-panel-2 px-2.5 py-1.5 font-mono text-[11px] text-muted transition-all duration-200 hover:-translate-y-0.5 hover:text-fg focus-visible:text-fg"
                      style={{ ["--accent" as string]: group.accent }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${group.accent}80`)}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "")}
                    >
                      {s.name}
                    </span>
                    {/* Tooltip */}
                    <span
                      role="tooltip"
                      className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-52 -translate-x-1/2 rounded border border-line-bright bg-ink px-3 py-2 opacity-0 shadow-xl shadow-black/40 transition-opacity duration-200 group-hover/chip:opacity-100 group-focus-within/chip:opacity-100"
                    >
                      <span className="block font-mono text-[10px] font-semibold text-fg">{s.name}</span>
                      <span className="block font-mono text-[9px] tracking-wider" style={{ color: group.accent }}>
                        {group.name.toUpperCase()}
                      </span>
                      <span className="mt-1 block text-[11px] leading-snug text-muted">{s.context}</span>
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
