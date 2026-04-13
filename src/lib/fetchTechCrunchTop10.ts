import Parser from "rss-parser";
import { unstable_cache } from "next/cache";
import { FetchResult, NewsArticle } from "./types";

const parser = new Parser({
  customFields: {
    item: ["media:content", "media:thumbnail", "enclosure"],
  },
});

/** Returns today's date string, shifting at 7 AM IST instead of midnight. */
function getTodayIST7AM(): string {
  const now = new Date();
  const istOffsetMs = (5 * 60 + 30) * 60 * 1000;
  const shiftMs = -7 * 60 * 60 * 1000;
  return new Date(now.getTime() + istOffsetMs + shiftMs).toISOString().split("T")[0];
}

async function _fetchTechCrunchTop10(): Promise<FetchResult<NewsArticle>> {
  try {
    const feed = await parser.parseURL("https://techcrunch.com/feed/");

    const articles: NewsArticle[] = feed.items
      .slice(0, 50)
      .map((item, i): NewsArticle => {
        // Try multiple media field paths for thumbnail
        const imageUrl =
          (item as any)["media:content"]?.["$"]?.url ??
          (item as any)["media:content"]?.url ??
          (item as any)["media:thumbnail"]?.["$"]?.url ??
          (item as any)["enclosure"]?.url ??
          null;

        return {
          id:           item.link ?? item.guid ?? `tc-${i}`,
          title:        item.title ?? "Untitled",
          url:          item.link ?? "#",
          source:       "TechCrunch",
          sourceColor:  "#0A8217",
          publishedAt:  item.isoDate ?? item.pubDate ?? new Date().toISOString(),
          summary:      item.contentSnippet?.slice(0, 220) ?? null,
          imageUrl,
          upvotes:      0,
          commentCount: 0,
          engagementScore: 0,
          sourceType:   "rss",
        };
      })
      // Sort newest-first — TechCrunch RSS is mostly ordered but let's be sure
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 10);

    return {
      data:        articles,
      error:       articles.length === 0 ? "No TechCrunch articles found. Try again later." : null,
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    return {
      data:        [],
      error:       "Could not load TechCrunch. Please refresh the page.",
      lastUpdated: new Date().toISOString(),
    };
  }
}

/** Daily-cached: fresh once per day (IST midnight), served from cache all day. */
export function fetchTechCrunchTop10(): Promise<FetchResult<NewsArticle>> {
  const today = getTodayIST7AM();
  return unstable_cache(
    _fetchTechCrunchTop10,
    [`techcrunch-top10-${today}`],
    { revalidate: 86400 }
  )();
}
