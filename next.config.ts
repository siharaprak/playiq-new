import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-expect-error - Next.js types might not include eslint yet depending on the exact version
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
