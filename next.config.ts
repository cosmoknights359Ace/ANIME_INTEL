import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The site is previewed through these proxy hosts in dev; without this,
  // Next blocks all client JS chunks → buttons/clicks silently do nothing.
  allowedDevOrigins: [
    "work-1-evdtgxsvhqepbpiw.prod-runtime.all-hands.dev",
    "work-2-evdtgxsvhqepbpiw.prod-runtime.all-hands.dev",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "s4.anilist.co" },
      { protocol: "https", hostname: "img.anili.st" },
    ],
  },
};

export default nextConfig;
