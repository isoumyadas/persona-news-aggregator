import Parser from "rss-parser";
import { NewsArticle } from "./types";
import { RSS_AUTHORITY_SCORES } from "./rankArticles";

const parser = new Parser({
  customFields: { item: ["media:content", "media:thumbnail", "enclosure"] },
});

export interface RssFeedConfig {
  name: string;
  url: string;
  color: string;
}

export async function fetchRssFeed(
  feed: RssFeedConfig,
  maxItems = 5
): Promise<Omit<NewsArticle, "engagementScore">[]> {
  try {
    const result = await parser.parseURL(feed.url);
    return result.items.slice(0, maxItems).map(
      (item): Omit<NewsArticle, "engagementScore"> => ({
        id:           item.link ?? item.guid ?? `rss-${Math.random()}`,
        title:        item.title ?? "Untitled",
        url:          item.link ?? "#",
        source:       feed.name,
        sourceColor:  feed.color,
        publishedAt:  item.pubDate ?? new Date().toISOString(),
        summary:      item.contentSnippet ?? null,
        imageUrl:
          (item as any)["media:content"]?.["$"]?.url ??
          (item as any)["enclosure"]?.url ??
          null,
        // RSS has no real votes — use fixed authority score as proxy
        upvotes:      RSS_AUTHORITY_SCORES[feed.name] ?? 50,
        commentCount: 0,
        sourceType:   "rss",
      })
    );
  } catch {
    return []; // Never crash — silently skip broken feeds
  }
}
