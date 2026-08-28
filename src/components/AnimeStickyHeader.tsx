"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { AnimeSummary } from "@/lib/types";
import ListButton from "./ListButton";

// A compact bar pinned under the main header once you scroll past the hero —
// poster + title + rating + add-to-list always in reach on long anime pages.
export default function AnimeStickyHeader({ anime }: { anime: AnimeSummary }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 260);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 top-0 z-40 transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2">
          {anime.image && (
            <Link href={`/anime/${anime.id}`} className="relative h-12 w-9 shrink-0 overflow-hidden rounded">
              <Image src={anime.image} alt={anime.title} fill className="object-cover" />
            </Link>
          )}
          <div className="min-w-0 flex-1">
            <Link href={`/anime/${anime.id}`} className="block truncate text-sm font-medium">
              {anime.title}
            </Link>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              {anime.rating != null && <span className="text-orange-400">★ {anime.rating.toFixed(2)}</span>}
              {anime.type && <span>{anime.type}</span>}
              {anime.episodes != null && <span>{anime.episodes} ep</span>}
            </div>
          </div>
          <ListButton anime={anime} variant="compact" />
        </div>
      </div>
    </div>
  );
}
