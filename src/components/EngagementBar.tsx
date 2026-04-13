import { ArrowUp, MessageSquare, Heart, CirclePlay, AtSign } from "lucide-react";
import type { NewsArticle } from "@/lib/types";

interface EngagementBarProps {
  upvotes: number;
  comments: number;
  sourceType: NewsArticle["sourceType"];
  source: string;
}

const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

export default function EngagementBar({ upvotes, comments, sourceType, source }: EngagementBarProps) {
  // ── YouTube videos ────────────────────────────────────────────────
  // if (sourceType === "youtube") {
  //   return (
  //     <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[var(--border)] text-xs text-[var(--muted)]">
  //       <CirclePlay size={13} strokeWidth={1.5} />
  //       <span className="truncate max-w-[160px]">{source}</span>
  //     </div>
  //   );
  // }

  // // ── Twitter / X posts ─────────────────────────────────────────────
  // if (sourceType === "twitter") {
  //   return (
  //     <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--border)] text-xs">
  //       <span className="flex items-center gap-1 text-[var(--foreground)]">
  //         <AtSign size={13} strokeWidth={1.5} />
  //         <span className="font-medium">{source}</span>
  //       </span>
  //       {upvotes > 0 && (
  //         <span className="text-[var(--muted)]">
  //           <Heart size={12} className="inline mr-1" strokeWidth={2} />{fmt(upvotes)}
  //         </span>
  //       )}
  //     </div>
  //   );
  // }

  // ── RSS / NewsAPI — no real engagement numbers ─────────────────────
  if (sourceType === "rss" || sourceType === "newsapi") return null;

  const isDevTo = sourceType === "devto";
  const UpIcon = isDevTo ? Heart : ArrowUp;

  return (
    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--border)] text-xs">
      <span className="flex items-center gap-1.5 text-[var(--foreground)] font-medium">
        <UpIcon size={13} strokeWidth={1.5} />
        {fmt(upvotes)}
      </span>
      <span className="flex items-center gap-1.5 text-[var(--muted)]">
        <MessageSquare size={13} strokeWidth={1.5} />
        {fmt(comments)}
      </span>
    </div>
  );
}
