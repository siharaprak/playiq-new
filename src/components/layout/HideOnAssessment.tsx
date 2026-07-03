'use client';

import { usePathname } from 'next/navigation';

/**
 * Hides its children when on the assessment route.
 * Used to suppress Navbar/Footer/SocialSidebar chrome during 
 * the immersive Orion first-login experience.
 */
export function HideOnAssessment({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith('/student/assessment')) return null;
  return <>{children}</>;
}
