import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import CustomCursor from "./components/CustomCursor";
import Footer from "./components/Footer";
import BootScreen from "./components/BootScreen";
import SystemConsole from "./components/SystemConsole";
import CommandPalette from "./components/CommandPalette";
import SectionRail from "./components/SectionRail";
import BackToTop from "./components/BackToTop";
import InterestSelector from "./components/InterestSelector";
import Hero from "./sections/Hero";
import MetricsStrip from "./sections/MetricsStrip";
import About from "./sections/About";
import { useSystemObserver } from "./hooks/useSystemObserver";

// Below-the-fold sections are code-split
const ExperienceSection = lazy(() => import("./sections/ExperienceSection"));
const Projects = lazy(() => import("./sections/Projects"));
const ArchitectureLab = lazy(() => import("./sections/ArchitectureLab"));
const AISecurity = lazy(() => import("./sections/AISecurity"));
const Skills = lazy(() => import("./sections/Skills"));
const Education = lazy(() => import("./sections/Education"));
const SystemMetrics = lazy(() => import("./sections/SystemMetrics"));
const Contact = lazy(() => import("./sections/Contact"));

export default function App() {
  useSystemObserver();

  return (
    <>
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded focus:bg-panel focus:px-4 focus:py-2 focus:text-fg"
      >
        Skip to content
      </a>
      <BootScreen />
      <ScrollProgress />
      <CustomCursor />
      <CommandPalette />
      <SectionRail />
      <SystemConsole />
      <BackToTop />
      <Navbar />
      <main>
        <Hero />
        <MetricsStrip />
        <InterestSelector />
        <About />
        <Suspense fallback={<div className="py-32 text-center font-mono text-xs text-dim">LOADING…</div>}>
          <ExperienceSection />
          <Projects />
          <ArchitectureLab />
          <AISecurity />
          <Skills />
          <Education />
          <SystemMetrics />
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
