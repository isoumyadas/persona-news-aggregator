"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FinanceSourceGroup } from "@/lib/types";
import NewsCard from "./NewsCard";

interface SourceSectionProps {
  group: FinanceSourceGroup;
  defaultOpen?: boolean;
}

export default function SourceSection({ group, defaultOpen = true }: SourceSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="fade-in-up" id={`source-${group.sourceName.replace(/\s+/g, "-").toLowerCase()}`}>
      {/* Section header — clickable to toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="section-toggle w-full flex items-center justify-between gap-4 py-4 px-5 rounded-xl mb-3"
      >
        <div className="flex items-center gap-3">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: group.sourceColor }}
          />
          <h2 className="text-lg font-bold text-[var(--foreground)] tracking-tight">
            {group.sourceName}
          </h2>
          <span className="text-xs text-[var(--muted)] font-medium bg-[var(--surface-2)] px-2.5 py-0.5 rounded-full">
            {group.articles.length} articles
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`chevron-icon text-[var(--muted)] ${open ? "open" : ""}`}
        />
      </button>

      {/* Collapsible content */}
      <div
        className={`overflow-hidden transition-all duration-400 ease-in-out ${
          open ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children pb-2">
          {group.articles.map((article, i) => (
            <NewsCard key={article.id} article={article} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
