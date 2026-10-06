"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";

declare global {
  interface Window {
    gtag: any;
  }
}

function GA4RouteTrackerInner({ gaId, blocked }: { gaId: string; blocked: boolean }) {
  const pathname = usePathname();
  const isFirstMount = useRef(true);

  useEffect(() => {
    // Never send page views from logged-in areas (see PublicOnlyAnalytics)
    if (blocked) return;

    if (pathname && typeof window !== "undefined" && window.gtag) {
      // Prevent double page_view firing on initial mount.
      // Next.js <GoogleAnalytics> automatically tracks the page view on script injection.
      // Skip RouteTracker configuration on the first mount to avoid duplicates.
      if (isFirstMount.current) {
        isFirstMount.current = false;
        return;
      }

      // Strip query strings entirely. Send pathname only.
      window.gtag("config", gaId, {
        page_path: pathname,
      });
    }
  }, [pathname, gaId, blocked]);

  return null;
}

export function GA4RouteTracker({ gaId, blocked = false }: { gaId: string; blocked?: boolean }) {
  return (
    <Suspense fallback={null}>
      <GA4RouteTrackerInner gaId={gaId} blocked={blocked} />
    </Suspense>
  );
}

