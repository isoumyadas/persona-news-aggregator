import type { NewsArticle } from "@/lib/types";
import NewsCard from "./NewsCard";
import LoadingGrid from "./LoadingGrid";
import RefreshFooter from "./RefreshFooter";

interface NewsGridProps {
  articles: NewsArticle[];
  error: string | null;
  lastUpdated: string;
}

export default function NewsGrid({ articles, error, lastUpdated }: NewsGridProps) {
  if (error && articles.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="glass-card p-8 text-center max-w-md">
          <p className="text-3xl mb-3">🔍</p>
          <p className="text-[var(--muted)] text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!error && articles.length === 0) {
    return <LoadingGrid />;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
        {articles.map((article, i) => (
          <NewsCard key={article.id} article={article} index={i} />
        ))}
      </div>
    </>
  );
}
