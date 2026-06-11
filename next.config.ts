import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
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

