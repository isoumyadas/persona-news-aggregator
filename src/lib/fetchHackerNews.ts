import { unstable_cache } from "next/cache";
import { HNStory, NewsArticle } from "./types";
import { getSecondsUntilNext7AMIST } from "./cacheUtils";

const HN_BASE = "https://hacker-news.firebaseio.com/v0";

async function _fetchHackerNewsStories(): Promise<Omit<NewsArticle, "engagementScore">[]> {
  try {
    // Returns up to 500 story IDs already sorted by HN score (highest first)
    const idsRes = await fetch(`${HN_BASE}/topstories.json`, {
      next: { revalidate: 86400 },
    });
    const ids: number[] = await idsRes.json();

    // Only fetch top 30 — more than enough candidates for ranking
    const top30 = ids.slice(0, 30);

    // Fetch all story details in parallel
    const stories = (
      await Promise.all(
        top30.map((id) =>
          fetch(`${HN_BASE}/item/${id}.json`, { next: { revalidate: 86400 } })
            .then((r) => r.json() as Promise<HNStory>)
            .catch(() => null)
        )
      )
    ).filter(
      (s): s is HNStory =>
        s !== null && s.type === "story" && !!s.title
    );

    return stories.map((s): Omit<NewsArticle, "engagementScore"> => ({
      id:           String(s.id),
      title:        s.title,
      // Ask HN / Show HN posts have no external URL → link to HN discussion
      url:          s.url ?? `https://news.ycombinator.com/item?id=${s.id}`,
      source:       "Hacker News",
      sourceColor:  "#FF6600",
      publishedAt:  new Date(s.time * 1000).toISOString(),
      summary:      null,
      imageUrl:     null,
      upvotes:      s.score,
      commentCount: s.descendants ?? 0,
      sourceType:   "hackernews",
      hnId:         s.id,
    }));
  } catch {
    return [];
  }
}

// Cache until next 7 AM IST
export const fetchHackerNewsStories = unstable_cache(
  _fetchHackerNewsStories,
  ["hn-top-stories"],
  { revalidate: getSecondsUntilNext7AMIST() }
);
