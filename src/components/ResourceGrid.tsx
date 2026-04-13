import type { LearningResource } from "@/lib/types";
import ResourceCard from "./ResourceCard";

interface ResourceGridProps {
  resources: LearningResource[];
}

const PHASE_LABELS: Record<number, { title: string; description: string }> = {
  1: { title: "Foundations", description: "Understand money, banking, inflation, and how markets exist" },
  2: { title: "Personal Finance Mastery", description: "Budget, save, invest via SIPs, understand PPF/NPS/EPF/insurance" },
  3: { title: "Markets & Investing", description: "Read charts, analyze companies, understand F&O basics" },
  4: { title: "Corporate Finance & Valuation", description: "Value companies like an analyst, understand global macro" },
  5: { title: "Tools & Practice", description: "Apply knowledge using real-world tools & official data" },
};

export default function ResourceGrid({ resources }: ResourceGridProps) {
  // Group resources by phase
  const phases = new Map<number, LearningResource[]>();
  for (const r of resources) {
    const list = phases.get(r.phase) || [];
    list.push(r);
    phases.set(r.phase, list);
  }

  const sortedPhases = Array.from(phases.entries()).sort((a, b) => a[0] - b[0]);

  return (
    <div className="space-y-12">
      {sortedPhases.map(([phase, items]) => {
        const label = PHASE_LABELS[phase];
        return (
          <section key={phase} className="fade-in-up" id={`phase-${phase}`}>
            {/* Minimalist Phase Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 border-b border-[var(--border)] pb-3">
              <span className="text-[11px] font-bold tracking-[0.1em] text-[var(--muted)] uppercase shrink-0">
                Phase 0{phase}
              </span>
              <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">
                {label?.title ?? "Category"}
              </h2>
              {label?.description && (
                <span className="text-[13px] text-[var(--muted)] hidden lg:inline-block">
                  — {label.description}
                </span>
              )}
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
              {items
                .sort((a, b) => a.stepNumber - b.stepNumber)
                .map((r) => (
                  <ResourceCard key={r.id} resource={r} />
                ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
