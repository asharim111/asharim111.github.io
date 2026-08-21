import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
import { useIsDesktop } from "../hooks/useMediaQuery";

/** Wrapper that nudges its child a few pixels toward the cursor. Subtle by
 *  design; disabled on touch devices and under reduced motion. */
export default function Magnetic({ children, strength = 0.18 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();
  const reduced = useReducedMotion();

  if (!desktop || reduced) return <>{children}</>;

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
  };

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block transition-transform duration-200 ease-out will-change-transform"
    >
      {children}
    </div>
  );
}
