"use client";

import { useState } from "react";
import type { FinanceSourceGroup } from "@/lib/types";
import NewsCard from "./NewsCard";
import LoadingGrid from "./LoadingGrid";

interface SourceTabsViewProps {
  groups: FinanceSourceGroup[];
}

export default function SourceTabsView({ groups }: SourceTabsViewProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (groups.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flat-card p-8 text-center max-w-md w-full">
          <p className="text-2xl mb-3">🔍</p>
          <p className="text-[var(--muted)] text-sm">
            No news available. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  const activeGroup = groups[activeIndex];

  return (
    <div>
      {/* Source tab buttons — minimalist underline style */}
      <div className="flex items-center gap-6 mb-8 overflow-x-auto no-scrollbar border-b border-[var(--border)]" id="source-tabs">
        {groups.map((group, i) => {
          const isActive = i === activeIndex;
          return (
            <button
              key={group.sourceName}
              onClick={() => setActiveIndex(i)}
              id={`source-tab-${group.sourceName.replace(/[\s\/]+/g, "-").toLowerCase()}`}
              className={`
                flex items-center gap-2 py-3 text-sm font-medium
                whitespace-nowrap transition-colors cursor-pointer outline-none relative
                ${isActive
                  ? "text-[var(--foreground)]"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }
              `}
            >
              {group.sourceName}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${
                isActive
                  ? "bg-[var(--foreground)] text-[var(--surface)]"
                  : "bg-[var(--surface-2)] text-[var(--muted)]"
              }`}>
                {group.articles.length}
              </span>
              
              {/* Active Underline */}
              {isActive && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[var(--foreground)] rounded-t-sm" />
              )}
            </button>
          );
        })}
      </div>

      {/* Articles grid */}
      {activeGroup.articles.length === 0 ? (
        <LoadingGrid />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children" key={activeGroup.sourceName}>
          {activeGroup.articles.map((article, i) => (
            <NewsCard key={article.id} article={article} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
