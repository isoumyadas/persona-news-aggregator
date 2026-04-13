import { unstable_cache } from "next/cache";
import { fetchRssFeed, RssFeedConfig } from "./fetchRss";
import { rankAndSlice } from "./rankArticles";
import { FetchResult, LearningHubTab, NewsArticle } from "./types";
import { appendToHistory, getHistoricalUpdates } from "./db";
import { financeResources } from "../data/financeResources";
import { getSecondsUntilNext7AMIST } from "./cacheUtils";

// ── NEW REGULATIONS FROM INDIA & WORLD ──────────────────────────────
const FINANCE_REGULATIONS_RSS: RssFeedConfig[] = [
  { name: "SEBI Official",        url: "https://www.sebi.gov.in/sebirss.xml",               color: "#0052cc" },
  { name: "Investing.com India",  url: "https://in.investing.com/rss/news_285.rss",          color: "#000000" },
  { name: "Zee Business",         url: "https://zeenews.india.com/rss/business.xml",         color: "#d92128" },
];

async function _fetchFinanceUpdatesTask(): Promise<NewsArticle[]> {
  const results = await Promise.allSettled(
    FINANCE_REGULATIONS_RSS.map((feed) => fetchRssFeed(feed, 4))
  );
  
  const rawArticles = results
    .filter((r): r is PromiseFulfilledResult<any[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);
    
  return rankAndSlice(rawArticles, 10);
}

const getDailyFinanceUpdates = unstable_cache(
  _fetchFinanceUpdatesTask,
  ["finance-regulations-daily"],
  { revalidate: getSecondsUntilNext7AMIST() }
);

export async function fetchFinanceLearning(tab: LearningHubTab) {
  if (tab === "learning" || tab === "tools") {
    // 100% Curated Static 
    return { data: financeResources.filter(r => r.hubTab === tab), error: null, lastUpdated: new Date().toISOString() };
  }

  // ── Tab 2: New Regulations (Historical Database) ──
  // 1. Fetch today's updates
  const todaysUpdates = await getDailyFinanceUpdates();
  
  // 2. Append to local DB
  if (todaysUpdates.length > 0) {
    const records = todaysUpdates.map(article => ({
      id: article.id,
      domain: "finance" as const,
      article,
      discoveredAt: new Date().toISOString()
    }));
    await appendToHistory(records);
  }

  // 3. Return full chronological history from database
  const history = await getHistoricalUpdates("finance");
  
  return {
    data: history, // Note: We return HistoricalRecord[]
    error: history.length === 0 ? "No new regulations have been recorded yet." : null,
    lastUpdated: new Date().toISOString()
  };
}
