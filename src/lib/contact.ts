import { profile } from "../data/profile";
import { system } from "./system";
import { track } from "./analytics";

/**
 * Outbound contact channels.
 *
 * The WhatsApp draft is composed from what the visitor actually did on the
 * page — the system opened, or the interest chosen — because a pre-filled
 * first line is what gets a message sent. Nothing leaves the browser until
 * the visitor taps the link, and only the message text travels with it.
 */

/** wa.me wants digits only, no `+`, no separators. */
export const whatsappNumber = profile.phone.replace(/\D/g, "");

const INTEREST_CONTEXT: Record<string, string> = {
  "ai-security": "your AI Gateway and the DLP side of things",
  "full-stack": "your full stack work",
  enterprise: "the enterprise systems you've built",
  automation: "your workflow automation work",
  exploring: "your portfolio",
};

/** The most specific thing we can honestly say the visitor was looking at.
 *  Read from the store rather than the projects data — this module is on the
 *  eager path and must not drag the full case-study corpus with it. */
export function conversationContext(): string {
  const { lastProject, interest, activeSection } = system.get();

  if (lastProject) return `your ${lastProject} system`;

  if (interest && INTEREST_CONTEXT[interest]) return INTEREST_CONTEXT[interest];

  if (activeSection === "ai-security") return "your AI Gateway";
  if (activeSection === "experience") return "your engineering experience";
  if (activeSection === "architecture") return "your architecture work";

  return "your portfolio";
}

export function whatsappMessage() {
  return `Hi Sharim — I came from your portfolio, was looking at ${conversationContext()}. I wanted to ask about `;
}

export function whatsappHref() {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage())}`;
}

export function mailtoHref(subject = "Portfolio enquiry") {
  const body = `Hi Sharim,\n\nI came from your portfolio, was looking at ${conversationContext()}.\n\n`;
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export const telHref = `tel:${profile.phone.replace(/[^+\d]/g, "")}`;

/** Shared side-effects for any WhatsApp entry point. The anchor still does the
 *  navigating — this only narrates and reports. */
export function onWhatsAppOpen(placement: string) {
  track("whatsapp_click", { placement });
  system.log("opening secure channel → whatsapp", "accent");
  system.logOnce("wa-hint", "drafted with what you were looking at — edit before sending.", "info");
}

export function onResumeDownload(placement: string) {
  track("resume_download", { placement });
  system.log("resume.pdf → downloading", "ok");
}

export function onEmailOpen(placement: string) {
  track("email_click", { placement });
  system.log("composing mail draft…", "accent");
}
