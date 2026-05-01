"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

declare global {
  interface Window {
    gtag: any;
  }
}

function GA4RouteTrackerInner({ gaId }: { gaId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && typeof window !== "undefined" && window.gtag) {
      let url = pathname;
      if (searchParams && searchParams.toString()) {
        url += `?${searchParams.toString()}`;
      }
      
      window.gtag("config", gaId, {
        page_path: url,
      });
    }
  }, [pathname, searchParams, gaId]);

  return null;
}

export function GA4RouteTracker({ gaId }: { gaId: string }) {
  return (
    <Suspense fallback={null}>
      <GA4RouteTrackerInner gaId={gaId} />
    </Suspense>
  );
}
