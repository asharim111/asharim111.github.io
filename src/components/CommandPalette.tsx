import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Brain,
  Briefcase,
  Command,
  Download,
  FolderGit2,
  GraduationCap,
  Home,
  Layers,
  Mail,
  Network,
  Search,
  Sparkles,
  TerminalSquare,
  User,
} from "lucide-react";
import { system, useSystem } from "../lib/system";
import { profile } from "../data/profile";

interface Cmd {
  id: string;
  label: string;
  hint?: string;
  icon: typeof Home;
  run: () => void;
}

const goto = (hash: string) => {
  window.location.hash = "";
  window.location.hash = hash;
};

function buildCommands(): Cmd[] {
  return [
    { id: "home", label: "Home", hint: "/home", icon: Home, run: () => goto("#home") },
    { id: "about", label: "About", hint: "/about", icon: User, run: () => goto("#about") },
    { id: "experience", label: "Experience", hint: "/experience", icon: Briefcase, run: () => goto("#experience") },
    { id: "projects", label: "Projects · Selected Systems", hint: "/projects", icon: FolderGit2, run: () => goto("#projects") },
    { id: "architecture", label: "Architecture Lab", hint: "/architecture", icon: Network, run: () => goto("#architecture") },
    { id: "ai", label: "AI Gateway · AI & Security", hint: "/ai", icon: Brain, run: () => goto("#ai-security") },
    { id: "skills", label: "Technology Stack", hint: "/skills", icon: Layers, run: () => goto("#skills") },
    { id: "education", label: "Education & Research", hint: "/education", icon: GraduationCap, run: () => goto("#education") },
    { id: "contact", label: "Contact", hint: "/contact", icon: Mail, run: () => goto("#contact") },
    {
      id: "discovery",
      label: "Toggle Discovery Mode",
      hint: "advanced view",
      icon: Sparkles,
      run: () => system.toggleDiscovery(),
    },
    {
      id: "console",
      label: "Toggle System Console",
      hint: "SHARIM.OS",
      icon: TerminalSquare,
      run: () => system.setConsoleOpen(!system.get().consoleOpen),
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
        a.click();
        system.log("resume.pdf → downloading", "ok");
      },
    },
  ];
}

/** Ctrl+K / "/" command palette with keyboard navigation. */
export default function CommandPalette() {
  const open = useSystem((s) => s.paletteOpen);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [granted, setGranted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const commands = useMemo(buildCommands, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\//, "");
    if (!q) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.id.includes(q) || c.hint?.toLowerCase().includes(q),
    );
  }, [query, commands]);

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

  const execute = (cmd: Cmd) => {
    system.setPaletteOpen(false);
    cmd.run();
  };

  const onSubmit = () => {
    // Easter egg: sudo explore → ACCESS GRANTED + discovery mode
    if (query.trim().toLowerCase() === "sudo explore") {
      system.setPaletteOpen(false);
      setGranted(true);
      system.log("sudo explore", "warn");
      system.log("ACCESS GRANTED", "ok");
      system.toggleDiscovery(true);
      window.setTimeout(() => setGranted(false), 1400);
      return;
    }
    if (filtered[index]) execute(filtered[index]);
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
            onClick={() => system.setPaletteOpen(false)}
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
              className="glass w-full max-w-lg overflow-hidden rounded-lg shadow-2xl shadow-black/60"
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
                  placeholder="Search Sharim's portfolio..."
                  aria-label="Search commands"
                  className="w-full bg-transparent font-mono text-sm text-fg placeholder:text-dim focus:outline-none"
                />
                <kbd className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[9px] text-dim sm:block">
                  ESC
                </kbd>
              </div>

              <ul className="max-h-[46vh] overflow-y-auto p-2" role="listbox">
                {filtered.length === 0 && (
                  <li className="px-3 py-6 text-center font-mono text-xs text-dim">
                    no matching modules — try "sudo explore"
                  </li>
                )}
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

              <div className="flex items-center justify-between border-t border-line px-4 py-2 font-mono text-[9px] tracking-[0.15em] text-dim">
                <span>↑↓ NAVIGATE · ↵ OPEN</span>
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
