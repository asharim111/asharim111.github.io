import { Github, Linkedin, Mail } from "lucide-react";
import { profile } from "../data/profile";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

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
              <span className="font-display text-lg font-bold text-fg">
                SHARIM ANSARI
              </span>
            </div>
            <p className="mt-3 text-sm text-muted">{profile.title}</p>
            <p className="mt-1 font-mono text-xs text-dim">
              MERN · PHP · Python · AI · Enterprise Automation
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="grid grid-cols-2 gap-x-12 gap-y-2"
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-muted transition-colors hover:text-fg"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex gap-3">
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
              aria-label="Send email"
              className="rounded border border-line p-2.5 text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <span className="font-mono text-xs text-dim">
            © 2026 Sharim Ansari
          </span>
          {/* <span className="font-mono text-xs text-dim">Built with React + TypeScript</span> */}
        </div>
      </div>
    </footer>
  );
}
