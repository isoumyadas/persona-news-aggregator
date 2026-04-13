/**
 * 7 AM IST Daily Digest Cache
 *
 * All news feeds refresh at exactly 7:00 AM IST (01:30 UTC) each day.
 * This utility calculates how many seconds remain until the next 7 AM IST,
 * so we can pass it as the `revalidate` value to Next.js caches.
 */

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // +05:30

export function getSecondsUntilNext7AMIST(): number {
  const now = new Date();

  // Current time in IST
  const nowIST = new Date(now.getTime() + IST_OFFSET_MS);

  // Today's 7 AM IST (in UTC terms: same date but hour = 7, min = 0 in IST)
  const today7AM_IST = new Date(nowIST);
  today7AM_IST.setUTCHours(7, 0, 0, 0);

  // If we've already passed 7 AM IST today, target tomorrow's 7 AM
  if (nowIST >= today7AM_IST) {
    today7AM_IST.setUTCDate(today7AM_IST.getUTCDate() + 1);
  }

  // Convert target back to real UTC
  const target7AM_UTC = new Date(today7AM_IST.getTime() - IST_OFFSET_MS);

  const diffMs = target7AM_UTC.getTime() - now.getTime();
  const diffSeconds = Math.max(60, Math.ceil(diffMs / 1000)); // minimum 60s

  return diffSeconds;
}

/**
 * Returns a formatted string representing when the daily digest was locked in.
 * e.g. "Apr 14, 2026 · 7:00 AM IST"
 */
export function getDailyDigestTimestamp(): string {
  const now = new Date();
  const nowIST = new Date(now.getTime() + IST_OFFSET_MS);
  const hour = nowIST.getUTCHours();

  // If current IST hour >= 7, today's 7 AM. Otherwise yesterday's 7 AM.
  const digestDate = new Date(nowIST);
  if (hour < 7) {
    digestDate.setUTCDate(digestDate.getUTCDate() - 1);
  }
  digestDate.setUTCHours(7, 0, 0, 0);

  return digestDate.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }) + " · 7:00 AM IST";
}
