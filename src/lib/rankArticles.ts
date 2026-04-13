import { NewsArticle } from "./types";

const W_UPVOTES = 1.0;
const W_COMMENTS = 2.0;

// ── Source normalizers ─────────────────────────────────────────────
// Reddit posts routinely hit 20k–50k upvotes while HN tops out at ~1k.
// Without normalization, Reddit dominates every single feed.
// These multipliers bring all sources into the same scoring range.
const SOURCE_MULTIPLIERS: Record<NewsArticle["sourceType"], number> = {
  reddit: 0.05,   // 25k upvotes × 0.05 = 1250 normalized
  hackernews: 1.5,    // 800 upvotes × 1.5  = 1200 normalized
  rss: 3.0,    // 80 authority  × 3.0 = 240  (ensures visibility)
  newsapi: 2.0,    // 65 base       × 2.0 = 130  (moderate presence)
  devto: 1.2,    // dev.to reactions are typically 50–500
  youtube: 3.0,    // No real engagement data from Atom feeds — use authority proxy
};

export const RSS_AUTHORITY_SCORES: Record<string, number> = {
  // Tech RSS
  "MIT Tech Review": 80,
  "Wired": 75,
  "Ars Technica": 70,
  "The Verge": 65,
  "TechCrunch": 60,
  "VentureBeat": 55,
  "Livemint Tech": 70,
  // YouTube channels
  "MKBHD": 70,
  "Fireship": 80,
  "TechCrunch YT": 60,
  "The Verge YT": 65,
  "Traversy Media": 72,
  "3Blue1Brown": 85,
  "Lex Fridman": 82,
  "Two Minute Papers": 78,
  "Yannic Kilcher": 76,
  "ByteByteGo": 74,
  "ThePrimeagen": 70,
  "Theo (t3.gg)": 68,
  "Computerphile": 75,
  "Sentdex": 65,
  "NetworkChuck": 66,
  // YouTube — Finance channels
  "Plain Bagel": 60,
  "WSJ Finance": 65,
  // Global Finance RSS
  "Reuters Markets": 90,
  "CNBC": 70,
  "Yahoo Finance": 72,
  "Business Standard": 68,
  "Financial Times": 80,
  "MarketWatch": 65,
  "Investopedia": 60,
  // Indian Finance RSS
  "Moneycontrol": 75,
  "Economic Times": 70,
  "Livemint": 65,
};

function getRecencyMultiplier(publishedAt: string): number {
  const ageHours = (Date.now() - new Date(publishedAt).getTime()) / 3_600_000;
  if (ageHours <= 6) return 0.30;
  if (ageHours <= 12) return 0.20;
  if (ageHours <= 24) return 0.10;
  if (ageHours <= 48) return 0.05;
  return 0;
}

export function computeEngagementScore(
  article: Omit<NewsArticle, "engagementScore">
): number {
  const multiplier = SOURCE_MULTIPLIERS[article.sourceType] ?? 1.0;
  const rawScore = ((article.upvotes * W_UPVOTES) + (article.commentCount * W_COMMENTS)) * multiplier;
  const recencyBoost = rawScore * getRecencyMultiplier(article.publishedAt);
  return Math.round(rawScore + recencyBoost);
}

export function rankAndSlice(
  articles: Omit<NewsArticle, "engagementScore">[],
  topN = 10
): NewsArticle[] {
  // Deduplicate: same story from multiple sources → keep highest upvote version
  const seen = new Map<string, Omit<NewsArticle, "engagementScore">>();
  for (const article of articles) {
    // Strip query params so ?utm_source= etc. does not create duplicates
    const key = article.url.replace(/\?.*$/, "").toLowerCase();
    const existing = seen.get(key);
    if (!existing || article.upvotes > existing.upvotes) {
      seen.set(key, article);
    }
  }

  return Array.from(seen.values())
    .map((a) => ({ ...a, engagementScore: computeEngagementScore(a) }))
    .sort((a, b) => b.engagementScore - a.engagementScore)
    .slice(0, topN);
}
