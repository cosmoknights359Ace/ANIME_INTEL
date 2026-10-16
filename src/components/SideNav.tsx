"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Compass,
  Bookmark,
  Home,
  Flame,
  Star,
  Tv,
  Film,
  Sparkles,
  GitBranch,
} from "lucide-react";

const GENRES = [
  "Action",
  "Adventure",
  "Drama",
  "Fantasy",
  "Sci-Fi",
  "Romance",
  "Comedy",
  "Mystery",
  "Psychological",
  "Supernatural",
];

const CURATED_CATEGORIES = [
  { label: "Trending Hits", slug: "trending", icon: Flame },
  { label: "All-Time Best", slug: "top-rated", icon: Star },
  { label: "Airing Now", slug: "airing", icon: Tv },
  { label: "Must-Watch", slug: "must-watch", icon: Film },
  { label: "Binge-Worthy", slug: "binge-worthy", icon: Sparkles },
];

export default function SideNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close whenever we navigate.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* 3-bar trigger, fixed top-left corner */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open navigation drawer"
        className="group fixed left-3 top-[4.25rem] z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0c101a]/90 text-zinc-300 shadow-xl backdrop-blur-xl transition hover:border-lime-400/50 hover:text-lime-300 hover:scale-105 active:scale-95"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Backdrop overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* The drawer sliding in from the left */}
      <nav
        aria-label="Main Navigation Menu"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-white/10 bg-[#0a0d15] p-5 shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-lg font-extrabold tracking-tight"
            >
              <span className="text-white">Anime</span>
              <span className="text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]">
                Intel
              </span>
              <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-zinc-400 border border-white/5">
                情報
              </span>
            </Link>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/[0.08] hover:text-zinc-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Primary Routes */}
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="sidenav-link"
            >
              <Home className="h-4 w-4 text-lime-400" />
              <span>Home</span>
            </Link>
            <Link
              href="/discover"
              onClick={() => setOpen(false)}
              className="sidenav-link"
            >
              <Compass className="h-4 w-4 text-lime-400" />
              <span>Vibe Discovery</span>
            </Link>
            <Link
              href="/mylist"
              onClick={() => setOpen(false)}
              className="sidenav-link"
            >
              <Bookmark className="h-4 w-4 text-lime-400" />
              <span>My List</span>
            </Link>
          </div>

          {/* Curated Categories */}
          <div>
            <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Curated Collections
            </p>
            <div className="mt-2 space-y-1">
              {CURATED_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    onClick={() => setOpen(false)}
                    className="sidenav-link text-xs"
                  >
                    <Icon className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{cat.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Genres Section */}
          <div>
            <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
              Browse Genres
            </p>
            <div className="mt-2 grid grid-cols-2 gap-1 px-1">
              {GENRES.map((g) => (
                <Link
                  key={g}
                  href={`/genre/${encodeURIComponent(g)}`}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2.5 py-1.5 text-xs text-zinc-400 transition hover:bg-white/[0.06] hover:text-lime-300"
                >
                  {g}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-white/[0.08] pt-4 text-xs text-zinc-500">
          <p className="flex items-center gap-1.5">
            <GitBranch className="h-3.5 w-3.5 text-zinc-400" />
            <span>AniList GraphQL Engine</span>
          </p>
          <p className="mt-1 text-[11px] text-zinc-600">
            Ratings &middot; Watch Orders &middot; Streaming
          </p>
        </div>
      </nav>
    </>
  );
}
