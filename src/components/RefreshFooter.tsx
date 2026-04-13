"use client";

import { useState, useEffect } from "react";

interface RefreshFooterProps {
  lastUpdated: string;
}

/**
 * Client component that accurately shows "X mins ago" for the last cache fill time.
 * Fixes the "Updated 0 mins ago" bug — server-side Date.now() was always ~0ms
 * from lastUpdated since both were set in the same render cycle.
 * Now we compute the diff on the client, after mount, using the real wall clock.
 */
export default function RefreshFooter({ lastUpdated }: RefreshFooterProps) {
  const [mounted,  setMounted]  = useState(false);
  const [minsAgo,  setMinsAgo]  = useState(0);

  useEffect(() => {
    const compute = () => {
      const ms = Date.now() - new Date(lastUpdated).getTime();
      setMinsAgo(Math.max(0, Math.round(ms / 60_000)));
    };
    compute();
    setMounted(true);
    const id = setInterval(compute, 60_000); // re-evaluate every minute
    return () => clearInterval(id);
  }, [lastUpdated]);

  const istTime = new Date(lastUpdated).toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour:     "2-digit",
    minute:   "2-digit",
  });

  const istDate = new Date(lastUpdated).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    month:    "short",
    day:      "numeric",
  });

  // SSR fallback — no "X mins ago" until client mounts
  if (!mounted) {
    return (
      <p className="text-xs text-center text-gray-400 dark:text-gray-600 mt-6 py-2">
        📅 Daily Digest · {istDate} · Fetched at {istTime} IST · Refreshes daily
      </p>
    );
  }

  const agoLabel =
    minsAgo === 0         ? "Just fetched"
    : minsAgo < 60        ? `${minsAgo} min ago`
    : minsAgo < 1440      ? `${Math.round(minsAgo / 60)}h ago`
    :                       `${Math.round(minsAgo / 1440)}d ago`;

  return (
    <p className="text-xs text-center text-gray-400 dark:text-gray-600 mt-6 py-2">
      📅 Daily Digest · {istDate} · Fetched at {istTime} IST · {agoLabel} · Refreshes daily
    </p>
  );
}
