import { useSyncExternalStore } from "react";
import { track } from "./analytics";

/**
 * SHARIM.OS — tiny external store powering the "living system" layer:
 * console/terminal, active section, discovery mode, visitor interest, theme,
 * session tracking, and the command palette. Kept outside React
 * state so high-frequency events (scroll observers, hovers) never re-render the
 * tree — only subscribed widgets update.
 *
 * Storage is split by lifetime, deliberately:
 *   • localStorage   — durable *preferences* (theme, boot seen, discovery,
 *                      interest). A returning visitor shouldn't sit through
 *                      the boot sequence again in every new tab.
 *   • sessionStorage — this visit's *session* trail (projects opened, tech
 *                      inspected) that feeds the session summary.
 * Only non-sensitive UI state is stored, and every access is guarded — private
 * mode and blocked storage degrade to in-memory.
 */

export type Theme = "terminal" | "daylight";

export interface ConsoleAction {
  label: string;
  run: () => void;
}

export interface ConsoleLine {
  id: number;
  text: string;
  kind: "info" | "ok" | "warn" | "accent" | "cmd" | "out";
  /** Inline buttons rendered under the line (idle prompt, terminal hints). */
  actions?: ConsoleAction[];
  /** Renders the line pre-formatted, preserving newlines and spacing. */
  block?: boolean;
}

export interface SystemState {
  booted: boolean;
  activeSection: string;
  discovery: boolean;
  interest: string | null;
  theme: Theme;
  recruiterOpen: boolean;
  consoleLines: ConsoleLine[];
  consoleOpen: boolean;
  paletteOpen: boolean;
  visitedProjects: string[];
  /** Display name of the most recently opened system — kept here so the
   *  contact helpers can name it without pulling the projects data into the
   *  eager bundle. */
  lastProject: string | null;
  inspectedTechs: string[];
}

const PREFS_KEY = "sharim-os:prefs";
const SESSION_KEY = "sharim-os";

interface Prefs {
  booted: boolean;
  discovery: boolean;
  interest: string | null;
  theme: Theme;
}

interface SessionTrail {
  visitedProjects: string[];
  lastProject: string | null;
  inspectedTechs: string[];
}

function read<T>(storage: "local" | "session", key: string): Partial<T> {
  try {
    const raw = (storage === "local" ? localStorage : sessionStorage).getItem(key);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

const prefs = read<Prefs>("local", PREFS_KEY);
const trail = read<SessionTrail>("session", SESSION_KEY);

/** The pre-paint script in index.html is the source of truth for the initial
 *  theme; mirror whatever it resolved so the store and the DOM never disagree. */
function initialTheme(): Theme {
  if (typeof document !== "undefined") {
    const attr = document.documentElement.dataset.theme;
    if (attr === "daylight" || attr === "terminal") return attr;
  }
  return prefs.theme === "daylight" ? "daylight" : "terminal";
}

let state: SystemState = {
  booted: prefs.booted ?? false,
  activeSection: "home",
  discovery: prefs.discovery ?? false,
  interest: prefs.interest ?? null,
  theme: initialTheme(),
  recruiterOpen: false,
  consoleLines: [],
  consoleOpen: false,
  paletteOpen: false,
  visitedProjects: Array.isArray(trail.visitedProjects) ? trail.visitedProjects : [],
  lastProject: typeof trail.lastProject === "string" ? trail.lastProject : null,
  inspectedTechs: Array.isArray(trail.inspectedTechs) ? trail.inspectedTechs : [],
};

const listeners = new Set<() => void>();
let lineId = 0;
const firedOnce = new Set<string>();
const startTime = Date.now();

const MAX_LINES = 60;

function persist() {
  const { booted, discovery, interest, theme } = state;
  try {
    localStorage.setItem(
      PREFS_KEY,
      JSON.stringify({ booted, discovery, interest, theme } satisfies Prefs),
    );
  } catch {
    /* storage unavailable — preferences degrade to this page load */
  }
  try {
    const { visitedProjects, lastProject, inspectedTechs } = state;
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ visitedProjects, lastProject, inspectedTechs } satisfies SessionTrail),
    );
  } catch {
    /* same */
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function set(patch: Partial<SystemState>) {
  state = { ...state, ...patch };
  persist();
  emit();
}

/** Reflects the active theme onto <html> and the browser chrome colour. */
function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "daylight" ? "#eef2f7" : "#05070d");
}

export const system = {
  get: () => state,

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /** Append a console line (keeps the last MAX_LINES). */
  log(text: string, kind: ConsoleLine["kind"] = "info", extra?: Omit<ConsoleLine, "id" | "text" | "kind">) {
    const line: ConsoleLine = { id: ++lineId, text, kind, ...extra };
    set({ consoleLines: [...state.consoleLines, line].slice(-MAX_LINES) });
    return line.id;
  },

  /** Log a message only once per page load (used for behaviour cues). */
  logOnce(key: string, text: string, kind: ConsoleLine["kind"] = "info") {
    if (firedOnce.has(key)) return;
    firedOnce.add(key);
    system.log(text, kind);
  },

  hasFired: (key: string) => firedOnce.has(key),

  /** Mark a once-key as consumed without logging anything. */
  markFired(key: string) {
    firedOnce.add(key);
  },

  clearConsole() {
    set({ consoleLines: [] });
  },

  markBooted() {
    if (state.booted) return;
    set({ booted: true });
  },

  setSection(id: string) {
    if (state.activeSection === id) return;
    set({ activeSection: id });
  },

  toggleDiscovery(on?: boolean) {
    const next = on ?? !state.discovery;
    set({ discovery: next });
    track("discovery_toggle", { enabled: next });
    system.log(next ? "discovery mode [ ACTIVE ]" : "discovery mode disabled", next ? "ok" : "info");
  },

  setInterest(interest: string | null) {
    set({ interest });
    if (interest) {
      track("interest_select", { interest });
      system.log(`interest registered: ${interest.toLowerCase()}`, "accent");
      system.log("resequencing modules for this route…", "info");
    }
  },

  setTheme(theme: Theme) {
    if (state.theme === theme) return;
    applyTheme(theme);
    set({ theme });
    track("theme_change", { theme });
    system.log(`display profile → ${theme.toUpperCase()}`, "accent");
  },

  toggleTheme() {
    system.setTheme(state.theme === "terminal" ? "daylight" : "terminal");
  },

  setRecruiterOpen(open: boolean) {
    if (state.recruiterOpen === open) return;
    set({ recruiterOpen: open });
    if (open) {
      track("recruiter_mode_open");
      system.log("briefing mode → 15-second summary", "accent");
    }
  },

  visitProject(id: string, name: string) {
    set({
      visitedProjects: state.visitedProjects.includes(id)
        ? state.visitedProjects
        : [...state.visitedProjects, id],
      lastProject: name,
    });
    track("project_open", { project: id });
    system.log(`loading /systems/${id}`, "accent");
    system.log(`${name.toLowerCase()} · architecture ready`, "ok");
  },

  inspectTech(name: string) {
    if (state.inspectedTechs.includes(name)) return;
    set({ inspectedTechs: [...state.inspectedTechs, name] });
    if (state.inspectedTechs.length === 6) {
      system.logOnce("tech-curious", "you think in systems too.", "accent");
    }
  },

  setConsoleOpen(open: boolean) {
    set({ consoleOpen: open });
  },

  setPaletteOpen(open: boolean) {
    if (state.paletteOpen === open) return;
    set({ paletteOpen: open });
    if (open) track("palette_open");
  },

  secondsSinceLoad: () => (Date.now() - startTime) / 1000,
};

/** Keep <html> in sync if the pre-paint script was skipped (no JS storage). */
applyTheme(state.theme);

export function useSystem<T>(selector: (s: SystemState) => T): T {
  return useSyncExternalStore(system.subscribe, () => selector(state));
}

/** Section-entry console narration — each fires once per page load. */
export const SECTION_LOGS: Record<string, Array<[string, ConsoleLine["kind"]]>> = {
  home: [["systems online.", "ok"]],
  about: [
    ["loading /about", "accent"],
    ["profile module ready", "ok"],
  ],
  experience: [
    ["loading /experience", "accent"],
    ["career timeline initialized", "ok"],
    ["inspecting the systems behind the work.", "info"],
  ],
  projects: [
    ["loading /projects", "accent"],
    ["indexing 05 systems", "info"],
    ["architecture modules ready", "ok"],
  ],
  architecture: [
    ["loading /architecture", "accent"],
    ["06 reference layouts available", "ok"],
  ],
  "ai-security": [
    ["loading /ai-gateway", "accent"],
    ["DLP engine · 19 categories armed", "ok"],
    ["this is where AI meets enterprise security.", "info"],
  ],
  skills: [
    ["loading /stack", "accent"],
    ["technology ecosystem mounted", "ok"],
  ],
  education: [
    ["loading /education", "accent"],
    ["academic records verified", "ok"],
  ],
  contact: [
    ["connection endpoint detected", "accent"],
    ["waiting for input...", "info"],
  ],
};
