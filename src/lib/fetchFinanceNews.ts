import { unstable_cache } from "next/cache";
import { fetchSubredditTop } from "./fetchReddit";
import { fetchRssFeed, RssFeedConfig } from "./fetchRss";
import { rankAndSlice } from "./rankArticles";
import { FetchResult, NewsArticle, FinanceSourceGroup } from "./types";
import { getSecondsUntilNext7AMIST } from "./cacheUtils";

// ── Per-source configuration ────────────────────────────────────

interface FinanceSource {
  label: string;
  color: string;
  fetch: () => Promise<Omit<NewsArticle, "engagementScore">[]>;
}

// Reddit fetchers
const redditSource = (sub: string, label: string): FinanceSource => ({
  label,
  color: "#FF4500",
  fetch: () => fetchSubredditTop(sub, 25, "day"),
});

// RSS fetchers
const rssSource = (config: RssFeedConfig): FinanceSource => ({
  label: config.name,
  color: config.color,
  fetch: () => fetchRssFeed(config, 15),
});

// NewsAPI fetcher
const newsApiSource: FinanceSource = {
  label: "NewsAPI Headlines",
  color: "#555555",
  fetch: async () => {
    if (!process.env.NEWSAPI_KEY) return [];
    try {
      const url = [
        "https://newsapi.org/v2/top-headlines",
        "?category=business",
        "&language=en",
        "&pageSize=15",
        "&sortBy=popularity",
        `&apiKey=${process.env.NEWSAPI_KEY}`,
      ].join("");
      const res = await fetch(url, { next: { revalidate: 86400 } });
      const json = await res.json();

      return (json.articles ?? [])
        .filter((a: any) => a.title && a.url)
        .map((a: any): Omit<NewsArticle, "engagementScore"> => ({
          id: `newsapi-${a.url}`,
          title: a.title,
          url: a.url,
          source: a.source?.name ?? "NewsAPI",
          sourceColor: "#555555",
          publishedAt: a.publishedAt,
          summary: a.description ?? null,
          imageUrl: a.urlToImage ?? null,
          upvotes: 65,
          commentCount: 0,
          sourceType: "newsapi",
        }));
    } catch {
      return [];
    }
  },
};

// ── All finance sources ──────────────────────────────────────────

const FINANCE_SOURCES: FinanceSource[] = [
  // Indian sources
  rssSource({ name: "Moneycontrol", url: "https://www.moneycontrol.com/rss/latestnews.xml", color: "#6B21A8" }),
  rssSource({ name: "Economic Times", url: "https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms", color: "#1E40AF" }),
  rssSource({ name: "Livemint", url: "https://www.livemint.com/rss/markets", color: "#059669" }),
  // Global sources
  rssSource({ name: "Reuters Markets", url: "https://feeds.reuters.com/reuters/businessNews", color: "#FF8000" }),
  rssSource({ name: "CNBC", url: "https://www.cnbc.com/id/10000664/device/rss/rss.html", color: "#0072BC" }),
  rssSource({ name: "MarketWatch", url: "https://feeds.marketwatch.com/marketwatch/topstories/", color: "#0D1F2D" }),
  rssSource({ name: "Investopedia", url: "https://www.investopedia.com/feedbuilder/feed/getfeed/?feedName=rss_headline", color: "#003366" }),
  // Reddit communities
  redditSource("investing", "r/investing"),
  redditSource("stocks", "r/stocks"),
  redditSource("IndiaInvestments", "r/IndiaInvestments"),
  // NewsAPI
  newsApiSource,
];

async function _fetchFinanceNews(): Promise<{ groups: FinanceSourceGroup[]; lastUpdated: string }> {
  const results = await Promise.allSettled(
    FINANCE_SOURCES.map(async (src) => {
      const raw = await src.fetch();
      const ranked = rankAndSlice(raw, 10);
      return {
        sourceName: src.label,
        sourceColor: src.color,
        articles: ranked,
      } as FinanceSourceGroup;
    })
  );

  const groups = results
    .filter((r): r is PromiseFulfilledResult<FinanceSourceGroup> => r.status === "fulfilled")
    .map((r) => r.value)
    .filter((g) => g.articles.length > 0);

  return {
    groups,
    lastUpdated: new Date().toISOString(),
  };
}

// Cache until next 7 AM IST
export const fetchFinanceNews = unstable_cache(
  _fetchFinanceNews,
  ["finance-news-daily-groups"],
  { revalidate: getSecondsUntilNext7AMIST() }
);
