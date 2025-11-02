import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 🚫 Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;