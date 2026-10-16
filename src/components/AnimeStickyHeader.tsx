"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { AnimeSummary } from "@/lib/types";
import ListButton from "./ListButton";

// Compact bar pinned under the main navbar once user scrolls past hero
export default function AnimeStickyHeader({ anime }: { anime: AnimeSummary }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 300);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-[57px] z-20 transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="border-b border-white/10 bg-[#07090e]/90 backdrop-blur-xl shadow-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            {anime.image && (
              <Link
                href={`/anime/${anime.id}`}
                className="relative h-10 w-8 shrink-0 overflow-hidden rounded-md border border-white/10"
              >
                <Image
                  src={anime.image}
                  alt={anime.title}
                  fill
                  sizes="32px"
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </Link>
            )}
            <div className="min-w-0">
              <Link
                href={`/anime/${anime.id}`}
                className="block truncate text-sm font-semibold text-zinc-100 hover:text-lime-300 transition-colors"
              >
                {anime.title}
              </Link>
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                {anime.rating != null && (
                  <span className="flex items-center gap-1 font-medium text-amber-400">
                    <Star className="h-3 w-3 fill-amber-400" />
                    {anime.rating.toFixed(2)}
                  </span>
                )}
                <span>&middot;</span>
                <span>{anime.type ?? "Anime"}</span>
                {anime.episodes != null && (
                  <>
                    <span>&middot;</span>
                    <span>{anime.episodes} ep</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <ListButton anime={anime} variant="compact" />
          </div>
        </div>
      </div>
    </div>
  );
}
