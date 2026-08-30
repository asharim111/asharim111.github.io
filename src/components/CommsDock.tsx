import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import BackToTop from "./BackToTop";
import { WhatsAppGlyph } from "./WhatsAppButton";
import { whatsappHref, onWhatsAppOpen } from "../lib/contact";
import { profile } from "../data/profile";

/**
 * The bottom-right comms dock.
 *
 * One fixed column owns every floating control on this side of the screen, so
 * spacing is decided in exactly one place — the previous back-to-top button
 * sat at the same coordinates a naive WhatsApp bubble would have claimed. New
 * controls are added as children, not as another set of magic offsets.
 *
 * Layer map, for whoever adds the next one:
 *   z-40  section rail (right edge, desktop)
 *   z-50  navbar
 *   z-55  this dock · system console (bottom-left)
 *   z-70+ modals, palette, boot
 *
 * Reveal is deliberately late — a chat bubble that appears over the hero in
 * the first second reads as a lead-gen widget, not as an engineer's contact.
 */
export default function CommsDock() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const evaluate = () => {
      frame = 0;
      setVisible(window.scrollY > 600);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(evaluate);
    };

    evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      data-print="hide"
      className="pointer-events-none fixed bottom-4 right-4 z-[55] flex flex-col items-end gap-3 md:bottom-6 md:right-6"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            key="dock"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.22 }}
            className="pointer-events-auto flex flex-col items-end gap-3"
          >
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => onWhatsAppOpen("dock")}
              aria-label={`Message Sharim on WhatsApp at ${profile.phone}`}
              className="glass elev group flex h-12 items-center overflow-hidden rounded-full text-mint transition-colors hover:border-mint/50 hover:text-[#25D366] focus-visible:text-[#25D366]"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center">
                <WhatsAppGlyph className="h-[18px] w-[18px] transition-transform duration-200 group-hover:scale-110" />
              </span>
              {/* Width, not display: an expanding label animates; a hidden one pops. */}
              <span className="max-w-0 overflow-hidden whitespace-nowrap font-mono text-[10px] tracking-[0.18em] opacity-0 transition-[max-width,opacity,padding] duration-300 group-hover:max-w-[210px] group-hover:pr-5 group-hover:opacity-100 group-focus-visible:max-w-[210px] group-focus-visible:pr-5 group-focus-visible:opacity-100">
                CHANNEL: WHATSAPP
                <span className="ml-2 text-mint">· ONLINE</span>
              </span>
            </a>

            <BackToTop />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
