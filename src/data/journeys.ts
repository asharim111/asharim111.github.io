import { profile } from "./profile";

/**
 * Visitor journeys.
 *
 * Picking an interest doesn't just *suggest* a route any more — it resequences
 * the page. `order` lists section ids most-relevant-first; App maps that onto
 * CSS `order` so the DOM (and therefore every anchor, the scroll-spy and the
 * lazy boundaries) stays untouched while the reading order changes.
 *
 * Hero, the metrics strip, the selector itself and Contact are pinned; only
 * the body of the portfolio moves.
 */

/** Reorderable sections, in their authored (default) sequence. */
export const REORDERABLE = [
  "about",
  "experience",
  "projects",
  "architecture",
  "ai-security",
  "skills",
  "education",
  "metrics",
] as const;

export type SectionId = (typeof REORDERABLE)[number];

export interface Journey {
  id: string;
  label: string;
  /** Hero sub-headline swapped in for this audience. */
  headline: string;
  /** Every reorderable section, most relevant first. Typed as a tuple of the
   *  known ids so a typo — or a forgotten section, which would silently fall
   *  back to order 0 and jump to the top — fails the build instead of the page. */
  order: SectionId[];
  steps: Array<{ label: string; href: string }>;
}

export const JOURNEYS: Journey[] = [
  {
    id: "ai-security",
    label: "AI & SECURITY",
    headline:
      "I build AI systems enterprises can actually deploy — governed by DLP, identity, policy and audit before a single prompt leaves the building.",
    order: ["ai-security", "projects", "architecture", "experience", "skills", "about", "education", "metrics"],
    steps: [
      { label: "AI Gateway", href: "#projects" },
      { label: "DLP Pipeline", href: "#ai-security" },
      { label: "Architecture", href: "#architecture" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    id: "full-stack",
    label: "FULL STACK",
    headline:
      "Seven years shipping production full stack systems — React and Node through FastAPI, PHP and PostgreSQL, front end to deployment.",
    order: ["projects", "experience", "skills", "architecture", "about", "ai-security", "education", "metrics"],
    steps: [
      { label: "Experience", href: "#experience" },
      { label: "Projects", href: "#projects" },
      { label: "Tech Stack", href: "#skills" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    id: "enterprise",
    label: "ENTERPRISE SYSTEMS",
    headline:
      "Enterprise platforms that hold up in production: procurement and ticketing workflows, multi-company content systems, ERP-backed analytics.",
    order: ["experience", "projects", "architecture", "ai-security", "skills", "about", "education", "metrics"],
    steps: [
      { label: "Automation", href: "#experience" },
      { label: "Logistics", href: "#experience" },
      { label: "AI Gateway", href: "#projects" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    id: "automation",
    label: "AUTOMATION",
    headline:
      "Replacing manual handoffs with reliable automation — 4 procurement stages, 3+ internal workflows, marketplace and carrier integrations.",
    order: ["experience", "architecture", "projects", "skills", "ai-security", "about", "education", "metrics"],
    steps: [
      { label: "Experience", href: "#experience" },
      { label: "Architecture", href: "#architecture" },
      { label: "Skills", href: "#skills" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    id: "exploring",
    label: "JUST EXPLORING",
    headline: profile.subheadline,
    order: ["about", "projects", "experience", "ai-security", "architecture", "skills", "education", "metrics"],
    steps: [
      { label: "About", href: "#about" },
      { label: "Selected Systems", href: "#projects" },
      { label: "Try the AI Gateway", href: "#ai-security" },
    ],
  },
];

export const JOURNEY_LABELS: Record<string, string> = Object.fromEntries(
  JOURNEYS.map((j) => [j.id, j.label]),
);

/** Section id → CSS `order` value for the chosen interest (0 when default). */
export function sectionOrder(interest: string | null): Record<SectionId, number> {
  const journey = JOURNEYS.find((j) => j.id === interest);
  const sequence: readonly SectionId[] = journey?.order ?? REORDERABLE;
  return Object.fromEntries(sequence.map((id, i) => [id, i + 1])) as Record<SectionId, number>;
}

export function heroHeadline(interest: string | null) {
  return JOURNEYS.find((j) => j.id === interest)?.headline ?? profile.subheadline;
}
