import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Brain,
  Briefcase,
  Command,
  Download,
  FolderGit2,
  GraduationCap,
  Home,
  IdCard,
  Layers,
  Mail,
  Network,
  Search,
  Sparkles,
  Sun,
  TerminalSquare,
  User,
} from "lucide-react";
import { system, useSystem } from "../lib/system";
import { profile } from "../data/profile";
import { goToSection } from "../lib/navigate";
import type { Answer } from "../lib/answers";
import { track } from "../lib/analytics";
import { onResumeDownload, onWhatsAppOpen, whatsappHref } from "../lib/contact";
import { WhatsAppGlyph } from "./WhatsAppButton";

interface Cmd {
  id: string;
  label: string;
  hint?: string;
  /** Any glyph that takes a className — lucide icons and the inline WhatsApp mark. */
  icon: ComponentType<{ className?: string }>;
  run: () => void;
}

function buildCommands(): Cmd[] {
  return [
    { id: "home", label: "Home", hint: "/home", icon: Home, run: () => goToSection("home") },
    { id: "about", label: "About", hint: "/about", icon: User, run: () => goToSection("about") },
    { id: "experience", label: "Experience", hint: "/experience", icon: Briefcase, run: () => goToSection("experience") },
    { id: "projects", label: "Projects · Selected Systems", hint: "/projects", icon: FolderGit2, run: () => goToSection("projects") },
    { id: "architecture", label: "Architecture Lab", hint: "/architecture", icon: Network, run: () => goToSection("architecture") },
    { id: "ai", label: "AI Gateway · AI & Security", hint: "/ai", icon: Brain, run: () => goToSection("ai-security") },
    { id: "skills", label: "Technology Stack", hint: "/skills", icon: Layers, run: () => goToSection("skills") },
    { id: "education", label: "Education & Research", hint: "/education", icon: GraduationCap, run: () => goToSection("education") },
    { id: "contact", label: "Contact", hint: "/contact", icon: Mail, run: () => goToSection("contact") },
    {
      id: "whatsapp",
      label: "Message on WhatsApp",
      hint: "fastest reply",
      icon: WhatsAppGlyph,
      run: () => {
        onWhatsAppOpen("palette");
        window.open(whatsappHref(), "_blank", "noopener,noreferrer");
      },
    },
    {
      id: "brief",
      label: "Recruiter Briefing · TL;DR",
      hint: "15 seconds",
      icon: IdCard,
      run: () => system.setRecruiterOpen(true),
    },
    {
      id: "theme",
      label: "Switch Display Profile",
      hint: "terminal ⇄ daylight",
      icon: Sun,
      run: () => system.toggleTheme(),
    },
    {
      id: "discovery",
      label: "Toggle Discovery Mode",
      hint: "advanced view",
      icon: Sparkles,
      run: () => system.toggleDiscovery(),
    },
    {
      id: "console",
      label: "Open the SHARIM.OS Terminal",
      hint: "type `help`",
      icon: TerminalSquare,
      run: () => system.setConsoleOpen(true),
    },
    {
      id: "resume",
      label: "Download Resume",
      hint: "PDF",
      icon: Download,
      run: () => {
        const a = document.createElement("a");
        a.href = profile.resumeFile;
        a.download = "";
        a.rel = "noopener";
        a.click();
        onResumeDownload("palette");
      },
    },
  ];
}

/** Answer card — the same shape a model-backed response would fill, so the
 *  matcher can be swapped for a real one without touching this markup. */
function AnswerCard({ answer, onJump }: { answer: Answer; onJump: (section: string) => void }) {
  return (
    <div className="border-t border-line px-4 py-4">
      <div className="flex items-center justify-between font-mono text-[9px] tracking-[0.25em] text-dim">
        <span className="text-cyan">ANSWER</span>
        <span>
          MATCH{" "}
          <span className="text-mint">{Math.round(answer.confidence * 100)}%</span> · LOCAL INDEX
        </span>
      </div>

      <h3 className="mt-2.5 font-display text-sm font-bold text-fg">{answer.title}</h3>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{answer.body}</p>

      {answer.facts?.length ? (
        <dl className="mt-3 space-y-1 border-t border-line pt-3 font-mono text-[10.5px]">
          {answer.facts.map(([k, v]) => (
            <div key={k} className="flex gap-3">
              <dt className="w-20 shrink-0 tracking-[0.12em] text-dim">{k.toUpperCase()}</dt>
              <dd className="flex-1 text-muted">{v}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {answer.section && (
        <button
          type="button"
          onClick={() => onJump(answer.section!)}
          className="mt-3.5 inline-flex items-center gap-2 rounded border border-cyan/40 bg-cyan/10 px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] text-cyan transition-colors hover:bg-cyan/20"
        >
          OPEN /{answer.section.toUpperCase()} <ArrowRight className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

/** Ctrl+K / "/" command palette. Falls through to the local answer engine for
 *  anything that isn't a command, so plain questions work too. */
export default function CommandPalette() {
  const open = useSystem((s) => s.paletteOpen);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [granted, setGranted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const commands = useMemo(buildCommands, []);

  /**
   * The answer engine is code-split.
   *
   * `lib/answers` indexes every project, role, skill and record — worth loading
   * for someone who opens the palette, not for someone who never does. Fetched
   * on open, which is several keystrokes ahead of the first question.
   */
  const [engine, setEngine] = useState<typeof import("../lib/answers") | null>(null);
  useEffect(() => {
    if (open && !engine) void import("../lib/answers").then(setEngine);
  }, [open, engine]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\//, "");
    if (!q) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.id.includes(q) || c.hint?.toLowerCase().includes(q),
    );
  }, [query, commands]);

  // Questions only reach the answer engine once the command list gives up, so
  // "contact" still opens the section rather than lecturing about channels.
  const answer = useMemo(
    () => (engine && filtered.length === 0 ? engine.answerFor(query) : null),
    [engine, filtered, query],
  );

  // Global shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const inField = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName ?? "");
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        system.setPaletteOpen(!system.get().paletteOpen);
      } else if (e.key === "/" && !inField && !system.get().paletteOpen) {
        e.preventDefault();
        system.setPaletteOpen(true);
      } else if (e.key === "Escape" && system.get().paletteOpen) {
        system.setPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setIndex(0);
      system.logOnce("palette", "command center opened", "accent");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setIndex(0), [query]);

  const close = () => system.setPaletteOpen(false);

  const execute = (cmd: Cmd) => {
    close();
    cmd.run();
  };

  const jump = (section: string) => {
    track("answer_jump", { section });
    close();
    goToSection(section);
  };

  const onSubmit = () => {
    const trimmed = query.trim();

    // Easter egg: sudo explore → ACCESS GRANTED + discovery mode
    if (trimmed.toLowerCase() === "sudo explore") {
      close();
      setGranted(true);
      system.log("sudo explore", "warn");
      system.log("ACCESS GRANTED", "ok");
      system.toggleDiscovery(true);
      window.setTimeout(() => setGranted(false), 1400);
      return;
    }

    if (filtered[index]) {
      execute(filtered[index]);
      return;
    }

    if (answer) {
      track("answer_hit", { query: trimmed.slice(0, 60), id: answer.id });
      if (answer.section) jump(answer.section);
      return;
    }

    if (trimmed) track("answer_miss", { query: trimmed.slice(0, 60) });
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[80] flex items-start justify-center bg-ink/70 px-4 pt-[14vh] backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Command palette"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="glass elev-panel w-full max-w-lg overflow-hidden rounded-lg"
            >
              <div className="flex items-center gap-3 border-b border-line px-4 py-3">
                <Search className="h-4 w-4 shrink-0 text-muted" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setIndex((i) => Math.min(i + 1, filtered.length - 1));
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setIndex((i) => Math.max(i - 1, 0));
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      onSubmit();
                    }
                  }}
                  placeholder="Jump to a section — or ask a question…"
                  aria-label="Search commands or ask a question"
                  className="w-full bg-transparent font-mono text-sm text-fg placeholder:text-dim focus:outline-none"
                />
                <kbd className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[9px] text-dim sm:block">
                  ESC
                </kbd>
              </div>

              <div className="max-h-[52vh] overflow-y-auto">
                {filtered.length > 0 && (
                  <ul className="p-2" role="listbox">
                    {filtered.map((c, i) => (
                      <li key={c.id} role="option" aria-selected={i === index}>
                        <button
                          type="button"
                          onClick={() => execute(c)}
                          onMouseEnter={() => setIndex(i)}
                          className={`flex w-full items-center gap-3 rounded px-3 py-2.5 text-left transition-colors ${
                            i === index ? "bg-cyan/10 text-fg" : "text-muted"
                          }`}
                        >
                          <c.icon className={`h-4 w-4 shrink-0 ${i === index ? "text-cyan" : "text-dim"}`} />
                          <span className="flex-1 text-sm">{c.label}</span>
                          {c.hint && <span className="font-mono text-[10px] text-dim">{c.hint}</span>}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {answer && <AnswerCard answer={answer} onJump={jump} />}

                {filtered.length === 0 && !answer && (
                  <div className="px-4 py-6">
                    <p className="text-center font-mono text-xs text-dim">
                      nothing matched — try a question
                    </p>
                    <ul className="mt-4 space-y-1.5">
                      {(engine?.SUGGESTED_QUESTIONS ?? []).map((q) => (
                        <li key={q}>
                          <button
                            type="button"
                            onClick={() => setQuery(q)}
                            className="w-full rounded border border-line px-3 py-2 text-left font-mono text-[11px] text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
                          >
                            {q}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-line px-4 py-2 font-mono text-[9px] tracking-[0.15em] text-dim">
                <span>{answer ? "↵ OPEN SECTION" : "↑↓ NAVIGATE · ↵ OPEN"}</span>
                <span className="flex items-center gap-1">
                  <Command className="h-3 w-3" /> SHARIM.OS COMMAND CENTER
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* sudo explore — ACCESS GRANTED flash */}
      <AnimatePresence>
        {granted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-[85] flex items-center justify-center bg-ink/80"
            aria-hidden="true"
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              className="text-center font-mono"
            >
              <div className="text-2xl font-bold tracking-[0.35em] text-mint">ACCESS GRANTED</div>
              <div className="mt-2 text-[10px] tracking-[0.3em] text-muted">DISCOVERY MODE ENABLED</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
