import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { SendHorizonal, ShieldAlert, ShieldCheck } from "lucide-react";
import FlowDiagram from "./FlowDiagram";
import { system } from "../lib/system";

const PIPELINE = [
  { label: "USER REQUEST" },
  { label: "IDENTITY VERIFIED", sub: "Entra ID SSO" },
  { label: "DLP SCANNING", sub: "Microsoft Presidio" },
  { label: "CLASSIFICATION", sub: "LLM Classifier · 19 categories" },
  { label: "POLICY CHECK", sub: "Department rules" },
  { label: "REQUEST ROUTED", sub: "OpenAI / Anthropic / Groq" },
  { label: "AI RESPONSE" },
];

// Simple client-side heuristics for the simulation — nothing leaves the browser.
const SENSITIVE_PATTERNS: Array<{ re: RegExp; category: string }> = [
  { re: /\b[\w.+-]+@[\w-]+\.[\w.]+\b/, category: "Email Address" },
  { re: /\b(?:\d[ -]?){13,19}\b/, category: "Payment Card Number" },
  { re: /\b\d{9,12}\b/, category: "ID Number" },
  { re: /password|passwd|secret|api[_ ]?key|token/i, category: "Credentials" },
  { re: /salary|payroll|confidential|internal only/i, category: "Confidential Business Data" },
  { re: /\b\+?\d{1,3}[ -]?\d{3,4}[ -]?\d{4,6}\b/, category: "Phone Number" },
];

type Status = "idle" | "running" | "safe" | "flagged";

export default function GatewayDemo() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [activeStep, setActiveStep] = useState(-1);
  const [flagCategory, setFlagCategory] = useState<string | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const runText = (text: string) => {
    if (!text.trim() || status === "running") return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStatus("running");
    setFlagCategory(null);
    system.logOnce("gateway-run", "gateway simulation engaged", "accent");

    const hit = SENSITIVE_PATTERNS.find((p) => p.re.test(text));
    // A flagged prompt stops at the policy check (index 4)
    const lastStep = hit ? 4 : PIPELINE.length - 1;

    for (let i = 0; i <= lastStep; i++) {
      timers.current.push(
        window.setTimeout(() => {
          setActiveStep(i);
          if (i === lastStep) {
            timers.current.push(
              window.setTimeout(() => {
                setStatus(hit ? "flagged" : "safe");
                setFlagCategory(hit?.category ?? null);
                setActiveStep(hit ? i : PIPELINE.length);
                system.log(
                  hit
                    ? `DLP: ${hit.category.toLowerCase()} detected → request denied · audit recorded`
                    : "request routed · audit log created",
                  hit ? "warn" : "ok",
                );
              }, 450),
            );
          }
        }, i * 450),
      );
    }
  };

  const run = () => runText(prompt);

  /** Scripted breach scenario — fills a sensitive sample and runs it. */
  const runSecurityTest = () => {
    if (status === "running") return;
    const sample = "Send the employee payroll information to my personal email";
    setPrompt(sample);
    system.log("security test: injecting sensitive prompt...", "warn");
    runText(sample);
  };

  return (
    <div className="glass rounded-lg p-6 md:p-8">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-display text-lg font-bold text-fg">Try the Gateway Pipeline</h3>
        <span className="font-mono text-[10px] tracking-[0.15em] text-dim">
          INTERACTIVE ARCHITECTURE SIMULATION
        </span>
      </div>
      <p className="mb-6 text-sm text-muted">
        Type a prompt and watch it move through the DLP pipeline. This is a visual simulation — your
        input stays in your browser and is never sent to any AI provider.
      </p>

      <div className="flex gap-2">
        <label htmlFor="gateway-demo-input" className="sr-only">
          Prompt to simulate
        </label>
        <input
          id="gateway-demo-input"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run()}
          placeholder='e.g. "Summarize this report" — or include an email address to trigger the DLP'
          className="w-full rounded border border-line bg-ink/70 px-4 py-3 text-sm text-fg placeholder:text-dim focus:border-cyan/50 focus:outline-none"
        />
        <button
          type="button"
          onClick={run}
          disabled={!prompt.trim() || status === "running"}
          className="inline-flex shrink-0 items-center gap-2 rounded bg-gradient-to-r from-cyan to-blue px-4 py-3 text-sm font-semibold text-ink transition-opacity disabled:opacity-40"
        >
          <SendHorizonal className="h-4 w-4" />
          <span className="hidden sm:inline">Send to AI</span>
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={runSecurityTest}
          disabled={status === "running"}
          className="inline-flex items-center gap-2 rounded border border-red-400/40 bg-red-400/5 px-3.5 py-2 font-mono text-[11px] tracking-[0.15em] text-red-400/90 transition-colors hover:bg-red-400/15 disabled:opacity-40"
        >
          <ShieldAlert className="h-3.5 w-3.5" />
          RUN SECURITY TEST
        </button>
        <span className="font-mono text-[10px] text-dim">
          injects a sensitive sample prompt and lets the DLP catch it
        </span>
      </div>

      <div className="mt-8 grid items-start gap-8 md:grid-cols-[1fr_auto]">
        <FlowDiagram compact steps={PIPELINE} activeIndex={activeStep} />

        <div className="flex min-w-[180px] flex-col items-center justify-center gap-3 rounded border border-line bg-ink/60 p-6 md:h-full">
          <div className="tech-label">Status</div>
          {status === "idle" && <div className="font-mono text-sm text-dim">AWAITING INPUT</div>}
          {status === "running" && (
            <div className="font-mono text-sm text-cyan [animation:pulse-soft_1s_ease-in-out_infinite]">
              PROCESSING…
            </div>
          )}
          {status === "safe" && (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-mint" />
              <span className="font-mono text-sm font-bold text-mint">SAFE REQUEST</span>
              <div className="space-y-1 text-center font-mono text-[10px] text-muted">
                <div>
                  ROUTED TO: <span className="text-fg">AI PROVIDER</span>
                </div>
                <div>
                  AUDIT LOG: <span className="text-mint">CREATED</span>
                </div>
              </div>
            </motion.div>
          )}
          {status === "flagged" && (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-2">
              <ShieldAlert className="h-8 w-8 text-red-400" />
              <span className="font-mono text-sm font-bold text-red-400">REQUEST DENIED</span>
              <div className="space-y-1 text-center font-mono text-[10px] text-muted">
                <div>
                  CATEGORY: <span className="text-amber-400">{flagCategory?.toUpperCase()}</span>
                </div>
                <div>
                  POLICY: <span className="text-red-400">BLOCK</span>
                </div>
                <div>
                  AUDIT: <span className="text-mint">RECORDED</span>
                </div>
              </div>
              <span className="mt-1 font-mono text-[10px] tracking-[0.25em] text-mint">
                SYSTEM PROTECTED
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
