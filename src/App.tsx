import { lazy, Suspense, useEffect, type ReactNode } from "react";
import { AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import CustomCursor from "./components/CustomCursor";
import Footer from "./components/Footer";
import BootScreen from "./components/BootScreen";
import SystemConsole from "./components/SystemConsole";
import CommandPalette from "./components/CommandPalette";
import SectionRail from "./components/SectionRail";
import CommsDock from "./components/CommsDock";
import InterestSelector from "./components/InterestSelector";
import Hero from "./sections/Hero";
import MetricsStrip from "./sections/MetricsStrip";
import About from "./sections/About";
import { useSystemObserver } from "./hooks/useSystemObserver";
import { system, useSystem } from "./lib/system";
import { sectionOrder } from "./data/journeys";
import { initAnalytics } from "./lib/analytics";

// Below-the-fold sections are code-split
const ExperienceSection = lazy(() => import("./sections/ExperienceSection"));
const Projects = lazy(() => import("./sections/Projects"));
const ArchitectureLab = lazy(() => import("./sections/ArchitectureLab"));
const AISecurity = lazy(() => import("./sections/AISecurity"));
const Skills = lazy(() => import("./sections/Skills"));
const Education = lazy(() => import("./sections/Education"));
const SystemMetrics = lazy(() => import("./sections/SystemMetrics"));
const Contact = lazy(() => import("./sections/Contact"));

// Opened by a minority of visitors — no reason for it to be in the first chunk.
const RecruiterMode = lazy(() => import("./components/RecruiterMode"));

/**
 * Ordered slot.
 *
 * Choosing an interest resequences the portfolio via CSS `order` rather than by
 * reordering the tree. Nothing unmounts, no lazy chunk reloads, every `#anchor`
 * keeps working, and the scroll-spy observer — which watches elements, not
 * positions — is untouched. Reordering the JSX would have re-run every reveal
 * animation and thrown away the mounted state of the sections below.
 */
function Slot({ order, children }: { order: number; children: ReactNode }) {
  return <div style={{ order }}>{children}</div>;
}

export default function App() {
  useSystemObserver();

  const interest = useSystem((s) => s.interest);
  const recruiterOpen = useSystem((s) => s.recruiterOpen);
  const order = sectionOrder(interest);

  useEffect(() => {
    initAnalytics();
  }, []);

  return (
    <>
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] focus:rounded focus:bg-panel focus:px-4 focus:py-2 focus:text-fg"
      >
        Skip to content
      </a>
      <BootScreen />
      <ScrollProgress />
      <CustomCursor />
      <CommandPalette />
      <SectionRail />
      <SystemConsole />
      <CommsDock />
      <Navbar />

      <main className="flex flex-col">
        <Slot order={0}>
          <Hero />
        </Slot>
        <Slot order={0}>
          <MetricsStrip />
        </Slot>
        <Slot order={0}>
          <InterestSelector />
        </Slot>

        <Slot order={order.about}>
          <About />
        </Slot>

        <Suspense
          fallback={
            <div className="py-32 text-center font-mono text-xs text-dim">LOADING…</div>
          }
        >
          <Slot order={order.experience}>
            <ExperienceSection />
          </Slot>
          <Slot order={order.projects}>
            <Projects />
          </Slot>
          <Slot order={order.architecture}>
            <ArchitectureLab />
          </Slot>
          <Slot order={order["ai-security"]}>
            <AISecurity />
          </Slot>
          <Slot order={order.skills}>
            <Skills />
          </Slot>
          <Slot order={order.education}>
            <Education />
          </Slot>
          <Slot order={order.metrics}>
            <SystemMetrics />
          </Slot>
          {/* Contact is always last — it's the destination, whatever the route. */}
          <Slot order={99}>
            <Contact />
          </Slot>
        </Suspense>
      </main>

      <Footer />

      <Suspense fallback={null}>
        <AnimatePresence>
          {recruiterOpen && <RecruiterMode onClose={() => system.setRecruiterOpen(false)} />}
        </AnimatePresence>
      </Suspense>
    </>
  );
}
