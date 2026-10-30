import type { NextConfig } from "next";
import path from "path";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy-Report-Only", value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: blob: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://scdbhpcnqihaswaijptx.supabase.co wss://scdbhpcnqihaswaijptx.supabase.co; media-src 'self' blob: https://scdbhpcnqihaswaijptx.supabase.co; frame-src 'self' https://scdbhpcnqihaswaijptx.supabase.co; worker-src 'self' blob:; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: {
    '/student/course*': ['./docs/curriculum/playiq-weekend-test-20261030/PLAYIQ_COMPLETE_COURSE_MASTER_20261030.html'],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  ...(process.env.PLAYIQ_PREVIEW_BUILD === "1" ? { distDir: "build" } : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;

