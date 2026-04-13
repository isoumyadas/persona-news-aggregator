import { HistoricalRecord } from "@/lib/db";
import NewsCard from "./NewsCard";

export default function HistoryGrid({ records }: { records: HistoricalRecord[] }) {
  if (records.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="glass-card p-8 text-center max-w-md">
          <p className="text-3xl mb-3">📜</p>
          <p className="text-[var(--muted)] text-sm">No historical data recorded yet.</p>
        </div>
      </div>
    );
  }

  // Group by exact date
  const grouped: Record<string, HistoricalRecord[]> = {};
  
  for (const record of records) {
    const d = new Date(record.discoveredAt);
    const dateStr = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    if (!grouped[dateStr]) grouped[dateStr] = [];
    grouped[dateStr].push(record);
  }

  return (
    <div className="space-y-12">
      {Object.entries(grouped).map(([dateStr, items]) => (
        <div key={dateStr} className="fade-in-up">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-lg font-bold text-[var(--foreground)] whitespace-nowrap">{dateStr}</h2>
            <div className="h-px bg-[var(--border)] flex-1" />
            <span className="text-xs text-[var(--muted)] whitespace-nowrap">{items.length} items</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {items.map((item, i) => (
              <NewsCard key={item.id} article={item.article} index={i} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
