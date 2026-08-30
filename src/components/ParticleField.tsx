import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useSystem } from "../lib/system";
import { isConstrainedDevice } from "../lib/telemetry";

interface ParticleFieldProps {
  className?: string;
  /** Particles per 10,000 px² — tuned down automatically on small screens. */
  density?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/**
 * Lightweight canvas particle network with connection lines and gentle drift.
 *
 * Colours are read from the CSS custom properties rather than hard-coded, so
 * the field follows the theme; the effect re-runs when the theme changes. The
 * loop is paused off-screen *and* in a background tab, and the density drops on
 * a metered connection or a low-memory device — two canvases quietly burning
 * frames behind another tab is real battery on a phone.
 */
export default function ParticleField({ className, density = 0.55 }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const theme = useSystem((s) => s.theme);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const styles = getComputedStyle(document.documentElement);
    const dotColor = styles.getPropertyValue("--particle-dot").trim() || "rgba(34,211,238,0.45)";
    const linkRgb = styles.getPropertyValue("--particle-link").trim() || "56, 130, 246";
    const linkAlpha = Number(styles.getPropertyValue("--particle-link-alpha")) || 0.14;

    const lean = isConstrainedDevice();

    let particles: Particle[] = [];
    let raf = 0;
    let width = 0;
    let height = 0;
    let onScreen = false;
    const dpr = Math.min(window.devicePixelRatio || 1, lean ? 1 : 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isSmall = window.innerWidth < 768;
      const factor = density * (isSmall ? 0.4 : 1) * (lean ? 0.5 : 1);
      const count = Math.min(lean ? 40 : 90, Math.floor(((width * height) / 10000) * factor));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    };

    const LINK_DIST = 130;

    const step = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }

      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = `rgba(${linkRgb}, ${linkAlpha * (1 - dist / LINK_DIST)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = dotColor;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    };

    /** Single source of truth for "should the loop be running". */
    const sync = () => {
      const shouldRun = onScreen && !document.hidden;
      if (shouldRun && !raf) raf = requestAnimationFrame(step);
      else if (!shouldRun && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    resize();

    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    observer.observe(canvas);

    const onResize = () => {
      resize();
      // A resize while paused shouldn't restart the loop.
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      sync();
    };

    document.addEventListener("visibilitychange", sync);
    window.addEventListener("resize", onResize);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", onResize);
    };
  }, [density, reduced, theme]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
