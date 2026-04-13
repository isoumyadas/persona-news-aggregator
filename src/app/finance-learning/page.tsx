import { fetchFinanceLearning } from "@/lib/fetchFinanceLearning";
import ResourceGrid from "@/components/ResourceGrid";
import HistoryGrid from "@/components/HistoryGrid";
import LearningTabs from "@/components/LearningTabs";
import { LearningHubTab, LearningResource } from "@/lib/types";
import { HistoricalRecord } from "@/lib/db";

export const metadata = { title: "Finance Learning Hub — NewsBoard" };

const tabs: { value: LearningHubTab; label: string }[] = [
  { value: "learning", label: "📚 Learning Roadmap" },
  { value: "updates", label: "📜 Regulation History" },
  { value: "tools", label: "🛠️ Tools & Practice" },
];

export default async function FinanceLearningPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const currentTab = (tab as LearningHubTab) || "learning";

  const { data, error, lastUpdated } = await fetchFinanceLearning(currentTab);

  const subtitles: Record<LearningHubTab, string> = {
    learning: "A structured, A-to-Z roadmap to master personal & professional finance — 100% free resources",
    updates: "A permanent historical record of global and Indian financial regulations",
    tools: "Essential free tools for research, analysis, and staying informed",
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          <span className="gradient-text">Finance Learning Hub</span>
        </h1>
        <p className="text-sm text-[var(--muted)] mt-2 max-w-2xl">
          {subtitles[currentTab]}
        </p>
      </div>

      <LearningTabs basePath="/finance-learning" tabs={tabs} />

      {error ? (
        <div className="glass-card p-8 text-center max-w-md mx-auto mt-8">
          <p className="text-[var(--muted)] text-sm">{error}</p>
        </div>
      ) : currentTab === "updates" ? (
        <HistoryGrid records={data as HistoricalRecord[]} />
      ) : (
        <div className="space-y-8">
          <ResourceGrid resources={data as LearningResource[]} />
        </div>
      )}
    </main>
  );
}
