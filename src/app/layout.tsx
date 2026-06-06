import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SocialSidebar } from "@/components/layout/SocialSidebar";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GA4RouteTracker } from "@/components/analytics/GA4RouteTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PlayIQ | Imagine. Build. Grow.",
  description:
    "PlayIQ is a next-generation Digital Learning Operating System. Future-proof learning with AI-powered STEM education, interactive study modules, and guided digital experiences.",
  keywords: ["STEM", "education", "AI learning", "PlayIQ", "study coaching"],
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
        className={`${inter.variable} ${spaceGrotesk.variable} font-sans min-h-screen flex flex-col pt-24`}
        suppressHydrationWarning
      >
        {gaId && (
          <>
            <GoogleAnalytics gaId={gaId} />
            <GA4RouteTracker gaId={gaId} />
          </>
        )}
        <ThemeProvider>
          <Navbar />
          <SocialSidebar />
          <div className="flex-grow">{children}</div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
