import { profile, careerTimeline, philosophy } from "../data/profile";
import { projects } from "../data/projects";
import { experience } from "../data/experience";
import { skillGroups } from "../data/skills";
import { education, certifications, publication } from "../data/education";
import { architectures } from "../data/architectures";

/**
 * Portfolio answer engine.
 *
 * A retrieval-and-template question answerer over `src/data/*`. Entirely
 * client-side: no API key, no network, nothing to leak, and it ships in a
 * static build. Every sentence it returns is assembled from the same records
 * the sections render, so an answer can never contradict the page.
 *
 * The shape it returns — title, body, facts, a section to jump to — is
 * deliberately the shape a real RAG response would have. Swapping the matcher
 * for a Worker proxying Claude later is a change to `answerFor` alone; the
 * palette UI does not move.
 */

export interface Answer {
  id: string;
  title: string;
  body: string;
  facts?: Array<[string, string]>;
  /** Section id to offer as a jump target. */
  section?: string;
  /** 0–1; below MIN_CONFIDENCE the palette shows suggestions instead. */
  confidence: number;
}

const STOPWORDS = new Set([
  "a", "about", "an", "and", "any", "anything", "are", "as", "at", "be", "been", "build",
  "by", "can", "did", "do", "does", "doing", "for", "from", "get", "give", "had", "has",
  "have", "he", "her", "hers", "him", "his", "how", "i", "in", "is", "it", "its", "know",
  "like", "long", "made", "make", "me", "much", "my", "of", "on", "or", "our", "she",
  "show", "so", "some", "tell", "than", "that", "the", "their", "them", "there", "they",
  "this", "to", "us", "use", "used", "using", "was", "we", "were", "what", "whats", "when",
  "where", "which", "who", "whos", "why", "will", "with", "work", "worked", "would", "you",
  "your", "sharim", "ansari", "him", "many", "most", "best", "kind", "sort", "type",
]);

function tokens(input: string): string[] {
  const out: string[] = [];
  for (const raw of input.toLowerCase().split(/[^a-z0-9+#.]+/)) {
    const t = raw.replace(/^\.+|\.+$/g, "");
    if (t.length <= 1 || STOPWORDS.has(t)) continue;
    out.push(t);
    // "react.js" also indexes as "react", "node.js" as "node" — otherwise a
    // search for `react` never matches the skill actually called React.js.
    const stem = t.split(".")[0];
    if (stem !== t && stem.length > 2 && !STOPWORDS.has(stem)) out.push(stem);
  }
  return out;
}

/* ---------- corpus ---------- */

interface Entry {
  id: string;
  title: string;
  /** Curated match surface. Repeat a term to weight it up. */
  keywords: string[];
  /**
   * Terms harvested from prose (descriptions, highlights). Deliberately worth
   * far less than a curated keyword: without this split, "where is he based"
   * matched a project whose description happens to contain "React-based" as
   * strongly as it matched the Location topic.
   */
  soft?: string[];
  section?: string;
  build: () => Omit<Answer, "id" | "confidence" | "section">;
}

const currentRole = careerTimeline[careerTimeline.length - 1];

function projectEntries(): Entry[] {
  return projects.map((p) => ({
    id: `project:${p.id}`,
    title: p.name,
    section: "projects",
    keywords: [
      ...tokens(p.name),
      ...tokens(p.name),
      ...(p.aliases ?? []).flatMap(tokens),
      ...(p.aliases ?? []).flatMap(tokens),
      ...p.stack.flatMap(tokens),
      ...p.categories.flatMap(tokens),
      "project",
      "system",
      "built",
    ],
    soft: [...tokens(p.subtitle), ...tokens(p.description)],
    build: () => ({
      title: `${p.name} — ${p.subtitle}`,
      body: `${p.detail.problem} ${p.detail.solution}`,
      facts: [
        ["Role", p.detail.role],
        ["Timeline", p.dates],
        ["Stack", p.stack.slice(0, 6).join(" · ")],
        ["Result", p.detail.results[0] ?? p.keyAchievement],
      ],
    }),
  }));
}

function experienceEntries(): Entry[] {
  return experience.map((e) => ({
    id: `experience:${e.company}`,
    title: e.company,
    section: "experience",
    keywords: [
      ...tokens(e.company),
      ...tokens(e.company),
      ...tokens(e.role),
      ...e.stack.flatMap(tokens),
      "job",
      "role",
      "company",
      "employer",
    ],
    soft: [...tokens(e.location), ...e.highlights.flatMap((h) => tokens(h).slice(0, 14))],
    build: () => ({
      title: `${e.role} · ${e.company}`,
      body: e.highlights[0],
      facts: [
        ["Period", e.period],
        ["Location", e.location],
        ["Stack", e.stack.slice(0, 6).join(" · ")],
        ["Scope", `${e.highlights.length} tracked responsibilities`],
      ],
    }),
  }));
}

function skillEntries(): Entry[] {
  const groups: Entry[] = skillGroups.map((g) => ({
    id: `skills:${g.id}`,
    title: g.name,
    section: "skills",
    keywords: [...tokens(g.name), ...g.skills.flatMap((s) => tokens(s.name)), "stack", "skills", "technologies"],
    build: () => ({
      title: `${g.name} stack`,
      body: `${g.skills.length} technologies in active use: ${g.skills.map((s) => s.name).join(", ")}.`,
      facts: g.skills.slice(0, 4).map((s) => [s.name, s.context] as [string, string]),
    }),
  }));

  // Individual technologies answer "does he know X?" directly.
  const singles: Entry[] = skillGroups.flatMap((g) =>
    g.skills.map((s) => ({
      id: `skill:${s.name}`,
      title: s.name,
      section: "skills",
      keywords: [...tokens(s.name), ...tokens(s.name)],
      soft: tokens(s.context),
      build: () => ({
        title: s.name,
        body: `${s.context}. Part of the ${g.name.toLowerCase()} stack.`,
        facts: [
          [
            "Used in",
            projects
              .filter((p) => p.stack.some((t) => t.toLowerCase().includes(s.name.toLowerCase())))
              .map((p) => p.name)
              .slice(0, 3)
              .join(" · ") || "across production systems",
          ],
        ],
      }),
    })),
  );

  return [...groups, ...singles];
}

function topicEntries(): Entry[] {
  return [
    {
      id: "topic:contact",
      title: "Contact",
      section: "contact",
      keywords: [
        "contact", "contact", "reach", "email", "mail", "whatsapp", "phone", "call", "hire",
        "hiring", "available", "availability", "talk", "message", "connect", "freelance",
        "opportunity", "opportunities", "number",
      ],
      build: () => ({
        title: "How to reach Sharim",
        body: `${profile.status} — based in ${profile.location}. WhatsApp is the fastest channel; email works for anything longer.`,
        facts: [
          ["WhatsApp", profile.phone],
          ["Email", profile.email],
          ["LinkedIn", "in/sharim-ansari"],
          ["Location", profile.location],
        ],
      }),
    },
    {
      id: "topic:years",
      title: "Experience",
      section: "experience",
      keywords: ["years", "experience", "senior", "long", "career", "timeline", "history", "seniority"],
      build: () => ({
        title: `${profile.yearsExperience} years, four companies`,
        body: `${profile.intro}`,
        facts: careerTimeline.map((t) => [t.year, `${t.role} — ${t.org}`] as [string, string]),
      }),
    },
    {
      id: "topic:location",
      title: "Location",
      section: "about",
      keywords: [
        "location", "location", "based", "based", "where", "kuwait", "kuwait", "country",
        "remote", "relocate", "timezone", "live", "city",
      ],
      build: () => ({
        title: `Based in ${profile.location}`,
        body: `Currently ${currentRole.role} at ${currentRole.org} in ${profile.location}. Earlier roles were in Thane and Mumbai, India.`,
        facts: [
          ["Now", `${currentRole.org} · ${profile.location}`],
          ["Status", profile.status],
          ["Languages", profile.languages.map((l) => `${l.name} (${l.level})`).join(" · ")],
        ],
      }),
    },
    {
      id: "topic:education",
      title: "Education",
      section: "education",
      keywords: [
        "education", "degree", "study", "studied", "university", "college", "masters", "master",
        "mtech", "bachelor", "diploma", "cgpa", "academic", "qualification", "security",
      ],
      build: () => ({
        title: "M.Tech in Information Security",
        body: `${education[0].degree} in ${education[0].field} from ${education[0].school} (${education[0].period}), on top of a ${education[1].degree} in ${education[1].field}.`,
        facts: education.map((e) => [e.period, `${e.degree}, ${e.field} — ${e.score}`] as [string, string]),
      }),
    },
    {
      id: "topic:publication",
      title: "Research",
      section: "education",
      keywords: ["publication", "published", "research", "paper", "springer", "conference", "ict4sd", "academic"],
      build: () => ({
        title: `${publication.conference} · ${publication.publisher}`,
        body: publication.description,
        facts: [["Proceedings", publication.proceedings]],
      }),
    },
    {
      id: "topic:certifications",
      title: "Certifications",
      section: "education",
      keywords: ["certification", "certifications", "certified", "certificate", "course", "courses", "aws", "scrum", "devops"],
      build: () => ({
        title: `${certifications.length} certifications`,
        body: certifications.map((c) => c.name).join(" · "),
        facts: certifications.slice(0, 4).map((c) => [c.issuer, c.name] as [string, string]),
      }),
    },
    {
      id: "topic:philosophy",
      title: "How he works",
      section: "about",
      keywords: ["philosophy", "approach", "principles", "process", "methodology", "agile", "scrum", "values", "believe"],
      build: () => ({
        title: "Architect · Automate · Secure · Optimize",
        body: philosophy.map((p) => `${p.title}: ${p.text}`).join(" "),
      }),
    },
    {
      id: "topic:architecture",
      title: "Architecture",
      section: "architecture",
      keywords: [
        "architecture", "architectures", "design", "pattern", "patterns", "monolith",
        "microservices", "serverless", "scalable", "scale", "diagram", "reference",
      ],
      build: () => ({
        title: `${architectures.length} reference architectures`,
        body: `Interactive layouts for the classes of system covered here: ${architectures.map((a) => a.name).join(", ")}. Switch between them to compare approaches.`,
      }),
    },
    {
      id: "topic:ai",
      title: "AI & security",
      section: "ai-security",
      keywords: [
        "ai", "llm", "dlp", "gateway", "presidio", "openai", "anthropic", "claude", "chatgpt",
        "groq", "gemini", "governance", "compliance", "audit", "policy", "sso", "entra",
        "security", "secure", "leak", "pii",
      ],
      build: () => ({
        title: "AI without losing control",
        body: "Every employee prompt routes through a two-layer DLP engine — Microsoft Presidio plus an LLM classifier across 19 detection categories — behind Entra ID SSO, department policy and full audit logging, before it reaches OpenAI, Anthropic or Groq.",
        facts: [
          ["Detection", "19 categories, prompts + attachments"],
          ["Identity", "Microsoft Entra ID SSO"],
          ["Providers", "OpenAI · Anthropic · Groq"],
          ["Try it", "The gateway simulation runs in your browser"],
        ],
      }),
    },
    {
      id: "topic:resume",
      title: "Resume",
      keywords: ["resume", "cv", "download", "pdf", "profile"],
      build: () => ({
        title: "Resume",
        body: "The full PDF is one keystroke away — or read the same record here, section by section.",
        facts: [
          ["Role", profile.title],
          ["Experience", `${profile.yearsExperience} years`],
          ["Specialties", profile.specialties],
        ],
      }),
    },
  ];
}

const CORPUS: Entry[] = [...projectEntries(), ...experienceEntries(), ...skillEntries(), ...topicEntries()];

/**
 * Whole-question shortcuts.
 *
 * "who is he" is entirely stopwords once tokenised, so the scorer has nothing
 * to work with and the palette would offer suggestions to a perfectly clear
 * question. These map a handful of well-formed questions straight onto an
 * entry, before any scoring runs.
 */
const PHRASE_INTENTS: Array<[RegExp, string]> = [
  // Most specific first: "what is he good at" must not be swallowed by the
  // "what is he" catch-all below it.
  [/^(what is he good at|what('s| is) he best at|strengths|specialit|expertise|what can he do)/, "topic:philosophy"],
  [/^(how (do i|can i) (contact|reach|get in touch)|contact (him|details)|whatsapp|phone number)/, "topic:contact"],
  [/^(hire|can i hire|are you available|is he available|availability)/, "topic:contact"],
  [/^(what does he charge|rate|salary|day rate)/, "topic:contact"],
  [/^(who is (he|sharim|this)|who are you|about (him|sharim|you)|tell me about (him|sharim|yourself)|introduce)/, "topic:years"],
  [/^(what does he do|what do you do|his role|what is he\b(?! good))/, "topic:years"],
];

/* ---------- matching ---------- */

const MIN_CONFIDENCE = 0.28;

function score(entry: Entry, queryTokens: string[], raw: string): number {
  if (!queryTokens.length) return 0;

  const keywordCounts = new Map<string, number>();
  for (const k of entry.keywords) keywordCounts.set(k, (keywordCounts.get(k) ?? 0) + 1);
  const softTerms = new Set(entry.soft ?? []);

  const titleTokens = new Set(tokens(entry.title));
  let hits = 0;
  let total = 0;

  for (const t of queryTokens) {
    let best = 0;
    if (titleTokens.has(t)) best = 3;
    else if (keywordCounts.has(t)) best = Math.min(2.5, 1 + (keywordCounts.get(t) ?? 1) * 0.75);
    else if (softTerms.has(t)) best = 0.6;
    else {
      // Prefix match catches "postgres" → "postgresql", "auth" → "authentication".
      for (const k of keywordCounts.keys()) {
        if (t.length >= 4 && (k.startsWith(t) || t.startsWith(k))) {
          best = Math.max(best, 1);
          break;
        }
      }
    }
    if (best > 0) hits += 1;
    total += best;
  }

  // Whole-phrase hit on the title is a strong signal ("ai gateway", "al rashed").
  const titleLower = entry.title.toLowerCase();
  if (titleLower.length > 3 && raw.includes(titleLower)) total += 4;

  // Normalise by query length so a long question can't out-score a short one
  // purely by having more tokens, and require real coverage.
  const coverage = hits / queryTokens.length;
  return (total / (queryTokens.length * 3)) * (0.45 + 0.55 * coverage);
}

/** Best answer for a free-text question, or null when nothing matches well. */
export function answerFor(query: string): Answer | null {
  const raw = query.trim().toLowerCase();
  if (raw.length < 3) return null;

  for (const [pattern, id] of PHRASE_INTENTS) {
    if (!pattern.test(raw)) continue;
    const entry = CORPUS.find((e) => e.id === id);
    if (entry) return { id: entry.id, section: entry.section, confidence: 0.9, ...entry.build() };
  }

  const qt = tokens(raw);
  if (!qt.length) return null;

  let best: Entry | null = null;
  let bestScore = 0;

  for (const entry of CORPUS) {
    const s = score(entry, qt, raw);
    if (s > bestScore) {
      bestScore = s;
      best = entry;
    }
  }

  if (!best || bestScore < MIN_CONFIDENCE) return null;

  const built = best.build();
  return {
    id: best.id,
    section: best.section,
    confidence: Math.min(1, bestScore),
    ...built,
  };
}

/** Shown when nothing matched — real questions, not lorem. */
export const SUGGESTED_QUESTIONS = [
  "What did he build at Al Rashed?",
  "How does the AI Gateway handle DLP?",
  "Does he know PostgreSQL?",
  "What's his education?",
  "How do I contact him?",
];
