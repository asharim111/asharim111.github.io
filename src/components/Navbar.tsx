import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IdCard, Menu, X, Download, Moon, Search, Sun } from "lucide-react";
import { profile } from "../data/profile";
import { system, useSystem } from "../lib/system";
import { onResumeDownload } from "../lib/contact";
import { goToSection } from "../lib/navigate";
import { useScrollLock } from "../hooks/useScrollLock";
import StatusWidget from "./StatusWidget";
import WhatsAppButton from "./WhatsAppButton";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  // { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const theme = useSystem((s) => s.theme);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Shared, reference-counted — see useScrollLock for why this isn't a direct
  // write to body.style.overflow any more.
  useScrollLock(open);

  // Escape closes the drawer, like every other overlay on the site.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      data-print="hide"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass elev" : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8"
      >
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            goToSection("home");
          }}
          className="flex items-center gap-3"
          aria-label="Sharim Ansari — home"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded border border-cyan/40 font-display text-sm font-bold text-cyan">
            {profile.logoShort}
          </span>
          <span className="hidden font-mono text-xs tracking-[0.25em] text-fg lg:block">
            {profile.logoLong}
          </span>
        </a>

        <div className="hidden items-center gap-1 xl:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={(e) => {
                e.preventDefault();
                goToSection(l.href.slice(1));
              }}
              className="rounded px-3 py-2 text-sm text-muted transition-colors hover:text-fg"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <StatusWidget />

          <button
            type="button"
            onClick={() => system.toggleTheme()}
            aria-label={
              theme === "terminal"
                ? "Switch to daylight profile"
                : "Switch to terminal profile"
            }
            title={
              theme === "terminal" ? "Daylight profile" : "Terminal profile"
            }
            className="rounded border border-line p-2 text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
          >
            {theme === "terminal" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => system.setPaletteOpen(true)}
            aria-label="Open command palette (Ctrl+K)"
            title="Command palette · Ctrl+K"
            className="flex items-center gap-2 rounded border border-line px-2.5 py-2 text-muted transition-colors hover:border-cyan/40 hover:text-cyan"
          >
            <Search className="h-4 w-4" />
            <kbd className="hidden font-mono text-[9px] tracking-widest lg:block">
              CTRL K
            </kbd>
          </button>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              goToSection("contact");
            }}
            className="hidden rounded border border-cyan/40 bg-cyan/10 px-4 py-2 text-sm font-medium text-cyan transition-colors hover:bg-cyan/20 xl:block"
          >
            Let's Connect →
          </a>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded border border-line p-2 text-fg xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="glass overflow-hidden border-t border-line xl:hidden"
          >
            <div className="flex max-h-[calc(100dvh-4rem)] flex-col gap-1 overflow-y-auto px-4 py-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    goToSection(l.href.slice(1));
                  }}
                  className="rounded px-3 py-3 text-base text-fg transition-colors hover:bg-panel-2"
                >
                  {l.label}
                </a>
              ))}

              {/* Mobile is where WhatsApp actually gets used — it belongs in
                  the drawer, not only behind a floating button. */}
              <WhatsAppButton
                placement="nav-drawer"
                variant="row"
                label="Message on WhatsApp"
                className="mt-2"
                onDone={() => setOpen(false)}
              />

              <a
                href={profile.resumeFile}
                download
                onClick={() => {
                  setOpen(false);
                  onResumeDownload("nav-drawer");
                }}
                className="mt-1 flex items-center gap-2 rounded border border-line px-3 py-3 text-base text-fg"
              >
                <Download className="h-4 w-4" /> Download Resume
              </a>

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  system.setRecruiterOpen(true);
                }}
                className="mt-1 flex items-center gap-2 rounded border border-line px-3 py-3 text-left text-base text-fg"
              >
                <IdCard className="h-4 w-4" /> 15-Second Briefing
              </button>

              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  goToSection("contact");
                }}
                className="mt-1 rounded border border-cyan/40 bg-cyan/10 px-3 py-3 text-center text-base font-medium text-cyan"
              >
                Let's Connect →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
