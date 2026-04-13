"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LearningHubTab } from "@/lib/types";

interface TabConfig {
  value: LearningHubTab;
  label: string;
}

export default function LearningTabs({
  basePath,
  tabs,
}: {
  basePath: string;
  tabs: TabConfig[];
}) {
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get("tab") as LearningHubTab) || "learning";

  return (
    <div className="flex items-center gap-6 mb-8 border-b border-[var(--border)] overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = currentTab === tab.value;
        const href = tab.value === "learning" ? basePath : `${basePath}?tab=${tab.value}`;

        return (
          <Link
            key={tab.value}
            href={href}
            id={`tab-${tab.value}`}
            className={`py-3 text-sm font-medium whitespace-nowrap transition-colors relative outline-none ${
              isActive
                ? "text-[var(--foreground)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            {tab.label.replace(/📚 |📜 |🛠️ /g, '')} {/* Strip emojis for minimalist look */}
            
            {/* Active Underline */}
            {isActive && (
              <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[var(--foreground)] rounded-t-sm" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
