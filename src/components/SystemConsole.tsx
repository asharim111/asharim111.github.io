import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, TerminalSquare } from "lucide-react";
import { system, useSystem, type ConsoleLine } from "../lib/system";

/**
 * The shell is code-split.
 *
 * `lib/terminal` reaches every data file in the project (it is the filesystem
 * the commands read), and this component is on the eager path — importing it
 * statically pulled the entire case-study corpus into the first chunk. It is
 * fetched the moment the visitor focuses the prompt, which is well before they
 * finish typing a command.
 */
type TerminalModule = typeof import("../lib/terminal");
let shell: TerminalModule | null = null;
let shellLoading: Promise<TerminalModule> | null = null;

function loadShell(): Promise<TerminalModule> {
  if (shell) return Promise.resolve(shell);
  shellLoading ??= import("../lib/terminal").then((m) => (shell = m));
  return shellLoading;
}

const kindClass: Record<ConsoleLine["kind"], string> = {
  info: "text-muted",
  ok: "text-mint",
  warn: "text-warn",
  accent: "text-cyan",
  cmd: "text-fg",
  out: "text-muted",
};

/**
 * SHARIM.OS terminal.
 *
 * It still narrates what the page is doing — but it now takes input, over the
 * same `src/data/*` records the sections render (`help`, `whoami`,
 * `ls projects`, `cat experience --company="Al Rashed"`, `contact --whatsapp`),
 * and falls through to the ⌘K answer engine for anything phrased as a
 * question. Desktop only: below `sm` the comms dock owns the screen furniture.
 */
export default function SystemConsole() {
  const lines = useSystem((s) => s.consoleLines);
  const open = useSystem((s) => s.consoleOpen);
  const booted = useSystem((s) => s.booted);

  const [input, setInput] = useState("");
  /** Newest-first command history; index -1 means "editing a fresh line". */
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  /** Only steal focus when the visitor opened the console themselves. */
  const focusOnOpen = useRef(false);

  const latest = lines[lines.length - 1];

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, open]);

  useEffect(() => {
    if (open && focusOnOpen.current) {
      focusOnOpen.current = false;
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  if (!booted) return null;

  const submit = () => {
    const line = input.trim();
    if (!line) return;
    // Resolves instantly once the prompt has been focused; on the very first
    // command it awaits the chunk rather than dropping the input.
    void loadShell().then((m) => m.runCommand(line));
    setHistory((h) => [line, ...h.filter((x) => x !== line)].slice(0, 30));
    setHistoryIndex(-1);
    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const completed = shell?.complete(input);
      if (completed) setInput(completed);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const next = Math.min(historyIndex + 1, history.length - 1);
      setHistoryIndex(next);
      setInput(history[next]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = historyIndex - 1;
      setHistoryIndex(next);
      setInput(next < 0 ? "" : history[next]);
      return;
    }
    if (e.key === "l" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      system.clearConsole();
      return;
    }
    if (e.key === "Escape") {
      // Don't close from here — the palette owns Escape globally. Just let go.
      inputRef.current?.blur();
    }
  };

  return (
    <div
      data-print="hide"
      className="fixed bottom-4 left-4 z-[55] hidden font-mono sm:block"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <AnimatePresence mode="wait">
        {open ? (
          <motion.div
            key="console"
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className="glass elev-panel w-[min(92vw,420px)] overflow-hidden rounded-lg"
          >
            <div className="flex items-center justify-between border-b border-line px-3 py-2">
              <span className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.25em] text-fg">
                <TerminalSquare className="h-3.5 w-3.5 text-cyan" /> SHARIM.OS
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-[9px] tracking-[0.15em] text-mint">
                  <span className="h-1 w-1 rounded-full bg-mint [animation:pulse-soft_2s_ease-in-out_infinite]" />
                  ONLINE
                </span>
                <button
                  type="button"
                  aria-label="Collapse system console"
                  onClick={() => system.setConsoleOpen(false)}
                  className="rounded p-0.5 text-muted transition-colors hover:text-fg"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Clicking anywhere in the log drops the caret into the prompt,
                the way a terminal emulator does. */}
            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              aria-label="System console output"
              onClick={() => inputRef.current?.focus()}
              className="max-h-[46vh] min-h-[120px] space-y-1 overflow-y-auto px-3 py-2.5 text-[10.5px] leading-relaxed"
            >
              {lines.length === 0 && (
                <div className="text-dim">&gt; console cleared — type `help`</div>
              )}
              {lines.map((l) => (
                <div key={l.id}>
                  {/* Multi-line command output is padded, not prefixed: a
                      leading "> " on the first line alone knocks that row two
                      characters out of alignment with the columns below it. */}
                  <div
                    className={`${kindClass[l.kind]} ${
                      l.block ? "whitespace-pre-wrap break-words pl-3.5" : ""
                    }`}
                  >
                    {!l.block && (
                      <span className="text-dim">{l.kind === "cmd" ? "$ " : "> "}</span>
                    )}
                    {l.text}
                  </div>
                  {l.actions?.length ? (
                    <div className="mt-1.5 flex flex-wrap gap-1.5 pl-3.5">
                      {l.actions.map((a) => (
                        <button
                          key={a.label}
                          type="button"
                          onClick={a.run}
                          className="rounded border border-cyan/40 bg-cyan/10 px-2 py-1 text-[9.5px] tracking-[0.15em] text-cyan transition-colors hover:bg-cyan/20"
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-line px-3 py-2">
              <span aria-hidden="true" className="text-[11px] text-cyan">
                $
              </span>
              <label htmlFor="sharim-os-input" className="sr-only">
                SHARIM.OS command
              </label>
              <input
                id="sharim-os-input"
                ref={inputRef}
                value={input}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                onFocus={() => void loadShell().then((m) => m.terminalWelcome())}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="help · whoami · ls projects · ask a question"
                className="w-full bg-transparent text-[11px] text-fg placeholder:text-dim focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between border-t border-line px-3 py-1.5 text-[9px] tracking-[0.15em] text-dim">
              <span>TAB COMPLETE · ↑ HISTORY</span>
              <span>{lines.length} LINES</span>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="pill"
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.22 }}
            onClick={() => {
              focusOnOpen.current = true;
              system.setConsoleOpen(true);
            }}
            aria-label="Open the SHARIM.OS terminal"
            className="glass elev group flex max-w-[320px] items-center gap-2 rounded-full py-2 pl-3 pr-4 text-[10px] transition-colors hover:border-cyan/40"
          >
            <TerminalSquare className="h-3.5 w-3.5 shrink-0 text-cyan" />
            <span className="tracking-[0.2em] text-fg">SHARIM.OS</span>
            {latest ? (
              <span className={`truncate ${kindClass[latest.kind]}`}>&gt; {latest.text}</span>
            ) : (
              <span className="truncate text-dim">&gt; type `help`</span>
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
