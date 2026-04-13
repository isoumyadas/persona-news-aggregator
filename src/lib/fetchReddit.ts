import { unstable_cache } from "next/cache";
import { RedditPost, NewsArticle } from "./types";
import { getSecondsUntilNext7AMIST } from "./cacheUtils";

// Reddit blocks requests with no User-Agent but accepts any non-empty string
const USER_AGENT = "news-dashboard/1.0";

async function fetchSubredditTopRaw(
  subreddit: string,
  limit: number,
  t: "day" | "week" | "month" | "year" | "all"
): Promise<Omit<NewsArticle, "engagementScore">[]> {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/top.json?t=${t}&limit=${limit}`;
    const res  = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      next:    { revalidate: 86400 },
    });

    if (!res.ok) return [];

    const json = await res.json();
    const posts: RedditPost[] = json?.data?.children?.map((c: any) => c.data) ?? [];

    return posts
      .filter((p) => p.score > 10 && p.title) // Skip spam / brand-new low-score posts
      .map((p): Omit<NewsArticle, "engagementScore"> => {
        // Link posts → use article URL; text posts → use Reddit permalink
        const articleUrl = p.is_self
          ? `https://www.reddit.com${p.permalink}`
          : p.url;

        // Reddit encodes & as &amp; in preview image URLs — must decode
        const previewImg =
          p.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&") ?? null;
        const thumbnail =
          p.thumbnail?.startsWith("http") ? p.thumbnail : null;

        return {
          id:           `reddit-${p.id}`,
          title:        p.title,
          url:          articleUrl,
          source:       `r/${p.subreddit}`,
          sourceColor:  "#FF4500",
          publishedAt:  new Date(p.created_utc * 1000).toISOString(),
          summary:      p.selftext ? p.selftext.slice(0, 200) : null,
          imageUrl:     previewImg ?? thumbnail,
          upvotes:      p.score,
          commentCount: p.num_comments,
          sourceType:   "reddit",
          subreddit:    p.subreddit,
        };
      });
  } catch {
    return [];
  }
}

// Wrap with cache — revalidates at 7 AM IST
export function fetchSubredditTop(
  subreddit: string,
  limit = 25,
  t: "day" | "week" | "month" | "year" | "all" = "day"
) {
  return unstable_cache(
    () => fetchSubredditTopRaw(subreddit, limit, t),
    [`reddit-${subreddit}-${t}`],
    { revalidate: getSecondsUntilNext7AMIST() }
  )();
}
