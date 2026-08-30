import { useMemo } from "react";
import { useSystem } from "../lib/system";
import { sectionOrder } from "../data/journeys";
import { goToSection } from "../lib/navigate";

const SECTIONS: Record<string, string> = {
  home: "HOME",
  about: "ABOUT",
  experience: "EXPERIENCE",
  projects: "SYSTEMS",
  architecture: "ARCHITECTURE",
  "ai-security": "AI",
  skills: "STACK",
  education: "EDUCATION",
  contact: "CONTACT",
};

/** Vertical section indicator — desktop only, tracks the active section.
 *  Follows the same resequencing as the page: a positional indicator that
 *  disagreed with the order you're actually scrolling through would be worse
 *  than none. */
export default function SectionRail() {
  const active = useSystem((s) => s.activeSection);
  const interest = useSystem((s) => s.interest);

  const ordered = useMemo(() => {
    const order: Record<string, number> = sectionOrder(interest);
    // Home and Contact are pinned at either end, matching the page itself.
    const rank = (id: string) => (id === "home" ? -1 : id === "contact" ? 99 : order[id] ?? 50);
    return Object.keys(SECTIONS).sort((a, b) => rank(a) - rank(b));
  }, [interest]);

  return (
    <nav
      aria-label="Section navigation"
      data-print="hide"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ul className="space-y-3">
        {ordered.map((id) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  goToSection(id);
                }}
                aria-current={isActive ? "true" : undefined}
                className="group flex items-center justify-end gap-2"
              >
                <span
                  className={`font-mono text-[9px] tracking-[0.2em] transition-all duration-200 ${
                    isActive
                      ? "text-cyan opacity-100"
                      : "translate-x-1 text-muted opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
                  }`}
                >
                  {SECTIONS[id]}
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
