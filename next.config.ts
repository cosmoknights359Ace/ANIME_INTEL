import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output is for container runtimes; on Vercel it causes next-server.js.nft.json ENOENT
  output: process.env.VERCEL ? undefined : "standalone",
  // Allow preview proxy origins in development mode
  allowedDevOrigins: [
    "ais-dev-jsw2yfjg6ydqib6zifsndn-901533360401.asia-southeast1.run.app",
    "ais-pre-jsw2yfjg6ydqib6zifsndn-901533360401.asia-southeast1.run.app",
    "**.run.app",
    "*.asia-southeast1.run.app",
    "*.run.app",
    "localhost:3000",
    "127.0.0.1:3000",
    "**.all-hands.dev",
    "work-1-evdtgxsvhqepbpiw.prod-runtime.all-hands.dev",
    "work-2-evdtgxsvhqepbpiw.prod-runtime.all-hands.dev",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.anilist.co" },
      { protocol: "https", hostname: "s4.anilist.co" },
      { protocol: "https", hostname: "img.anili.st" },
    ],
  },
};

export default nextConfig;
