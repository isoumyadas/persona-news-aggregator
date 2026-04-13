import { unstable_cache } from "next/cache";
import { FetchResult, HNStory, NewsArticle } from "./types";

const HN_BASE = "https://hacker-news.firebaseio.com/v0";

/** Returns today's date string, shifting at 7 AM IST instead of midnight. */
function getTodayIST7AM(): string {
  const now = new Date();
  // Convert to IST (UTC +5:30) then subtract 7 hours so 00:00-06:59 falls into yesterday
  const istOffsetMs = (5 * 60 + 30) * 60 * 1000;
  const shiftMs = -7 * 60 * 60 * 1000;
  return new Date(now.getTime() + istOffsetMs + shiftMs).toISOString().split("T")[0];
}

async function _fetchHackerNewsTop10(): Promise<FetchResult<NewsArticle>> {
  try {
    // HN already returns IDs sorted by score (highest first)
    const idsRes = await fetch(`${HN_BASE}/topstories.json`, {
      next: { revalidate: 3600 },
    });
    if (!idsRes.ok) throw new Error("HN topstories API unavailable");

    const ids: number[] = await idsRes.json();
    const top50 = ids.slice(0, 50); // Fetch 50 candidates → rank → top 10

    const stories = (
      await Promise.all(
        top50.map((id) =>
          fetch(`${HN_BASE}/item/${id}.json`, { next: { revalidate: 3600 } })
            .then((r) => r.json() as Promise<HNStory>)
            .catch(() => null)
        )
      )
    ).filter(
      (s): s is HNStory => s !== null && s.type === "story" && !!s.title
    );

    const articles: NewsArticle[] = stories
      .map((s): NewsArticle => {
        // Rank formula: points + (comments × 2) — comments signal discussion quality
        const engagementScore = s.score + (s.descendants ?? 0) * 2;
        return {
          id:           String(s.id),
          title:        s.title,
          url:          s.url ?? `https://news.ycombinator.com/item?id=${s.id}`,
          source:       "Hacker News",
          sourceColor:  "#FF6600",
          publishedAt:  new Date(s.time * 1000).toISOString(),
          summary:      null,
          imageUrl:     null,
          upvotes:      s.score,
          commentCount: s.descendants ?? 0,
          engagementScore,
          sourceType:   "hackernews",
          hnId:         s.id,
        };
      })
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, 10);

    return {
      data:        articles,
      error:       articles.length === 0 ? "No HN stories found. Try again later." : null,
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    return {
      data:        [],
      error:       "Could not load Hacker News. Please refresh the page.",
      lastUpdated: new Date().toISOString(),
    };
  }
}

/** Daily-cached: fresh once per day (IST midnight), served from cache all day. */
export function fetchHackerNewsTop10(): Promise<FetchResult<NewsArticle>> {
  const today = getTodayIST7AM();
  return unstable_cache(
    _fetchHackerNewsTop10,
    [`hn-top10-${today}`],
    { revalidate: 86400 }
  )();
}
