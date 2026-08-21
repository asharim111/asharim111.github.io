import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp } from "lucide-react";

/** Theme-matched back-to-top control — appears after the visitor scrolls past
 *  the hero, bottom-right, clear of the SHARIM.OS console pill. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
          aria-label="Back to top"
          title="Back to top"
          className="glass group fixed bottom-4 right-4 z-[55] flex h-11 w-11 items-center justify-center rounded-full shadow-lg shadow-black/40 transition-colors hover:border-cyan/50 md:bottom-6 md:right-6"
        >
          <ArrowUp className="h-4 w-4 text-muted transition-all duration-200 group-hover:-translate-y-0.5 group-hover:text-cyan" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
