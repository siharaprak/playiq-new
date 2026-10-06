"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GA4RouteTracker } from "@/components/analytics/GA4RouteTracker";
import { isTrackingExcluded } from "@/lib/analytics/trackingExclusion";

/**
 * Logged-in areas where Google Analytics must never run.
 * Student, parent and admin dashboards can contain children's activity,
 * so analytics is limited to public marketing pages.
 */
const ANALYTICS_BLOCKED_PREFIXES = [
  "/student",
  "/parent",
  "/admin",
  "/settings",
  "/discussions",
  "/login",
];

/** Whole-segment match, so /parents (public) is not caught by /parent. */
export function isAnalyticsBlockedPath(pathname: string): boolean {
  return ANALYTICS_BLOCKED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );
}

export function PublicOnlyAnalytics({ gaId }: { gaId: string }) {
  const pathname = usePathname() ?? "/";
  // Internal team traffic is checked in the browser after mount; until then GA stays off
  const [excluded, setExcluded] = useState(true);
  useEffect(() => {
    setExcluded(isTrackingExcluded());
  }, []);
  const blocked = excluded || isAnalyticsBlockedPath(pathname);

  // Google's documented opt-out flag. It is set during render, which runs
  // before the router updates browser history, so the GA script (if it was
  // already loaded on a public page) drops every hit while on a blocked page,
  // including automatic history-based page views.
  if (typeof window !== "undefined") {
    // eslint-disable-next-line react-hooks/immutability
    (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = blocked;
  }

  return (
    <>
      {/* Only load the GA script when the visitor lands on a public page */}
      {!blocked && <GoogleAnalytics gaId={gaId} />}
      <GA4RouteTracker gaId={gaId} blocked={blocked} />
    </>
  );
}
