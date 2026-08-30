import Reveal from "./Reveal";
import { useSystem } from "../lib/system";
import { projects } from "../data/projects";
import { JOURNEY_LABELS } from "../data/journeys";

/** Per-session recap shown above the contact CTA — only local, non-sensitive
 *  UI state (which systems were opened, chosen interest). */
export default function SessionSummary() {
  const visited = useSystem((s) => s.visitedProjects);
  const techs = useSystem((s) => s.inspectedTechs);
  const interest = useSystem((s) => s.interest);
  const discovery = useSystem((s) => s.discovery);

  const explored = [
    ...visited.map((id) => projects.find((p) => p.id === id)?.name.toUpperCase() ?? id),
    ...(techs.length >= 4 ? ["TECH STACK"] : []),
    ...(discovery ? ["DISCOVERY MODE"] : []),
  ];

  if (explored.length === 0 && !interest) return null;

  return (
    <Reveal className="mx-auto mb-14 max-w-md">
      <div className="glass rounded-lg p-5 text-left font-mono">
        <div className="text-[9px] tracking-[0.3em] text-dim">SESSION SUMMARY</div>
        {explored.length > 0 && (
          <>
            <div className="mt-3 text-[10px] tracking-[0.2em] text-muted">YOU EXPLORED</div>
            <ul className="mt-1.5 space-y-1">
              {explored.map((e) => (
                <li key={e} className="flex items-center gap-2 text-[11px] text-cyan">
                  <span className="h-1 w-1 rounded-full bg-cyan" aria-hidden="true" />
                  {e}
                </li>
              ))}
            </ul>
          </>
        )}
        {interest && (
          <div className="mt-3 flex items-center justify-between border-t border-line pt-3 text-[10px]">
            <span className="tracking-[0.2em] text-muted">INTEREST</span>
            <span className="text-mint">{JOURNEY_LABELS[interest] ?? interest}</span>
          </div>
        )}
        <div className="mt-3 text-center text-[10px] tracking-[0.25em] text-fg">
          READY TO CONNECT?
        </div>
      </div>
    </Reveal>
  );
}
