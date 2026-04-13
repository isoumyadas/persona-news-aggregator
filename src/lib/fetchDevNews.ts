import { unstable_cache } from "next/cache";
import { NewsArticle } from "./types";
import { getSecondsUntilNext7AMIST } from "./cacheUtils";

/**
 * Fetch top developer articles from dev.to's free public API.
 * Uses the `top=1` parameter to get most-reacted articles from the past day.
 * No API key required.
 *
 * This is used as a source inside Tech News (not a standalone page).
 */
async function _fetchDevToArticles(): Promise<Omit<NewsArticle, "engagementScore">[]> {
  try {
    const res = await fetch(
      "https://dev.to/api/articles?top=1&per_page=30",
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) return [];

    const articles: any[] = await res.json();

    return articles
      .filter((a: any) => a.title && a.url)
      .map((a: any): Omit<NewsArticle, "engagementScore"> => ({
        id:              `devto-${a.id}`,
        title:           a.title,
        url:             a.url,
        source:          "dev.to",
        sourceColor:     "#0A0A0A",
        publishedAt:     a.published_at ?? new Date().toISOString(),
        summary:         a.description ?? null,
        imageUrl:        a.cover_image ?? a.social_image ?? null,
        upvotes:         a.positive_reactions_count ?? 0,
        commentCount:    a.comments_count ?? 0,
        sourceType:      "devto",
      }));
  } catch {
    return [];
  }
}

// Cached raw fetcher used by fetchTechNews
export const fetchDevToArticles = unstable_cache(
  _fetchDevToArticles,
  ["devto-articles-daily"],
  { revalidate: getSecondsUntilNext7AMIST() }
);
