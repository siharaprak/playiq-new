import type { Metadata } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SocialSidebar } from "@/components/layout/SocialSidebar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PlayIQ | Imagine. Build. Grow.",
  description:
    "PlayIQ is a hybrid digital and physical Learning Operating System. Future-proof learning with AI-powered STEM education, magnetic building kits, and guided digital experiences.",
  keywords: ["STEM", "education", "magnetic blocks", "AI learning", "PlayIQ"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${orbitron.variable} font-sans min-h-screen flex flex-col pt-24`}
      >
        <Navbar />
        <SocialSidebar />
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
