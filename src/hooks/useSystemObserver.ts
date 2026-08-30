import { useEffect } from "react";
import { system, SECTION_LOGS } from "../lib/system";
import { track } from "../lib/analytics";
import { profile } from "../data/profile";
import {
  whatsappHref,
  mailtoHref,
  onWhatsAppOpen,
  onEmailOpen,
  onResumeDownload,
} from "../lib/contact";

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

/** ~24s of retries is plenty for the lazy chunks; after that, stop polling. */
const ATTACH_RETRIES = 30;

/** Watches sections + visitor behaviour and narrates through SHARIM.OS.
 *  All observers are passive; nothing here forces React re-renders outside
 *  the subscribed widgets. */
export function useSystemObserver() {
  // Active-section tracking + per-section console narration
  useEffect(() => {
    /** Report each section once — scrolling back up is not a second visit. */
    const reported = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          system.setSection(id);
          if (!reported.has(id)) {
            reported.add(id);
            track("section_view", { section: id });
          }
          const logs = SECTION_LOGS[id];
          if (logs && !system.hasFired(`section-${id}`)) {
            system.markFired(`section-${id}`);
            logs.forEach(([text, kind], i) => {
              window.setTimeout(() => system.logOnce(`section-${id}-${i}`, text, kind), i * 260);
            });
          }
        }
      },
      { rootMargin: "-38% 0px -52% 0px" },
    );

    // Sections mount lazily — retry attach until all are present. If the page
    // loaded with a hash pointing at a section that wasn't mounted yet, honor
    // it once the target appears. Bounded, so a chunk that never loads doesn't
    // leave a timer running for the life of the page.
    const attached = new Set<string>();
    let pendingHash = window.location.hash.slice(1);
    let attempts = 0;
    let timer = 0;

    const attach = () => {
      for (const id of SECTION_IDS) {
        if (attached.has(id)) continue;
        const el = document.getElementById(id);
        if (el) {
          observer.observe(el);
          attached.add(id);
          if (pendingHash === id) {
            el.scrollIntoView();
            pendingHash = "";
          }
        }
      }
      if (attached.size < SECTION_IDS.length && ++attempts < ATTACH_RETRIES) {
        timer = window.setTimeout(attach, 800);
      }
    };
    timer = window.setTimeout(attach, 300);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // First scroll + "that was fast" bottom detection
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 80) {
        system.logOnce("first-scroll", "exploring the architecture...", "info");
      }
      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200;
      if (nearBottom && system.secondsSinceLoad() < 20) {
        system.logOnce("fast-bottom", "that was fast.", "warn");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Dwell-on-skills easter egg
  useEffect(() => {
    let dwellTimer = 0;
    const unsub = system.subscribe(() => {
      const s = system.get();
      clearTimeout(dwellTimer);
      if (s.activeSection === "skills" && !system.hasFired("skills-dwell")) {
        dwellTimer = window.setTimeout(() => {
          if (system.get().activeSection === "skills") {
            system.logOnce("skills-dwell", "you're checking the stack. good choice.", "accent");
          }
        }, 8000);
      }
    });
    return () => {
      clearTimeout(dwellTimer);
      unsub();
    };
  }, []);

  useIdlePrompt();
}

const IDLE_MS = 60_000;
const MAX_PROMPTS = 2;

/**
 * Idle behaviour, in-theme.
 *
 * After a minute of no interaction the console offers the three things a
 * stalled visitor actually wants, as buttons on a log line — no modal, no
 * overlay, nothing that interrupts. It fires at most twice, never while the tab
 * is hidden, and never below `sm`, where the console isn't rendered at all and
 * the comms dock already carries WhatsApp.
 */
function useIdlePrompt() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    let timer = 0;
    let fired = 0;

    const prompt = () => {
      if (document.hidden || window.innerWidth < 640) return schedule();
      fired += 1;
      track("idle_prompt", { count: fired });

      system.setConsoleOpen(true);
      system.log("session idle — need anything?", "warn", {
        actions: [
          {
            label: "RESUME",
            run: () => {
              const a = document.createElement("a");
              a.href = profile.resumeFile;
              a.download = "";
              a.rel = "noopener";
              a.click();
              onResumeDownload("idle-prompt");
            },
          },
          {
            label: "WHATSAPP",
            run: () => {
              onWhatsAppOpen("idle-prompt");
              window.open(whatsappHref(), "_blank", "noopener,noreferrer");
            },
          },
          {
            label: "EMAIL",
            run: () => {
              onEmailOpen("idle-prompt");
              window.location.href = mailtoHref();
            },
          },
        ],
      });

      if (fired < MAX_PROMPTS) schedule();
    };

    const schedule = () => {
      clearTimeout(timer);
      if (fired >= MAX_PROMPTS) return;
      // Second nudge waits noticeably longer — once is a hint, twice is a pest.
      timer = window.setTimeout(prompt, IDLE_MS * (fired + 1));
    };

    // pointermove fires hundreds of times a second; rescheduling the timer on
    // every one is pure churn. One reset per second is indistinguishable to a
    // 60-second timeout.
    let lastReset = 0;
    const reset = () => {
      if (fired >= MAX_PROMPTS) return;
      const now = Date.now();
      if (now - lastReset < 1000) return;
      lastReset = now;
      schedule();
    };

    const events: Array<keyof WindowEventMap> = [
      "pointerdown",
      "pointermove",
      "keydown",
      "scroll",
      "wheel",
    ];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    document.addEventListener("visibilitychange", reset);
    schedule();

    return () => {
      clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, reset));
      document.removeEventListener("visibilitychange", reset);
    };
  }, []);
}
