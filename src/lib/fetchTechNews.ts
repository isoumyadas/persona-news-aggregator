import { unstable_cache } from "next/cache";
import { fetchHackerNewsStories } from "./fetchHackerNews";
import { fetchSubredditTop } from "./fetchReddit";
import { fetchRssFeed, RssFeedConfig } from "./fetchRss";
import { fetchDevToArticles } from "./fetchDevNews";
import { rankAndSlice } from "./rankArticles";
import { NewsArticle, FinanceSourceGroup } from "./types";
import { getSecondsUntilNext7AMIST } from "./cacheUtils";

// ── Per-source configuration ────────────────────────────────────

interface TechSource {
  label: string;
  color: string;
  fetch: () => Promise<Omit<NewsArticle, "engagementScore">[]>;
}

// RSS source helper
const rssSource = (config: RssFeedConfig): TechSource => ({
  label: config.name,
  color: config.color,
  fetch: () => fetchRssFeed(config, 15),
});

// Reddit source helper
const redditSource = (sub: string, label: string): TechSource => ({
  label,
  color: "#FF4500",
  fetch: () => fetchSubredditTop(sub, 30, "day"),
});

// ── All tech sources — each gets its own Top 10 section ──────────

const TECH_SOURCES: TechSource[] = [
  // Hacker News
  {
    label: "Hacker News",
    color: "#FF6600",
    fetch: fetchHackerNewsStories,
  },
  // dev.to
  {
    label: "dev.to",
    color: "#0A0A0A",
    fetch: fetchDevToArticles,
  },
  // Editorial RSS
  rssSource({ name: "TechCrunch",      url: "https://techcrunch.com/feed/",                     color: "#0A8217" }),
  rssSource({ name: "MIT Tech Review", url: "https://www.technologyreview.com/stories.rss",      color: "#A31F34" }),
  rssSource({ name: "Wired",           url: "https://www.wired.com/feed/rss",                   color: "#1A1A1A" }),
  rssSource({ name: "Ars Technica",    url: "https://feeds.arstechnica.com/arstechnica/index",   color: "#FF4E00" }),
  rssSource({ name: "The Verge",       url: "https://www.theverge.com/rss/index.xml",            color: "#FA4B2A" }),
  rssSource({ name: "VentureBeat",     url: "https://venturebeat.com/feed/",                     color: "#E93427" }),
  rssSource({ name: "Livemint Tech",   url: "https://www.livemint.com/rss/technology",           color: "#F15A22" }),
  // YouTube channels
  rssSource({ name: "MKBHD",          url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCBJycsmduvYEL83R_U4JriQ", color: "#FF0000" }),
  rssSource({ name: "Fireship",       url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCsBjURrPoezykLs9EqgamOA", color: "#FF6600" }),
  rssSource({ name: "TechCrunch YT",  url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCCjyq_K1Xwfg8Lndy7lKMpA", color: "#0A8217" }),
  rssSource({ name: "The Verge YT",   url: "https://www.youtube.com/feeds/videos.xml?channel_id=UCddiUEpeqJcYeBxX1IVBKvQ", color: "#FA4B2A" }),
  // Reddit communities
  redditSource("technology",       "r/technology"),
  redditSource("MachineLearning",  "r/MachineLearning"),
  redditSource("artificial",       "r/artificial"),
  redditSource("programming",      "r/programming"),
  redditSource("Futurology",       "r/Futurology"),
];

async function _fetchTechNews(): Promise<{ groups: FinanceSourceGroup[]; lastUpdated: string }> {
  const results = await Promise.allSettled(
    TECH_SOURCES.map(async (src) => {
      const raw = await src.fetch();
      const ranked = rankAndSlice(raw, 10);
      return {
        sourceName:  src.label,
        sourceColor: src.color,
        articles:    ranked,
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
export const fetchTechNews = unstable_cache(
  _fetchTechNews,
  ["tech-news-daily-groups"],
  { revalidate: getSecondsUntilNext7AMIST() }
);
