import { GraduationCap, Award, BookOpenCheck } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import Reveal from "../components/Reveal";
import { education, certifications, publication } from "../data/education";

export default function Education() {
  return (
    <section id="education" className="mx-auto max-w-7xl px-4 py-24 md:px-8 md:py-32">
      <SectionHeading index="07" label="Education" title="Education & Research" />

      {/* Academic timeline */}
      <div className="relative mb-20">
        <div
          aria-hidden="true"
          className="absolute left-[7px] top-2 bottom-2 hidden w-px bg-gradient-to-b from-violet/60 via-line-bright to-transparent md:block"
        />
        <div className="space-y-5">
          {education.map((e, i) => (
            <Reveal key={e.school} delay={i * 0.07} className="relative md:pl-10">
              <span
                aria-hidden="true"
                className="absolute left-0 top-7 hidden h-[15px] w-[15px] rounded-full border-2 border-violet/60 bg-panel md:block"
              />
              <div className="glass flex flex-wrap items-start justify-between gap-4 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <GraduationCap className="mt-1 h-5 w-5 shrink-0 text-violet" />
                  <div>
                    <h3 className="font-display text-lg font-bold text-fg">
                      {e.degree} <span className="text-muted">·</span>{" "}
                      <span className="text-cyan">{e.field}</span>
                    </h3>
                    <p className="mt-1 text-sm text-muted">{e.school}</p>
                  </div>
                </div>
                <div className="text-right font-mono text-xs">
                  <div className="text-fg">{e.period}</div>
                  <div className="mt-1 text-mint">{e.score}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <Reveal className="mb-8 flex items-center gap-4">
        <h3 className="font-display text-xl font-bold tracking-tight text-fg md:text-2xl">
          CERTIFICATIONS & CONTINUOUS LEARNING
        </h3>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
      </Reveal>
      <div className="mb-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.05}>
            <div className="glass flex h-full items-start gap-3 rounded-lg p-5 transition-colors hover:border-line-bright">
              <Award className="mt-0.5 h-5 w-5 shrink-0 text-warn/80" />
              <div>
                <div className="text-sm font-medium leading-snug text-fg">{c.name}</div>
                <div className="mt-1.5 font-mono text-[11px] text-muted">{c.issuer}</div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Publication */}
      <div id="publications">
        <Reveal className="mb-8 flex items-center gap-4">
          <h3 className="font-display text-xl font-bold tracking-tight text-fg md:text-2xl">
            RESEARCH & PUBLICATION
          </h3>
          <span className="h-px flex-1 bg-line" aria-hidden="true" />
        </Reveal>
        <Reveal>
          <article className="glass relative overflow-hidden rounded-lg p-6 md:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.12),transparent_70%)]"
            />
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3">
                  <BookOpenCheck className="h-5 w-5 text-violet" />
                  <span className="font-display text-xl font-bold text-fg">{publication.conference}</span>
                  <span className="rounded border border-violet/40 bg-violet/10 px-2 py-0.5 font-mono text-[10px] tracking-wider text-violet">
                    {publication.publisher.toUpperCase()}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
                  {publication.description}
                </p>
                <p className="mt-3 font-mono text-xs text-mint">{publication.proceedings}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {publication.tags.map((t) => (
                  <span key={t} className="rounded border border-line bg-panel-2 px-3 py-1.5 font-mono text-[10px] tracking-wider text-muted">
                    {t.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
