"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";

declare global {
  interface Window {
    gtag: any;
  }
}

function GA4RouteTrackerInner({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const isFirstMount = useRef(true);

  useEffect(() => {
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
  }, [pathname, gaId]);

  return null;
}

export function GA4RouteTracker({ gaId }: { gaId: string }) {
  return (
    <Suspense fallback={null}>
      <GA4RouteTrackerInner gaId={gaId} />
    </Suspense>
  );
}

