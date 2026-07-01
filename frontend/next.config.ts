import type { NextConfig } from "next";

// Guard against broken global localStorage polyfill on the server in the execution environment
if (typeof globalThis !== 'undefined') {
  const g = globalThis as any;
  if (g.localStorage && typeof g.localStorage.getItem !== 'function') {
    try {
      delete g.localStorage;
    } catch (e) {
      g.localStorage = {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {},
        length: 0,
        key: () => null
      };
    }
  }
}

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
};

export default nextConfig;
