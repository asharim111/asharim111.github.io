import { lazy, Suspense } from "react";
import Navbar from "./components/Navbar";
import ScrollProgress from "./components/ScrollProgress";
import CustomCursor from "./components/CustomCursor";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import MetricsStrip from "./sections/MetricsStrip";
import About from "./sections/About";

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
  return (
    <>
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded focus:bg-panel focus:px-4 focus:py-2 focus:text-fg"
      >
        Skip to content
      </a>
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <MetricsStrip />
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
