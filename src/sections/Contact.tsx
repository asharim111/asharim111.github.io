import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Github, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";
import Reveal from "../components/Reveal";
import ParticleField from "../components/ParticleField";
import Magnetic from "../components/Magnetic";
import SessionSummary from "../components/SessionSummary";
import { profile } from "../data/profile";
import { system } from "../lib/system";

/** "Connection interface" — composes a real mailto: draft in the visitor's
 *  own mail client. Nothing is sent by the site itself; no backend exists. */
function ConnectionForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio contact${name ? ` — ${name}` : ""}`);
    const body = encodeURIComponent(
      `${message}\n\n—\n${name}${email ? `\n${email}` : ""}`,
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
    system.log("transmission handed to mail client", "ok");
  };

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={submit}
      className="mx-auto max-w-md overflow-hidden text-left"
    >
      <div className="glass mt-8 rounded-lg p-6 font-mono">
        <div className="text-[9px] tracking-[0.3em] text-cyan">INITIALIZING CONNECTION...</div>

        <label className="mt-4 block text-[10px] tracking-[0.2em] text-muted" htmlFor="cf-name">
          NAME
        </label>
        <input
          id="cf-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded border border-line bg-ink/70 px-3 py-2 text-sm text-fg focus:border-cyan/50 focus:outline-none"
        />

        <label className="mt-4 block text-[10px] tracking-[0.2em] text-muted" htmlFor="cf-email">
          EMAIL
        </label>
        <input
          id="cf-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded border border-line bg-ink/70 px-3 py-2 text-sm text-fg focus:border-cyan/50 focus:outline-none"
        />

        <label className="mt-4 block text-[10px] tracking-[0.2em] text-muted" htmlFor="cf-message">
          MESSAGE
        </label>
        <textarea
          id="cf-message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full resize-y rounded border border-line bg-ink/70 px-3 py-2 text-sm text-fg focus:border-cyan/50 focus:outline-none"
        />

        <button
          type="submit"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded bg-gradient-to-r from-cyan to-blue px-5 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.02]"
        >
          <Send className="h-4 w-4" /> SEND REQUEST
        </button>

        <p className="mt-3 text-center text-[10px] leading-relaxed text-dim">
          {sent
            ? "TRANSMISSION HANDED TO YOUR MAIL CLIENT — thanks for reaching out."
            : "opens a pre-filled draft in your own mail client — nothing is sent by this site"}
        </p>
      </div>
    </motion.form>
  );
}

export default function Contact() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line">
      <ParticleField className="absolute inset-0 h-full w-full opacity-70" density={0.4} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.1),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-5xl px-4 py-28 text-center md:px-8 md:py-40">
        <SessionSummary />

        <Reveal>
          <p className="tech-label mb-3 text-cyan">09 / CONTACT</p>
          <p className="mb-6 font-mono text-[10px] tracking-[0.35em] text-mint">
            CONNECTION ENDPOINT · SYSTEM READY
          </p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-fg md:text-6xl">
            Let's Build Something{" "}
            <span className="bg-gradient-to-r from-cyan via-blue to-violet bg-clip-text text-transparent">
              Intelligent.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted md:text-lg">
            Have a complex application, automation challenge, AI integration, or enterprise system in
            mind? What would you like to build?
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Magnetic>
            <button
              type="button"
              onClick={() => {
                setFormOpen((v) => !v);
                if (!formOpen) system.log("initializing connection...", "accent");
              }}
              aria-expanded={formOpen}
              className="inline-flex items-center gap-2 rounded bg-gradient-to-r from-cyan to-blue px-7 py-3.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
            >
              Start a Conversation <ArrowRight className="h-4 w-4" />
            </button>
          </Magnetic>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded border border-line-bright px-6 py-3.5 text-sm font-medium text-fg transition-colors hover:border-cyan/50 hover:text-cyan"
          >
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded border border-line-bright px-6 py-3.5 text-sm font-medium text-fg transition-colors hover:border-cyan/50 hover:text-cyan"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>
        </Reveal>

        <AnimatePresence>{formOpen && <ConnectionForm />}</AnimatePresence>

        <Reveal delay={0.25} className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          <a href={`mailto:${profile.email}`} className="flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-cyan">
            <Mail className="h-4 w-4" /> {profile.email}
          </a>
          <a href={`tel:${profile.phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-cyan">
            <Phone className="h-4 w-4" /> {profile.phone}
          </a>
          <span className="flex items-center gap-2 font-mono text-sm text-muted">
            <MapPin className="h-4 w-4" /> {profile.location}
          </span>
        </Reveal>
      </div>
    </section>
  );
}
