import { profile, careerTimeline } from "../data/profile";
import { projects } from "../data/projects";
import { experience } from "../data/experience";
import { skillGroups } from "../data/skills";
import { education, certifications, publication } from "../data/education";
import { architectures } from "../data/architectures";
import { system } from "./system";
import { track } from "./analytics";
import { goToSection } from "./navigate";
import { whatsappHref, mailtoHref, telHref, onWhatsAppOpen, onEmailOpen, onResumeDownload } from "./contact";
import { readTelemetry, build, relativeBuildAge } from "./telemetry";
import { answerFor } from "./answers";

/**
 * SHARIM.OS shell.
 *
 * A real (if small) command interpreter over the same data files that render
 * the page — `src/data/*` is the filesystem, so nothing here can drift from
 * what the sections say. Commands write into the existing console log, which
 * means output, narration and behaviour cues all share one surface.
 */

const SECTION_IDS = [
  "home",
  "about",
  "experience",
  "projects",
  "architecture",
  "ai-security",
  "skills",
  "education",
  "contact",
];

/* ---------- parsing ---------- */

export interface ParsedCommand {
  name: string;
  args: string[];
  flags: Record<string, string | true>;
}

/**
 * Tokenises respecting single and double quotes, including quotes that begin
 * mid-token: `cat experience --company="Al Rashed"` is three tokens, the last
 * being `--company=Al Rashed`.
 *
 * The obvious pattern — alternating a whole quoted string with `\S+` — breaks
 * here, because `\S+` grabs `--company="Al` before the quote alternative is
 * ever tried. The `(?:…)+` form instead lets one token be built from a run of
 * bare and quoted pieces, which is how a shell actually reads a word.
 */
function tokenize(input: string): string[] {
  const out: string[] = [];
  const re = /(?:[^\s"']+|"[^"]*"|'[^']*')+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(input))) out.push(m[0].replace(/["']/g, ""));
  return out;
}

export function parse(input: string): ParsedCommand {
  const tokens = tokenize(input.trim());
  const name = (tokens.shift() ?? "").toLowerCase();
  const args: string[] = [];
  const flags: Record<string, string | true> = {};

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.startsWith("--")) {
      const body = t.slice(2);
      const eq = body.indexOf("=");
      if (eq > -1) {
        flags[body.slice(0, eq).toLowerCase()] = body.slice(eq + 1);
      } else if (tokens[i + 1] && !tokens[i + 1].startsWith("-")) {
        flags[body.toLowerCase()] = tokens[++i];
      } else {
        flags[body.toLowerCase()] = true;
      }
    } else {
      args.push(t);
    }
  }
  return { name, args, flags };
}

/* ---------- output helpers ---------- */

const out = (text: string) => system.log(text, "out", { block: true });
const ok = (text: string) => system.log(text, "ok");
const warn = (text: string) => system.log(text, "warn");
const accent = (text: string) => system.log(text, "accent");

/** Two-column rows that stay readable in a 400px console. */
function rows(pairs: Array<[string, string]>) {
  const width = Math.min(14, Math.max(...pairs.map(([k]) => k.length)));
  return pairs.map(([k, v]) => `${k.padEnd(width)}  ${v}`).join("\n");
}

function bullets(items: string[], marker = "·") {
  return items.map((i) => `${marker} ${i}`).join("\n");
}

const flagValue = (v: string | true | undefined) => (typeof v === "string" ? v.toLowerCase() : "");

/* ---------- commands ---------- */

interface Command {
  name: string;
  usage: string;
  summary: string;
  /** Completion candidates for the first argument. */
  completions?: () => string[];
  run: (cmd: ParsedCommand) => void;
}

const COMMANDS: Command[] = [
  {
    name: "help",
    usage: "help",
    summary: "list every command",
    run() {
      accent("SHARIM.OS · available commands");
      out(rows(COMMANDS.map((c) => [c.usage, c.summary])));
      system.log("tip: TAB completes · ↑ ↓ recalls history", "info");
    },
  },
  {
    name: "whoami",
    usage: "whoami",
    summary: "the engineer, in one screen",
    run() {
      out(
        rows([
          ["name", profile.name],
          ["role", profile.title],
          ["exp", `${profile.yearsExperience} years`],
          ["based", profile.location],
          ["focus", "AI integration · enterprise automation · secure APIs"],
          ["status", profile.status],
          ["now", `${careerTimeline[careerTimeline.length - 1].role} @ ${careerTimeline[careerTimeline.length - 1].org}`],
        ]),
      );
      system.log("run `contact --whatsapp` to reach me", "info");
    },
  },
  {
    name: "ls",
    usage: "ls <target>",
    summary: "projects · experience · skills · sections · architectures",
    completions: () => ["projects", "experience", "skills", "sections", "architectures", "certs"],
    run({ args }) {
      const target = (args[0] ?? "projects").toLowerCase();
      switch (target) {
        case "projects":
        case "systems":
          out(rows(projects.map((p) => [p.id, `${p.name} — ${p.keyAchievement}`])));
          system.log("`cat project --id=ai-gateway` for the full case study", "info");
          return;
        case "experience":
        case "work":
          out(rows(experience.map((e) => [e.period.split(" – ")[0], `${e.company} — ${e.role}`])));
          system.log('`cat experience --company="Al Rashed"` for detail', "info");
          return;
        case "skills":
        case "stack":
          out(rows(skillGroups.map((g) => [g.id, `${g.name} (${g.skills.length})`])));
          system.log("`cat skills --group=backend` to expand one", "info");
          return;
        case "sections":
          out(SECTION_IDS.map((s) => `/${s}`).join("\n"));
          return;
        case "architectures":
          out(rows(architectures.map((a) => [a.id, `${a.nodes.length} nodes`])));
          return;
        case "certs":
        case "certifications":
          out(bullets(certifications.map((c) => `${c.name} — ${c.issuer}`)));
          return;
        default:
          warn(`ls: no such directory: ${target}`);
          system.log("try: projects · experience · skills · sections · architectures", "info");
      }
    },
  },
  {
    name: "cat",
    usage: "cat <target> [--flag]",
    summary: "read a record in full",
    completions: () => ["project", "experience", "skills", "education", "publication", "profile"],
    run({ args, flags }) {
      const target = (args[0] ?? "").toLowerCase();
      const rest = args.slice(1).join(" ").toLowerCase();

      if (target === "project" || target === "projects" || target === "system") {
        const key = flagValue(flags.id) || flagValue(flags.name) || rest;
        const project =
          projects.find((p) => p.id === key) ??
          projects.find(
            (p) =>
              key &&
              (p.name.toLowerCase().includes(key) ||
                p.aliases?.some((a) => a.includes(key) || key.includes(a))),
          );
        if (!project) {
          warn(key ? `cat: no system matching "${key}"` : "cat: which system? try `ls projects`");
          return;
        }
        accent(`/systems/${project.id}`);
        out(
          rows([
            ["name", project.name],
            ["role", project.detail.role],
            ["dates", project.dates],
            ["stack", project.stack.slice(0, 6).join(", ")],
          ]),
        );
        out(`PROBLEM\n${project.detail.problem}`);
        out(`SOLUTION\n${project.detail.solution}`);
        if (project.detail.decisions.length) {
          out(
            `DECISION LOG\n${project.detail.decisions
              .map((d) => `· ${d.choice}\n  why: ${d.why}\n  cost: ${d.tradeoff}`)
              .join("\n")}`,
          );
        }
        out(`RESULTS\n${bullets(project.detail.results)}`);
        system.log("`open projects` to see it rendered", "info");
        return;
      }

      if (target === "experience" || target === "work" || target === "job") {
        const key = flagValue(flags.company) || flagValue(flags.at) || rest;
        if (!key) {
          out(rows(experience.map((e) => [e.company, e.period])));
          system.log('narrow it: cat experience --company="Al Rashed"', "info");
          return;
        }
        const role = experience.find((e) => e.company.toLowerCase().includes(key));
        if (!role) {
          warn(`cat: no role at "${key}"`);
          return;
        }
        accent(`${role.company} · ${role.role}`);
        out(rows([["period", role.period], ["place", role.location], ["stack", role.stack.join(", ")]]));
        out(bullets(role.highlights));
        return;
      }

      if (target === "skills" || target === "stack") {
        const key = flagValue(flags.group) || rest;
        const group = skillGroups.find((g) => g.id === key || g.name.toLowerCase().includes(key));
        if (!group) {
          if (key) warn(`cat: no skill group "${key}"`);
          out(rows(skillGroups.map((g) => [g.id, g.name])));
          return;
        }
        accent(group.name.toUpperCase());
        out(rows(group.skills.map((s) => [s.name, s.context])));
        return;
      }

      if (target === "education" || target === "edu") {
        out(rows(education.map((e) => [e.period, `${e.degree}, ${e.field} — ${e.score}`])));
        return;
      }

      if (target === "publication" || target === "research" || target === "paper") {
        accent(`${publication.conference} · ${publication.publisher}`);
        out(publication.description);
        out(publication.proceedings);
        return;
      }

      if (target === "profile" || target === "about" || target === "me") {
        out(profile.intro);
        return;
      }

      warn(target ? `cat: unknown record: ${target}` : "cat: what should I read?");
      system.log("try: project · experience · skills · education · publication", "info");
    },
  },
  {
    name: "open",
    usage: "open <target>",
    summary: "jump to a section, the resume, or a profile",
    completions: () => [...SECTION_IDS, "resume", "github", "linkedin"],
    run({ args }) {
      const target = (args[0] ?? "").toLowerCase();

      if (target === "resume" || target === "cv") {
        const a = document.createElement("a");
        a.href = profile.resumeFile;
        a.download = "";
        a.rel = "noopener";
        a.click();
        onResumeDownload("terminal");
        return;
      }
      if (target === "github") {
        window.open(profile.github, "_blank", "noopener,noreferrer");
        ok("github → opened in a new tab");
        return;
      }
      if (target === "linkedin") {
        window.open(profile.linkedin, "_blank", "noopener,noreferrer");
        ok("linkedin → opened in a new tab");
        return;
      }

      const id = target.replace(/^\//, "");
      const match =
        SECTION_IDS.find((s) => s === id) ??
        SECTION_IDS.find((s) => id && s.startsWith(id)) ??
        (id === "ai" || id === "gateway" ? "ai-security" : undefined);

      if (!match) {
        warn(target ? `open: no section "${target}"` : "open: open what? try `ls sections`");
        return;
      }
      goToSection(match);
      ok(`navigating → /${match}`);
    },
  },
  {
    name: "contact",
    usage: "contact [--whatsapp]",
    summary: "open a channel — whatsapp, email, phone, linkedin",
    completions: () => ["--whatsapp", "--email", "--phone", "--linkedin"],
    run({ args, flags }) {
      const channel = args[0]?.toLowerCase() ?? Object.keys(flags)[0] ?? "";

      if (channel.includes("whatsapp") || channel === "wa") {
        onWhatsAppOpen("terminal");
        window.open(whatsappHref(), "_blank", "noopener,noreferrer");
        ok(`whatsapp → ${profile.phone}`);
        return;
      }
      if (channel.includes("mail")) {
        onEmailOpen("terminal");
        window.location.href = mailtoHref();
        ok(`mail draft → ${profile.email}`);
        return;
      }
      if (channel.includes("phone") || channel === "tel" || channel === "call") {
        window.location.href = telHref;
        ok(`dialling ${profile.phone}`);
        return;
      }
      if (channel.includes("linkedin")) {
        window.open(profile.linkedin, "_blank", "noopener,noreferrer");
        ok("linkedin → opened in a new tab");
        return;
      }

      accent("CONNECTION ENDPOINTS");
      out(
        rows([
          ["whatsapp", profile.phone],
          ["email", profile.email],
          ["linkedin", "in/sharim-ansari"],
          ["based", `${profile.location} · ${profile.status.toLowerCase()}`],
        ]),
      );
      system.log("pick one: contact --whatsapp | --email | --linkedin", "info");
    },
  },
  {
    name: "theme",
    usage: "theme [terminal|daylight]",
    summary: "switch display profile",
    completions: () => ["terminal", "daylight"],
    run({ args }) {
      const requested = args[0]?.toLowerCase();
      if (requested === "terminal" || requested === "dark") return void system.setTheme("terminal");
      if (requested === "daylight" || requested === "light") return void system.setTheme("daylight");
      if (requested) {
        warn(`theme: unknown profile "${requested}" — terminal | daylight`);
        return;
      }
      system.toggleTheme();
    },
  },
  {
    name: "stats",
    usage: "stats",
    summary: "live telemetry for this page load",
    run() {
      const t = readTelemetry();
      const n = (v: number | null, unit: string) => (v === null ? "—" : `${v}${unit}`);
      accent("RUNTIME TELEMETRY · measured, not claimed");
      out(
        rows([
          ["render", n(t.renderMs, "ms")],
          ["ttfb", n(t.ttfbMs, "ms")],
          ["js", n(t.jsKb, " KB")],
          ["transferred", n(t.totalKb, " KB")],
          ["network", t.connection?.toUpperCase() ?? "—"],
          ["cores", t.cores ? String(t.cores) : "—"],
          ["build", `${build.sha} · ${relativeBuildAge() ?? "—"}`],
        ]),
      );
    },
  },
  {
    name: "discovery",
    usage: "discovery [on|off]",
    summary: "toggle advanced view",
    completions: () => ["on", "off"],
    run({ args }) {
      const v = args[0]?.toLowerCase();
      system.toggleDiscovery(v === "on" ? true : v === "off" ? false : undefined);
    },
  },
  {
    name: "brief",
    usage: "brief",
    summary: "open the 15-second recruiter briefing",
    run() {
      system.setRecruiterOpen(true);
    },
  },
  {
    name: "ask",
    usage: "ask <question>",
    summary: "ask the portfolio anything, in plain English",
    run({ args, flags }) {
      // Flags are meaningless here — fold them back into the question text.
      const question = [...args, ...Object.entries(flags).map(([k, v]) => (v === true ? k : `${k} ${v}`))]
        .join(" ")
        .trim();
      if (!question) {
        system.log('ask what? e.g. ask what did he build at Al Rashed', "info");
        return;
      }
      printAnswer(question);
    },
  },
  {
    name: "clear",
    usage: "clear",
    summary: "wipe the console",
    run() {
      system.clearConsole();
    },
  },
  {
    name: "sudo",
    usage: "sudo explore",
    summary: "…try it",
    completions: () => ["explore"],
    run({ args }) {
      if (args[0]?.toLowerCase() === "explore") {
        warn("sudo explore");
        ok("ACCESS GRANTED");
        system.toggleDiscovery(true);
        return;
      }
      warn(`${profile.name.split(" ")[0].toLowerCase()} is not in the sudoers file. This incident has been logged.`);
    },
  },
  {
    name: "exit",
    usage: "exit",
    summary: "collapse the console",
    run() {
      system.log("session detached — the console is one click away", "info");
      system.setConsoleOpen(false);
    },
  },
];

/** Renders an answer-engine result into the console, with a jump offer. */
function printAnswer(question: string): boolean {
  const answer = answerFor(question);
  if (!answer) return false;

  accent(answer.title);
  out(answer.body);
  if (answer.facts?.length) out(rows(answer.facts));
  if (answer.section) {
    const section = answer.section;
    system.log(`jump to /${section}?`, "info", {
      actions: [{ label: `OPEN /${section.toUpperCase()}`, run: () => goToSection(section) }],
    });
  }
  return true;
}

const BY_NAME = new Map(COMMANDS.map((c) => [c.name, c]));

/** Aliases that map onto an existing command rather than earning their own row. */
const ALIASES: Record<string, string> = {
  "?": "help",
  man: "help",
  commands: "help",
  who: "whoami",
  me: "whoami",
  dir: "ls",
  goto: "open",
  cd: "open",
  telemetry: "stats",
  perf: "stats",
  hire: "brief",
  tldr: "brief",
  cls: "clear",
  quit: "exit",
  whatsapp: "contact",
};

export const commandNames = [...COMMANDS.map((c) => c.name), ...Object.keys(ALIASES)];

/** Executes one line. The caller is responsible for echoing the prompt. */
export function runCommand(input: string) {
  const line = input.trim();
  if (!line) return;

  system.log(line, "cmd");

  const parsed = parse(line);
  const resolved = BY_NAME.get(parsed.name) ?? BY_NAME.get(ALIASES[parsed.name] ?? "");

  track("terminal_command", { command: parsed.name });

  if (!resolved) {
    // Not a command — but it might be a question. Same engine as ⌘K, so the
    // shell answers "what did he build at Phoenix?" without an `ask` prefix.
    if ((parsed.args.length >= 1 || line.endsWith("?")) && printAnswer(line)) return;

    warn(`${parsed.name}: command not found`);
    system.log("type `help`, or just ask a question", "info");
    return;
  }

  try {
    resolved.run(parsed);
  } catch {
    warn(`${parsed.name}: command failed`);
  }
}

/** TAB completion — command names first, then that command's own candidates. */
export function complete(input: string): string | null {
  const trimmed = input.replace(/^\s+/, "");
  const parts = trimmed.split(/\s+/);

  if (parts.length <= 1) {
    const prefix = (parts[0] ?? "").toLowerCase();
    const hit = commandNames.filter((n) => n.startsWith(prefix)).sort();
    return hit.length ? hit[0] : null;
  }

  const cmd = BY_NAME.get(parts[0].toLowerCase()) ?? BY_NAME.get(ALIASES[parts[0].toLowerCase()] ?? "");
  const candidates = cmd?.completions?.() ?? [];
  const prefix = parts[parts.length - 1].toLowerCase();
  const hit = candidates.filter((c) => c.startsWith(prefix)).sort();
  if (!hit.length) return null;
  return [...parts.slice(0, -1), hit[0]].join(" ");
}

/** Printed once, the first time the terminal is focused. */
export function terminalWelcome() {
  system.logOnce(
    "terminal-welcome",
    "shell attached — `help` for commands, `whoami` to start",
    "accent",
  );
}
