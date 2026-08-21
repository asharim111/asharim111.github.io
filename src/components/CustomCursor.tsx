import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useIsDesktop } from "../hooks/useMediaQuery";

const LABELS: Record<string, string> = {
  view: "EXPLORE",
  inspect: "INSPECT",
  details: "DETAILS",
  open: "OPEN",
};

type Mode = "default" | "hover" | keyof typeof LABELS;

/** Dot + trailing ring cursor. The ring expands on interactive elements and
 *  shows a contextual verb over annotated zones ([data-cursor="view|inspect|
 *  details|open"]). Desktop only. */
export default function CustomCursor() {
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("default");

  useEffect(() => {
    if (!isDesktop || reduced) return;

    const pos = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const target = e.target as HTMLElement;
      const zone = target.closest<HTMLElement>("[data-cursor]");
      if (zone && LABELS[zone.dataset.cursor ?? ""]) {
        setMode(zone.dataset.cursor as Mode);
      } else if (target.closest("a, button, [role='button'], input, textarea, select")) {
        setMode("hover");
      } else {
        setMode("default");
      }
    };

    const tick = () => {
      ring.x += (pos.x - ring.x) * 0.18;
      ring.y += (pos.y - ring.y) * 0.18;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ring.x}px, ${ring.y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [isDesktop, reduced]);

  if (!isDesktop || reduced) return null;

  const label = LABELS[mode];

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-cyan"
      />
      <div
        ref={ringRef}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[100] flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color] duration-200 ${
          label
            ? "h-14 w-14 border-cyan/60 bg-ink/70"
            : mode === "hover"
              ? "h-10 w-10 border-cyan/50"
              : "h-7 w-7 border-line-bright"
        }`}
      >
        {label && (
          <span className="font-mono text-[9px] tracking-[0.2em] text-cyan">{label}</span>
        )}
      </div>
    </>
  );
}
