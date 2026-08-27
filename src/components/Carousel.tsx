"use client";

import { useRef } from "react";
import AnimeCard from "@/components/AnimeCard";
import type { AnimeSummary } from "@/lib/types";

export default function Carousel({ items }: { items: AnimeSummary[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className="group/carousel relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((a, i) => (
          <div
            key={`${a.id}-${i}`}
            className="w-[160px] shrink-0 snap-start transition-transform duration-200 hover:-translate-y-1 sm:w-[180px]"
          >
            <AnimeCard anime={a} />
          </div>
        ))}
      </div>

      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-zinc-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-zinc-950 to-transparent" />

      <button
        onClick={() => scrollBy(-1)}
        aria-label="Scroll left"
        className="absolute -left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-zinc-800/90 p-2 text-zinc-200 ring-1 ring-zinc-700 opacity-0 shadow-lg transition hover:bg-zinc-700 group-hover/carousel:opacity-100"
      >
        ←
      </button>
      <button
        onClick={() => scrollBy(1)}
        aria-label="Scroll right"
        className="absolute -right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-zinc-800/90 p-2 text-zinc-200 ring-1 ring-zinc-700 opacity-0 shadow-lg transition hover:bg-zinc-700 group-hover/carousel:opacity-100"
      >
        →
      </button>
    </div>
  );
}
