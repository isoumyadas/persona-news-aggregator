import { fetchTechNews } from "@/lib/fetchTechNews";
import { getDailyDigestTimestamp } from "@/lib/cacheUtils";
import SourceTabsView from "@/components/SourceTabsView";
import { Clock } from "lucide-react";

export const metadata = { title: "Tech News — NewsBoard" };

export default async function TechNewsPage() {
  const { groups, lastUpdated } = await fetchTechNews();
  const digestTime = getDailyDigestTimestamp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="gradient-text">Tech News</span>
        </h1>
        <p className="text-sm text-[var(--muted)] mt-2">
          Today&apos;s top stories organized by source — click a tab to browse
        </p>
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          <span className="digest-time">
            <Clock size={13} />
            {digestTime}
          </span>
          <span className="text-xs text-[var(--muted)]">
            {groups.length} sources · {groups.reduce((sum, g) => sum + g.articles.length, 0)} articles
          </span>
        </div>
      </div>

      <SourceTabsView groups={groups} />
    </main>
  );
}
