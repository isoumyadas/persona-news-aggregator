"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface SourceTab {
  value:       string;
  label:       string;
  emoji:       string;
  description: string;
}

const TECH_SOURCES: SourceTab[] = [
  {
    value:       "techcrunch",
    label:       "TechCrunch",
    emoji:       "🟢",
    description: "Top 10 latest articles — sorted by most recent",
  },
  {
    value:       "hackernews",
    label:       "Hacker News",
    emoji:       "🟠",
    description: "Top 10 stories — ranked by points + comments (most discussed)",
  },
  {
    value:       "youtube",
    label:       "YouTube",
    emoji:       "🔴",
    description: "Top 10 most recent videos from 14 SWE / AI / ML channels",
  },
];

export default function SourceTabs({ basePath }: { basePath: string }) {
  const searchParams  = useSearchParams();
  const currentSource = searchParams.get("source") ?? "techcrunch";
  const activeTab     = TECH_SOURCES.find((t) => t.value === currentSource) ?? TECH_SOURCES[0];

  return (
    <div className="mb-6">
      {/* Tab row */}
      <div className="flex items-center gap-2 flex-wrap border-b border-gray-200 dark:border-gray-800 pb-3">
        {TECH_SOURCES.map((tab) => {
          const isActive = currentSource === tab.value;
          return (
            <Link
              key={tab.value}
              href={`${basePath}?source=${tab.value}`}
              className={`
                flex items-center gap-1.5 whitespace-nowrap px-4 py-2 text-sm rounded-full
                transition-all duration-200
                ${isActive
                  ? "bg-blue-600 text-white font-medium shadow-sm shadow-blue-200 dark:shadow-blue-950"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                }
              `}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Ranking explanation for the active tab */}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 pl-1">
        {activeTab.description}
      </p>
    </div>
  );
}
