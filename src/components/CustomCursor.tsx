import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useIsDesktop } from "../hooks/useMediaQuery";

/** Dot + trailing ring cursor. Ring expands on interactive elements and
 *  shows "VIEW" over project cards ([data-cursor="view"]). Desktop only. */
export default function CustomCursor() {
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"default" | "hover" | "view">("default");

  useEffect(() => {
    if (!isDesktop || reduced) return;

    const pos = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      const target = e.target as HTMLElement;
      if (target.closest('[data-cursor="view"]')) setMode("view");
      else if (target.closest("a, button, [role='button'], input, textarea, select")) setMode("hover");
      else setMode("default");
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
          mode === "view"
            ? "h-14 w-14 border-cyan/60 bg-ink/70"
            : mode === "hover"
              ? "h-10 w-10 border-cyan/50"
              : "h-7 w-7 border-line-bright"
        }`}
      >
        {mode === "view" && (
          <span className="font-mono text-[9px] tracking-[0.2em] text-cyan">VIEW</span>
        )}
      </div>
    </>
  );
}
