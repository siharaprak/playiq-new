import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SocialSidebar } from "@/components/layout/SocialSidebar";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { HideOnAssessment } from "@/components/layout/HideOnAssessment";
import { PublicOnlyAnalytics } from "@/components/analytics/PublicOnlyAnalytics";
import { EarlyAccessPopup } from "@/components/forms/EarlyAccessPopup";
import { ORGANIZATION_JSON_LD, SITE_NAME } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

// Defaults for every page. Pages override title/description/canonical; openGraph is
// replaced (not merged) by any page that sets it, so only shared fields live here.
export const metadata: Metadata = {
  metadataBase: new URL("https://weplayiq.com"),
  applicationName: SITE_NAME,
  title: "PlayIQ | AI-Guided STEM Learning for Teens 13–17",
  description:
    "PlayIQ (We Play IQ) is AI-guided STEM learning for teens 13–17: effort-gated hints, active-recall worksheets and a Parent Proof Packet showing real progress.",
  keywords: ["PlayIQ", "We Play IQ", "STEM learning for teens", "AI learning", "study coaching"],
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0f1e",
};

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('playiq-theme');
                  if (theme === 'light') {
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans min-h-screen flex flex-col pt-20 sm:pt-24 antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ORGANIZATION_JSON_LD).replace(/</g, "\\u003c"),
          }}
        />
        {gaId && <PublicOnlyAnalytics gaId={gaId} />}
        <ThemeProvider>
          <Navbar />
          <HideOnAssessment>
            <SocialSidebar />
          </HideOnAssessment>
          <div className="flex-grow">{children}</div>
          <HideOnAssessment>
            <Footer />
          </HideOnAssessment>
          <EarlyAccessPopup />
        </ThemeProvider>
      </body>
    </html>
  );
}

