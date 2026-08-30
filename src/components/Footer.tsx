import { CheckCircle2, GitCommitHorizontal, Github, Linkedin, Mail } from "lucide-react";
import { profile } from "../data/profile";
import { build, buildCommitUrl, buildRunUrl, relativeBuildAge } from "../lib/telemetry";
import { goToSection } from "../lib/navigate";
import { onEmailOpen } from "../lib/contact";
import WhatsAppButton from "./WhatsAppButton";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

/**
 * Build provenance.
 *
 * The commit, its age and — when the build came out of CI — a link to the run
 * that deployed it. Stamped at compile time from GITHUB_SHA / GITHUB_RUN_ID,
 * falling back to local git. "CI PASSED" is only claimed when a run id exists,
 * because a local build has no run to point at.
 */
function BuildStamp() {
  const local = build.sha === "local" || !build.sha;
  const age = relativeBuildAge();

  if (local) {
    return (
      <span className="flex items-center gap-2 font-mono text-[11px] text-dim">
        <GitCommitHorizontal className="h-3.5 w-3.5" />
        BUILD LOCAL · {build.branch}
      </span>
    );
  }

  return (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-dim">
      <GitCommitHorizontal className="h-3.5 w-3.5 shrink-0" />
      <a
        href={buildCommitUrl()}
        target="_blank"
        rel="noreferrer noopener"
        className="transition-colors hover:text-cyan"
      >
        BUILD {build.sha}
      </a>
      {age && <span aria-hidden="true">·</span>}
      {age && <span>DEPLOYED {age.toUpperCase()}</span>}
      {build.runId && (
        <>
          <span aria-hidden="true">·</span>
          <a
            href={buildRunUrl()}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1 text-mint transition-colors hover:underline"
          >
            <CheckCircle2 className="h-3 w-3" /> CI PASSED
          </a>
        </>
      )}
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-line bg-panel/50">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded border border-cyan/40 font-display text-sm font-bold text-cyan">
                {profile.logoShort}
              </span>
              <span className="font-display text-lg font-bold text-fg">SHARIM ANSARI</span>
            </div>
            <p className="mt-3 text-sm text-muted">{profile.title}</p>
            <p className="mt-1 font-mono text-xs text-dim">
              MERN · PHP · Python · AI · Enterprise Automation
            </p>
          </div>

          <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-12 gap-y-2">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  goToSection(l.href.slice(1));
                }}
                className="text-sm text-muted transition-colors hover:text-fg"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex gap-3">
            <WhatsAppButton placement="footer" variant="icon" />
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn profile"
              className="rounded border border-line p-2.5 text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub profile"
              className="rounded border border-line p-2.5 text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              onClick={() => onEmailOpen("footer")}
              aria-label="Send email"
              className="rounded border border-line p-2.5 text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <span className="font-mono text-xs text-dim">
            © {new Date().getFullYear()} Sharim Ansari
          </span>
          <BuildStamp />
        </div>
      </div>
    </footer>
  );
}
