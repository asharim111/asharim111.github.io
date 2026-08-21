import { useSystem } from "../lib/system";

const SECTIONS = [
  { id: "home", label: "HOME" },
  { id: "about", label: "ABOUT" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "projects", label: "SYSTEMS" },
  { id: "architecture", label: "ARCHITECTURE" },
  { id: "ai-security", label: "AI" },
  { id: "skills", label: "STACK" },
  { id: "education", label: "EDUCATION" },
  { id: "contact", label: "CONTACT" },
];

/** Vertical section indicator — desktop only, tracks the active section. */
export default function SectionRail() {
  const active = useSystem((s) => s.activeSection);

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ul className="space-y-3">
        {SECTIONS.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center justify-end gap-2"
              >
                <span
                  className={`font-mono text-[9px] tracking-[0.2em] transition-all duration-200 ${
                    isActive
                      ? "text-cyan opacity-100"
                      : "translate-x-1 text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                >
                  {s.label}
                </span>
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? "h-2 w-2 bg-cyan shadow-[0_0_8px_rgba(34,211,238,0.7)]"
                      : "h-1.5 w-1.5 border border-line-bright bg-transparent group-hover:border-cyan/50"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
