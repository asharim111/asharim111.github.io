import { useEffect } from "react";
import { system, SECTION_LOGS } from "../lib/system";

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

/** Watches sections + visitor behaviour and narrates through SHARIM.OS.
 *  All observers are passive; nothing here forces React re-renders outside
 *  the subscribed widgets. */
export function useSystemObserver() {
  // Active-section tracking + per-section console narration
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          system.setSection(id);
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
    // it once the target appears.
    const attached = new Set<string>();
    let pendingHash = window.location.hash.slice(1);
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
      if (attached.size < SECTION_IDS.length) timer = window.setTimeout(attach, 800);
    };
    let timer = window.setTimeout(attach, 300);

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
}
