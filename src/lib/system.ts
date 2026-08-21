import { useSyncExternalStore } from "react";

/**
 * SHARIM.OS — tiny external store powering the "living system" layer:
 * console log, active section, discovery mode, visitor interest, session
 * tracking, and the command palette. Kept outside React state so high-
 * frequency events (scroll observers, hovers) never re-render the tree —
 * only subscribed widgets update.
 *
 * Only non-sensitive UI state is kept, in sessionStorage, for this tab only.
 */

export interface ConsoleLine {
  id: number;
  text: string;
  kind: "info" | "ok" | "warn" | "accent";
}

export interface SystemState {
  booted: boolean;
  activeSection: string;
  discovery: boolean;
  interest: string | null;
  consoleLines: ConsoleLine[];
  consoleOpen: boolean;
  paletteOpen: boolean;
  visitedProjects: string[];
  inspectedTechs: string[];
}

const SS_KEY = "sharim-os";

function loadPersisted(): Partial<SystemState> {
  try {
    return JSON.parse(sessionStorage.getItem(SS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

const persisted = loadPersisted();

let state: SystemState = {
  booted: persisted.booted ?? false,
  activeSection: "home",
  discovery: persisted.discovery ?? false,
  interest: persisted.interest ?? null,
  consoleLines: [],
  consoleOpen: false,
  paletteOpen: false,
  visitedProjects: persisted.visitedProjects ?? [],
  inspectedTechs: persisted.inspectedTechs ?? [],
};

const listeners = new Set<() => void>();
let lineId = 0;
const firedOnce = new Set<string>(persisted.booted ? [] : []);
const startTime = Date.now();

function persist() {
  try {
    const { booted, discovery, interest, visitedProjects, inspectedTechs } = state;
    sessionStorage.setItem(
      SS_KEY,
      JSON.stringify({ booted, discovery, interest, visitedProjects, inspectedTechs }),
    );
  } catch {
    /* storage unavailable — session features degrade gracefully */
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

export const system = {
  get: () => state,

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /** Append a console line (keeps the last 40). */
  log(text: string, kind: ConsoleLine["kind"] = "info") {
    const line: ConsoleLine = { id: ++lineId, text, kind };
    set({ consoleLines: [...state.consoleLines, line].slice(-40) });
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

  markBooted() {
    set({ booted: true });
  },

  setSection(id: string) {
    if (state.activeSection === id) return;
    set({ activeSection: id });
  },

  toggleDiscovery(on?: boolean) {
    const next = on ?? !state.discovery;
    set({ discovery: next });
    system.log(next ? "discovery mode [ ACTIVE ]" : "discovery mode disabled", next ? "ok" : "info");
  },

  setInterest(interest: string | null) {
    set({ interest });
    if (interest) system.log(`interest registered: ${interest.toLowerCase()}`, "accent");
  },

  visitProject(id: string, name: string) {
    if (!state.visitedProjects.includes(id)) {
      set({ visitedProjects: [...state.visitedProjects, id] });
    }
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
    set({ paletteOpen: open });
  },

  secondsSinceLoad: () => (Date.now() - startTime) / 1000,
};

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
    ["indexing 04 systems", "info"],
    ["architecture modules ready", "ok"],
  ],
  architecture: [
    ["loading /architecture", "accent"],
    ["05 reference layouts available", "ok"],
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
