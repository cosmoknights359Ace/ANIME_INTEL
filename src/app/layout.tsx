import type { Metadata } from "next";
import { Zen_Kurenaido } from "next/font/google";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import SliceIntro from "@/components/SliceIntro";
import SideNav from "@/components/SideNav";
import RandomButton from "@/components/RandomButton";
import BladeFxButton from "@/components/BladeFxButton";
import HeaderSearch from "@/components/HeaderSearch";
import "./globals.css";

const paper = Zen_Kurenaido({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-paper",
});

export const metadata: Metadata = {
  title: "AnimeIntel — anime answers, not anime data",
  description:
    "Ratings, watch order, streaming availability and more — without the clutter.",
  openGraph: {
    title: "AnimeIntel — anime answers, not anime data",
    description:
      "Ratings, watch order, streaming availability and more — without the clutter.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${paper.variable} flex min-h-screen flex-col bg-[#07090e] text-zinc-100 antialiased selection:bg-lime-400 selection:text-zinc-950`}
      >
        {/* Fast non-blocking Katana Blade Slash on initial load */}
        <SliceIntro />

        {/* Slide-out navigation drawer */}
        <SideNav />

        {/* Top Bar Contract (Zone 1: Brand | Zone 2: Nav | Zone 3: Action) */}
        <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-[#07090e]/80 backdrop-blur-xl transition-all">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6">
            {/* Zone 1: Brand wordmark (with pl-10 to leave space for hamburger button) */}
            <div className="flex items-center pl-10 sm:pl-12">
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-extrabold tracking-tight whitespace-nowrap shrink-0 group"
              >
                <span className="text-white group-hover:text-zinc-200 transition-colors">
                  Anime
                </span>
                <span className="text-lime-400 drop-shadow-[0_0_12px_rgba(163,230,53,0.6)]">
                  Intel
                </span>
                <span className="hidden sm:inline-block text-[10px] text-zinc-500 font-normal tracking-widest pl-1">
                  アニメインテル
                </span>
              </Link>
            </div>

            {/* Zone 2: Nav Links */}
            <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
              <Link
                href="/"
                className="whitespace-nowrap transition hover:text-white hover:underline underline-offset-8 decoration-lime-400"
              >
                Explore
              </Link>
              <Link
                href="/category/trending"
                className="whitespace-nowrap transition hover:text-white hover:underline underline-offset-8 decoration-lime-400"
              >
                Trending
              </Link>
              <Link
                href="/category/top-rated"
                className="whitespace-nowrap transition hover:text-white hover:underline underline-offset-8 decoration-lime-400"
              >
                Top Rated
              </Link>
              <Link
                href="/discover"
                className="whitespace-nowrap transition hover:text-lime-300 hover:underline underline-offset-8 decoration-lime-400"
              >
                Discover
              </Link>
              <Link
                href="/mylist"
                className="whitespace-nowrap transition hover:text-white hover:underline underline-offset-8 decoration-lime-400"
              >
                My List
              </Link>
            </nav>

            {/* Zone 3: Primary Action & Tools */}
            <div className="flex items-center gap-2.5 shrink-0">
              <HeaderSearch />
              <BladeFxButton />
              <RandomButton />
            </div>
          </div>
        </header>

        {/* Main Viewport Container */}
        <main className="w-full flex-1">
          {children}
        </main>

        {/* Quiet Footer */}
        <footer className="border-t border-white/[0.08] bg-[#05070a]/90 py-8 text-xs text-zinc-500">
          <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-300">AnimeIntel</span>
              <span>&middot;</span>
              <span>Anime answers, not anime data.</span>
            </div>
            <div className="flex items-center gap-4 text-zinc-400">
              <Link href="/discover" className="hover:text-lime-300 transition-colors">
                Discover
              </Link>
              <Link href="/mylist" className="hover:text-lime-300 transition-colors">
                My List
              </Link>
              <span>&middot;</span>
              <span>Data via AniList GraphQL</span>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
