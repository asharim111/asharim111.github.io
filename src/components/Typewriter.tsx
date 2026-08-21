import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/** Types out text character by character with a caret. Renders the full
 *  string immediately under reduced motion. Screen readers get the full
 *  text via aria-label from the start. */
export default function Typewriter({
  text,
  speed = 42,
  startDelay = 0,
  className,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(reduced ? text.length : 0);
  const done = count >= text.length;

  useEffect(() => {
    if (reduced) return;
    let i = 0;
    let interval = 0;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) clearInterval(interval);
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [text, speed, startDelay, reduced]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, count)}</span>
      {!done && (
        <span aria-hidden="true" className="text-cyan [animation:pulse-soft_0.8s_ease-in-out_infinite]">
          _
        </span>
      )}
    </span>
  );
}
