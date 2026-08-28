"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const GENRES = ["Action", "Adventure", "Drama", "Fantasy", "Sci-Fi", "Romance", "Comedy"];

// Left-side hamburger menu: a 3-bar button fixed on the left edge of the
// screen that slides a navigation drawer in from the left.
export default function SideNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close whenever we navigate.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* 3-bar trigger, nudged off the left edge, vertically centered */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="group fixed left-0 top-1/2 z-40 -translate-y-1/2 rounded-r-lg border border-zinc-800 bg-zinc-950/90 px-2.5 py-4 backdrop-blur shadow-lg transition hover:border-lime-400/60"
      >
        <span className="flex flex-col gap-1.5">
          <span className="h-[2px] w-4 rounded bg-zinc-300 transition group-hover:bg-lime-300" />
          <span className="h-[2px] w-4 rounded bg-zinc-300 transition group-hover:bg-lime-300" />
          <span className="h-[2px] w-4 rounded bg-zinc-300 transition group-hover:bg-lime-300" />
        </span>
      </button>

      {/* backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* the drawer sliding in from the left */}
      <nav
        aria-label="Menu"
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-zinc-800 bg-zinc-950 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Anime<span className="text-lime-400">Intel</span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded p-1.5 text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
          >
            ✕
          </button>
        </div>

        <div className="px-2">
          <Link href="/" onClick={() => setOpen(false)} className="sidenav-link">
            Home
          </Link>
          <Link href="/discover" onClick={() => setOpen(false)} className="sidenav-link">
            Discover
          </Link>
          <Link href="/mylist" onClick={() => setOpen(false)} className="sidenav-link">
            My List
          </Link>
        </div>

        <div className="mt-4 px-4">
          <p className="px-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Genres
          </p>
          <div className="mt-1 px-2">
            {GENRES.map((g) => (
              <Link
                key={g}
                href={`/genre/${encodeURIComponent(g)}`}
                onClick={() => setOpen(false)}
                className="sidenav-link"
              >
                {g}
              </Link>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 w-full border-t border-zinc-800 px-4 py-3 text-xs text-zinc-600">
          Data from AniList
        </div>
      </nav>
    </>
  );
}
