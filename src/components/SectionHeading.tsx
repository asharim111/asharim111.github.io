import Reveal from "./Reveal";

interface SectionHeadingProps {
  index: string;
  label: string;
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ index, label, title, subtitle }: SectionHeadingProps) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <div className="flex items-center gap-4 mb-5">
        <span className="tech-label text-cyan">{index} / {label}</span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
      </div>
      <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-fg">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 max-w-2xl text-muted text-base md:text-lg leading-relaxed">{subtitle}</p>
      )}
    </Reveal>
  );
}
