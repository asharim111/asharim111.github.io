import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowRight, Download, Linkedin, Mail, MapPin, X } from "lucide-react";
import { profile, briefing, careerTimeline } from "../data/profile";
import { education } from "../data/education";
import { system } from "../lib/system";
import { goToSection } from "../lib/navigate";
import { mailtoHref, onEmailOpen, onResumeDownload } from "../lib/contact";
import { useScrollLock } from "../hooks/useScrollLock";
import WhatsAppButton from "./WhatsAppButton";

const current = careerTimeline[careerTimeline.length - 1];

/**
 * Recruiter briefing — the counterweight to Discovery Mode.
 *
 * Discovery Mode is for the visitor who wants more; this is for the one who has
 * fifteen seconds and a shortlist. Role fit, three quantified achievements, the
 * stack, availability, and four ways to make contact — on one screen, with no
 * scrolling on a laptop, and every number traceable to a section below.
 */
export default function RecruiterMode({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useScrollLock(true);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const explore = () => {
    onClose();
    goToSection("projects");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[86] overflow-y-auto bg-ink/90 backdrop-blur-md"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Recruiter briefing"
    >
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28 }}
        onMouseDown={(e) => e.stopPropagation()}
        className="relative mx-auto my-6 w-full max-w-4xl px-4 md:my-10 md:px-8"
      >
        <div className="glass elev-panel rounded-lg p-6 md:p-9">
          {/* Header */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] text-cyan">
                BRIEFING · 15 SECONDS
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-fg md:text-3xl">
                {profile.name}
              </h2>
              <p className="mt-1 text-sm text-muted md:text-base">{profile.title}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px]">
                <span className="flex items-center gap-1.5 text-mint">
                  <span className="h-1.5 w-1.5 rounded-full bg-mint [animation:pulse-soft_2.4s_ease-in-out_infinite]" />
                  {profile.status.toUpperCase()}
                </span>
                <span className="flex items-center gap-1.5 text-muted">
                  <MapPin className="h-3 w-3" /> {profile.location}
                </span>
                <span className="text-muted">{profile.yearsExperience} YEARS</span>
              </div>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close briefing"
              className="shrink-0 rounded border border-line p-2 text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Fit */}
          <div className="mt-7 rounded-lg border border-cyan/25 bg-cyan/5 p-5">
            <div className="tech-label mb-2 text-cyan">Role fit</div>
            <p className="text-sm leading-relaxed text-fg md:text-base">{briefing.fit}</p>
          </div>

          {/* Three quantified achievements */}
          <div className="mt-7">
            <div className="tech-label mb-4">Top outcomes</div>
            <div className="grid gap-4 md:grid-cols-3">
              {briefing.achievements.map((a) => (
                <div key={a.label} className="rounded-lg border border-line bg-panel p-5">
                  <div className="font-display text-3xl font-bold text-fg">
                    {a.metric}
                  </div>
                  <div className="mt-1 font-mono text-[10px] tracking-[0.18em] text-cyan">
                    {a.label.toUpperCase()}
                  </div>
                  <p className="mt-3 text-[13px] leading-relaxed text-muted">{a.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Facts */}
          <div className="mt-7 grid gap-6 md:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="tech-label mb-3">Core stack</div>
              <div className="flex flex-wrap gap-2">
                {briefing.strengths.map((s) => (
                  <span
                    key={s}
                    className="rounded border border-line bg-panel-2 px-2.5 py-1.5 font-mono text-[11px] text-muted"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <dl className="space-y-3 font-mono text-[11px]">
              <div className="flex justify-between gap-4">
                <dt className="tracking-[0.15em] text-dim">CURRENT</dt>
                <dd className="text-right text-fg">
                  {current.role}
                  <span className="block text-muted">{current.org}</span>
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-line pt-3">
                <dt className="tracking-[0.15em] text-dim">EDUCATION</dt>
                <dd className="text-right text-fg">
                  {education[0].degree}
                  <span className="block text-muted">{education[0].field}</span>
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-line pt-3">
                <dt className="tracking-[0.15em] text-dim">LANGUAGES</dt>
                <dd className="text-right text-muted">
                  {profile.languages.map((l) => l.name).join(" · ")}
                </dd>
              </div>
            </dl>
          </div>

          {/* Contact */}
          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-line pt-6">
            <WhatsAppButton
              placement="briefing"
              variant="cta"
              label="WhatsApp"
            />
            <a
              href={mailtoHref("Opportunity for Sharim Ansari")}
              onClick={() => onEmailOpen("briefing")}
              className="inline-flex items-center gap-2 rounded border border-line-bright px-5 py-3 text-sm font-medium text-fg transition-colors hover:border-cyan/50 hover:text-cyan"
            >
              <Mail className="h-4 w-4" /> Email
            </a>
            <a
              href={profile.resumeFile}
              download
              onClick={() => onResumeDownload("briefing")}
              className="inline-flex items-center gap-2 rounded border border-line-bright px-5 py-3 text-sm font-medium text-fg transition-colors hover:border-cyan/50 hover:text-cyan"
            >
              <Download className="h-4 w-4" /> Resume
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded border border-line-bright px-5 py-3 text-sm font-medium text-fg transition-colors hover:border-cyan/50 hover:text-cyan"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn
            </a>

            <button
              type="button"
              onClick={explore}
              className="ml-auto inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-dim transition-colors hover:text-cyan"
            >
              [ EXPLORE THE FULL SYSTEM ] <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <p className="mt-4 text-center font-mono text-[10px] tracking-[0.2em] text-dim">
          ESC TO CLOSE ·{" "}
          <button
            type="button"
            onClick={() => {
              onClose();
              system.setConsoleOpen(true);
            }}
            className="underline-offset-2 transition-colors hover:text-cyan hover:underline"
          >
            OR OPEN THE TERMINAL
          </button>
        </p>
      </motion.div>
    </motion.div>
  );
}
