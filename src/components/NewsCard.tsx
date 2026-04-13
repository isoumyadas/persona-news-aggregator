"use client";

import type { NewsArticle } from "@/lib/types";
import SourceBadge from "./SourceBadge";
import EngagementBar from "./EngagementBar";

interface NewsCardProps {
  article: NewsArticle;
  index: number;
}

function timeAgo(publishedAt: string): string {
  const ms = Date.now() - new Date(publishedAt).getTime();
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NewsCard({ article, index }: NewsCardProps) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      id={`news-card-${article.id}`}
      className="flat-card group block p-4 sm:p-5 fade-in-up flex flex-col justify-between"
    >
      <div>
        {/* Thumbnail - Now with a subtle grayscale/contrast treatment that clears on hover */}
        {article.imageUrl && (
          <div className="mb-4 overflow-hidden rounded-md border border-[var(--border)]">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-105 filter grayscale-[20%] group-hover:grayscale-0"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).parentElement!.style.display = "none";
              }}
            />
          </div>
        )}

        {/* Top row: rank + source */}
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="rank-badge">
            {index + 1}
          </span>
          <SourceBadge source={article.source} color={article.sourceColor} />
        </div>

        {/* Headline */}
        <h3 className="text-sm sm:text-[15px] tracking-tight font-semibold leading-relaxed mt-1 mb-1 line-clamp-2 text-[var(--foreground)]">
          {article.title}
        </h3>

        {/* Summary */}
        {article.summary && (
          <p className="text-xs sm:text-[13px] text-[var(--muted)] mt-1.5 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        )}
      </div>

      <div>
        <EngagementBar
          upvotes={article.upvotes}
          comments={article.commentCount}
          sourceType={article.sourceType}
          source={article.source}
        />

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
          <span className="text-[11px] text-[var(--muted)] font-medium uppercase tracking-wider">
            {timeAgo(article.publishedAt)}
          </span>
          <span className="text-[11px] font-semibold text-[var(--foreground)] uppercase tracking-wider group-hover:underline">
            Read →
          </span>
        </div>
      </div>
    </a>
  );
}
