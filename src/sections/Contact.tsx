import { ArrowRight, Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import Reveal from "../components/Reveal";
import ParticleField from "../components/ParticleField";
import { profile } from "../data/profile";

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-line">
      <ParticleField className="absolute inset-0 h-full w-full opacity-70" density={0.4} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.1),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-5xl px-4 py-28 text-center md:px-8 md:py-40">
        <Reveal>
          <p className="tech-label mb-6 text-cyan">09 / CONTACT</p>
          <h2 className="font-display text-4xl font-bold tracking-tight text-fg md:text-6xl">
            Let's Build Something{" "}
            <span className="bg-gradient-to-r from-cyan via-blue to-violet bg-clip-text text-transparent">
              Intelligent.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted md:text-lg">
            Have a complex application, automation challenge, AI integration, or enterprise system in
            mind?
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center gap-2 rounded bg-gradient-to-r from-cyan to-blue px-7 py-3.5 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
          >
            Start a Conversation <ArrowRight className="h-4 w-4" />
          </a>
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
