import Parser from "rss-parser";
import { unstable_cache } from "next/cache";
import { FetchResult, NewsArticle } from "./types";

/**
 * Nitter is a free, open-source Twitter front-end that exposes RSS feeds.
 * We try multiple instances in order and use the first one that responds.
 * If all instances fail for a given account, it is silently skipped.
 */
const NITTER_INSTANCES = [
  "https://nitter.privacydev.net",
  "https://nitter.poast.org",
  "https://nitter.1d4.us",
  "https://nitter.net",
];

interface TwitterAccount {
  handle:      string;
  displayName: string;
  /** Authority score 1-100: used as the base engagement signal when API counts aren't available. */
  authority:   number;
}

/**
 * 31 curated tech accounts across 5 categories.
 * Higher authority = appears higher in the digest when engagement data isn't parseable.
 */
const TECH_ACCOUNTS: TwitterAccount[] = [
  // ── AI Research Leaders ───────────────────────────────────────────
  { handle: "sama",           displayName: "Sam Altman",       authority: 98 },
  { handle: "karpathy",       displayName: "Andrej Karpathy",  authority: 97 },
  { handle: "ylecun",         displayName: "Yann LeCun",       authority: 96 },
  { handle: "AndrewYNg",      displayName: "Andrew Ng",        authority: 95 },
  { handle: "demishassabis",  displayName: "Demis Hassabis",   authority: 95 },
  { handle: "DrJimFan",       displayName: "Jim Fan (NVIDIA)", authority: 88 },
  { handle: "fchollet",       displayName: "François Chollet", authority: 90 },
  { handle: "ilyasut",        displayName: "Ilya Sutskever",   authority: 94 },
  // ── AI Practitioners & Paper Trackers ────────────────────────────
  { handle: "_akhaliq",       displayName: "AK (Papers)",      authority: 85 },
  { handle: "rasbt",          displayName: "Sebastian Raschka",authority: 82 },
  { handle: "chipro",         displayName: "Chip Huyen",       authority: 84 },
  { handle: "emollick",       displayName: "Ethan Mollick",    authority: 86 },
  { handle: "Thom_Wolf",      displayName: "Thomas Wolf (HF)", authority: 83 },
  { handle: "hwchase17",      displayName: "Harrison Chase",   authority: 80 },
  { handle: "dair_ai",        displayName: "DAIR.AI",          authority: 78 },
  // ── Software Engineering & Builder Culture ───────────────────────
  { handle: "GergelyOrosz",   displayName: "Gergely Orosz",   authority: 88 },
  { handle: "ThePrimeagen",   displayName: "ThePrimeagen",    authority: 82 },
  { handle: "swyx",           displayName: "swyx",            authority: 80 },
  { handle: "simonw",         displayName: "Simon Willison",  authority: 83 },
  { handle: "addyosmani",     displayName: "Addy Osmani",     authority: 78 },
  { handle: "kentcdodds",     displayName: "Kent C. Dodds",   authority: 76 },
  { handle: "mckaywrigley",   displayName: "Mckay Wrigley",   authority: 72 },
  { handle: "rauchg",         displayName: "Guillermo Rauch", authority: 82 },
  // ── Tech Founders & Investors ────────────────────────────────────
  { handle: "paulg",          displayName: "Paul Graham",     authority: 92 },
  { handle: "naval",          displayName: "Naval Ravikant",  authority: 90 },
  { handle: "levelsio",       displayName: "Pieter Levels",   authority: 78 },
  { handle: "garrytan",       displayName: "Garry Tan",       authority: 80 },
  { handle: "jeremyphoward",  displayName: "Jeremy Howard",   authority: 82 },
  // ── Official Org Accounts ────────────────────────────────────────
  { handle: "OpenAI",         displayName: "OpenAI",          authority: 96 },
  { handle: "AnthropicAI",    displayName: "Anthropic",       authority: 94 },
  { handle: "GoogleDeepMind", displayName: "Google DeepMind",authority: 93 },
];

// Short timeout so a dead Nitter instance does not stall the whole page load
const parser = new Parser({ timeout: 4000 });

function getRecencyScore(publishedAt: string): number {
  const ageHours = (Date.now() - new Date(publishedAt).getTime()) / 3_600_000;
  if (ageHours <= 6)  return 1.5;
  if (ageHours <= 12) return 1.2;
  if (ageHours <= 24) return 1.0;
  if (ageHours <= 48) return 0.75;
  return 0.3;
}

/** Try a single Nitter instance for a given account's RSS feed. */
async function tryNitterInstance(
  account: TwitterAccount,
  instance: string
): Promise<NewsArticle[]> {
  try {
    const feed = await parser.parseURL(`${instance}/${account.handle}/rss`);
    if (!feed.items?.length) return [];

    return feed.items.slice(0, 5).map((item, i): NewsArticle => {
      const publishedAt = item.isoDate ?? item.pubDate ?? new Date().toISOString();
      const recency     = getRecencyScore(publishedAt);

      // Nitter embeds tweet HTML in its description — strip tags for plain text
      const rawHtml   = item.content ?? item.contentSnippet ?? item.summary ?? "";
      const cleanText = rawHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 280);

      // Best-effort parse of engagement counts from Nitter description HTML
      const likesMatch   = rawHtml.match(/(\d[\d,.]*)\s*(?:like|❤)/i);
      const rtMatch      = rawHtml.match(/(\d[\d,.]*)\s*(?:retweet|RT\b|🔁)/i);
      const likes        = likesMatch ? parseInt(likesMatch[1].replace(/[,.]/g, ""), 10) : 0;
      const retweets     = rtMatch    ? parseInt(rtMatch[1].replace(/[,.]/g, ""), 10)    : 0;

      const engagementScore =
        likes > 0
          ? Math.round(likes * 0.5 + retweets * 1.0 + account.authority * recency)
          : Math.round(account.authority * recency);

      // Convert Nitter link back to twitter.com so users land on the real tweet
      const rawLink    = item.link ?? "";
      const twitterUrl = rawLink
        ? rawLink.replace(/^https?:\/\/[^/]+/, "https://twitter.com")
        : `https://twitter.com/${account.handle}`;

      return {
        id:              rawLink || `twitter-${account.handle}-${i}`,
        title:           (item.title ?? cleanText.slice(0, 120)) || `Post by @${account.handle}`,
        url:             twitterUrl,
        source:          `@${account.handle}`,
        sourceColor:     "#1A1A2E",
        publishedAt,
        summary:         cleanText || null,
        imageUrl:        null,
        upvotes:         likes + retweets,
        commentCount:    0,
        engagementScore,
        sourceType:      "twitter",
      };
    });
  } catch {
    return [];
  }
}

/** Try every Nitter instance until one succeeds; returns [] if all are down. */
async function fetchSingleAccount(account: TwitterAccount): Promise<NewsArticle[]> {
  for (const instance of NITTER_INSTANCES) {
    const posts = await tryNitterInstance(account, instance);
    if (posts.length > 0) return posts;
  }
  return [];
}

/** Returns today's date string, shifting at 7 AM IST instead of midnight. */
function getTodayIST7AM(): string {
  const now = new Date();
  const istOffsetMs = (5 * 60 + 30) * 60 * 1000;
  const shiftMs = -7 * 60 * 60 * 1000;
  return new Date(now.getTime() + istOffsetMs + shiftMs).toISOString().split("T")[0];
}

async function _fetchTwitterTop10(): Promise<FetchResult<NewsArticle>> {
  // Fetch all 31 accounts in parallel — each has its own 4-instance fallback
  const results = await Promise.allSettled(
    TECH_ACCOUNTS.map((account) => fetchSingleAccount(account))
  );

  const allPosts = results
    .filter((r): r is PromiseFulfilledResult<NewsArticle[]> => r.status === "fulfilled")
    .flatMap((r) => r.value);

  // Deduplicate by URL
  const seen   = new Set<string>();
  const unique = allPosts.filter((p) => {
    const key = p.url.replace(/\?.*$/, "").toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by engagement score (authority × recency, boosted by real like/RT counts)
  const top15 = unique
    .sort((a, b) => b.engagementScore - a.engagementScore)
    .slice(0, 15);

  return {
    data: top15,
    error:
      top15.length === 0
        ? "X / Twitter feed is currently unavailable — all Nitter mirrors are down. Try again later."
        : null,
    lastUpdated: new Date().toISOString(),
  };
}

/** Daily-cached: fresh once per day (IST midnight), served from cache all day. */
export function fetchTwitterTop10(): Promise<FetchResult<NewsArticle>> {
  const today = getTodayIST7AM();
  return unstable_cache(
    _fetchTwitterTop10,
    [`twitter-top15-${today}`],
    { revalidate: 86400 }
  )();
}
