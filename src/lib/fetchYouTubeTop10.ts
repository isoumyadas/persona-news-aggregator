import { unstable_cache } from "next/cache";
import { FetchResult, NewsArticle } from "./types";

interface YTChannel {
  id:    string;
  name:  string;
  color: string;
}

/**
 * 14 curated SWE / AI / ML / Tech YouTube channels.
 * All use the free public YouTube Atom RSS feed — no API key required.
 * Wrong channel IDs return an empty feed and are silently skipped.
 */
const TECH_CHANNELS: YTChannel[] = [
  { id: "UCsBjURrPoezykLs9EqgamOA", name: "Fireship",          color: "#FF4500" },
  { id: "UC29ju8bIPH5as8OGnQzwJyA", name: "Traversy Media",    color: "#CC3534" },
  { id: "UCCjyq_K1Xwfg8Lndy7lKMpA", name: "TechCrunch",        color: "#0A8217" },
  { id: "UCddiUEpeqJcYeBxX1IVBKvQ", name: "The Verge",         color: "#FA4B2A" },
  { id: "UCYO_jab_esuFRV4b17AJtAg", name: "3Blue1Brown",       color: "#1565C0" },
  { id: "UCSHZKyawb77ixDdsGog4iWA", name: "Lex Fridman",       color: "#1A1A1A" },
  { id: "UCbfYPyITQ-7l4upoX8nvctg", name: "Two Minute Papers", color: "#E53935" },
  { id: "UCZHmQk67mSJgfCCTn7xBfew", name: "Yannic Kilcher",    color: "#6A1B9A" },
  { id: "UCZgt6AzoyjslHTC9dJjFuGw", name: "ByteByteGo",        color: "#0277BD" },
  { id: "UC8ENHE5xdFSwx71ti3vg2bA", name: "ThePrimeagen",      color: "#37474F" },
  { id: "UCbRP3rVRCCMh5VdV-1TYHgA", name: "Theo (t3.gg)",     color: "#7C3AED" },
  { id: "UC9-y-6csu5WGm29I7JiwpnA", name: "Computerphile",     color: "#455A64" },
  { id: "UCfzlCWGWYyg_75sLO0sBkEA", name: "Sentdex",           color: "#2196F3" },
  { id: "UC9x0AN7kwET_JfzSw2GN_LA", name: "NetworkChuck",      color: "#00ACC1" },
];

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g,  "&")
    .replace(/&lt;/g,   "<")
    .replace(/&gt;/g,   ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g,  "'")
    .replace(/&apos;/g, "'");
}

/**
 * Fetches a single YouTube channel's Atom feed and parses up to 15 entries.
 * Uses raw XML regex parsing — more reliable than rss-parser for Atom feeds.
 */
async function fetchChannelVideos(channel: YTChannel): Promise<NewsArticle[]> {
  try {
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const xml = await res.text();
    const articles: NewsArticle[] = [];

    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match: RegExpExecArray | null;

    while ((match = entryRegex.exec(xml)) !== null) {
      const entry = match[1];

      const title        = entry.match(/<title>(.*?)<\/title>/)?.[1];
      const link         = entry.match(/<link rel="alternate" href="([^"]+)"/)?.[1];
      const published    = entry.match(/<published>(.*?)<\/published>/)?.[1];
      const thumbnail    = entry.match(/<media:thumbnail url="([^"]+)"/)?.[1];
      const videoId      = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1];
      const descRaw      = entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1];

      if (!title || !link) continue;

      articles.push({
        id:              videoId ?? link,
        title:           decodeEntities(title),
        url:             link,
        source:          channel.name,
        sourceColor:     channel.color,
        publishedAt:     published ?? new Date().toISOString(),
        summary:         descRaw ? decodeEntities(descRaw).trim().slice(0, 220) : null,
        imageUrl:        thumbnail ?? null,
        upvotes:         0,
        commentCount:    0,
        engagementScore: 0,
        sourceType:      "youtube",
      });
    }

    return articles;
  } catch {
    return []; // Never crash — silently skip broken/wrong channels
  }
}

/** Returns today's date string, shifting at 7 AM IST instead of midnight. */
function getTodayIST7AM(): string {
  const now = new Date();
  const istOffsetMs = (5 * 60 + 30) * 60 * 1000;
  const shiftMs = -7 * 60 * 60 * 1000;
  return new Date(now.getTime() + istOffsetMs + shiftMs).toISOString().split("T")[0];
}

async function _fetchYouTubeTop10(): Promise<FetchResult<NewsArticle>> {
  // Fetch all 14 channels in parallel
  const results = await Promise.allSettled(
    TECH_CHANNELS.map((ch) => fetchChannelVideos(ch))
  );

  const allVideos = results
    .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  // Sort newest-first across all channels, take top 10
  const top10 = allVideos
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 10);

  return {
    data:        top10,
    error:       top10.length === 0 ? "Could not load YouTube videos. Please refresh the page." : null,
    lastUpdated: new Date().toISOString(),
  };
}

/** Daily-cached: fresh once per day (IST midnight), served from cache all day. */
export function fetchYouTubeTop10(): Promise<FetchResult<NewsArticle>> {
  const today = getTodayIST7AM();
  return unstable_cache(
    _fetchYouTubeTop10,
    [`youtube-top10-${today}`],
    { revalidate: 86400 }
  )();
}
