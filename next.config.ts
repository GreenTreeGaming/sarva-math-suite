import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  eslint: {
    // 🚫 Prevent Next.js from running ESLint during builds
    ignoreDuringBuilds: true,
  },
}

export default nextConfig