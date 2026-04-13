import type { LearningResource } from "@/lib/types";
import { ExternalLink } from "lucide-react";

interface ResourceCardProps {
  resource: LearningResource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      id={`resource-${resource.id}`}
      className="flat-card group block p-4 sm:p-5 fade-in-up flex flex-col justify-between"
    >
      <div>
        {/* Top row: source + free tag */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[var(--muted)] font-medium underline underline-offset-4 decoration-[var(--border-2)]">
            {resource.source}
          </span>
          <span className="text-[10px] uppercase tracking-wider font-bold bg-[var(--foreground)] text-[var(--surface)] px-2 py-0.5 rounded-sm">
            Free
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-[15px] font-semibold tracking-tight text-[var(--foreground)] leading-snug mt-1 border-l-2 border-transparent group-hover:border-[var(--foreground)] pl-0 group-hover:pl-2 transition-all duration-200">
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-[13px] text-[var(--muted)] mt-2 line-clamp-3 leading-relaxed">
          {resource.description}
        </p>
      </div>

      <div>
        {/* Bottom row: difficulty + tags + link */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-3">
            <span className="diff-badge">
              {resource.difficulty}
            </span>
            <span className="text-[11px] text-[var(--muted)] hidden sm:inline-block truncate max-w-[120px]">
              {resource.tags.slice(0, 2).join(", ")}
            </span>
          </div>
          <ExternalLink
            size={14}
            className="text-[var(--muted)] group-hover:text-[var(--foreground)] transition-colors duration-200"
          />
        </div>
      </div>
    </a>
  );
}
