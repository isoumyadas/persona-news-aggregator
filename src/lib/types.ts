export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source: string;
  sourceColor: string;
  publishedAt: string;
  summary: string | null;
  imageUrl: string | null;

  upvotes: number;
  commentCount: number;
  engagementScore: number;

  sourceType: "hackernews" | "reddit" | "rss" | "newsapi" | "devto" | "youtube";

  subreddit?: string;
  hnId?: number;
}

export type LearningHubTab = "learning" | "updates" | "tools";

export interface LearningResource {
  id: string;
  title: string;
  hubTab: LearningHubTab;
  description: string;
  url: string;
  source: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  free: boolean;
  tags: string[];
  /** Phase in the learning roadmap (1–5) */
  phase: number;
  /** Step number within the phase */
  stepNumber: number;
}

export interface FetchResult<T> {
  data: T[];
  error: string | null;
  lastUpdated: string;
}

/** Finance news grouped by source for per-source section layout */
export interface FinanceSourceGroup {
  sourceName: string;
  sourceColor: string;
  articles: NewsArticle[];
}

export interface HNStory {
  id: number;
  title: string;
  url?: string;
  score: number;
  descendants: number;
  time: number;
  by: string;
  type: "story" | "job" | "comment" | "poll";
}

export interface RedditPost {
  id: string;
  title: string;
  url: string;
  permalink: string;
  subreddit: string;
  score: number;
  num_comments: number;
  created_utc: number;
  selftext: string;
  thumbnail: string;
  preview?: {
    images: Array<{ source: { url: string } }>;
  };
  is_self: boolean;
}
