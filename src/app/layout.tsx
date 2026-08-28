import type { Metadata } from "next";
import { Zen_Kurenaido } from "next/font/google";
import Link from "next/link";
import SliceIntro from "@/components/SliceIntro";
import SideNav from "@/components/SideNav";
import "./globals.css";

const paper = Zen_Kurenaido({ weight: "400", subsets: ["latin"], variable: "--font-paper" });

export const metadata: Metadata = {
  title: "AnimeIntel — anime answers, not anime data",
  description:
    "Ratings, watch order, streaming availability and more — without the clutter.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${paper.variable} flex min-h-screen flex-col bg-zinc-950 text-zinc-100 antialiased`}>
        <SliceIntro />
        <SideNav />
        <header>
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <Link href="/" className="text-lg font-bold tracking-tight">
              Anime<span className="text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]">Intel</span>
            </Link>
            <nav className="flex items-center gap-4 text-sm">
              <Link href="/discover" className="text-zinc-400 transition hover:text-lime-300">
                Discover
              </Link>
              <Link href="/mylist" className="text-zinc-400 transition hover:text-lime-300">
                My List
              </Link>
            </nav>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_12px_rgba(249,115,22,0.9)]" />
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
        <footer>
          <div className="h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent shadow-[0_0_12px_rgba(249,115,22,0.9)]" />
          <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-zinc-600">
            Data from AniList · Anime answers, not anime data
          </div>
        </footer>
      </body>
    </html>
  );
}
