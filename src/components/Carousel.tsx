"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AnimeCard from "@/components/AnimeCard";
import type { AnimeSummary } from "@/lib/types";

export default function Carousel({ items }: { items: AnimeSummary[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.75), behavior: "smooth" });
  }

  return (
    <div className="group/carousel relative">
      {/* Scrollable Track */}
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth py-2 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((a, i) => (
          <div
            key={`${a.id}-${i}`}
            className="w-[165px] shrink-0 snap-start sm:w-[195px]"
          >
            <AnimeCard anime={a} />
          </div>
        ))}
      </div>

      {/* Smooth Ambient Edge Fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#07090e] to-transparent opacity-80" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#07090e] to-transparent opacity-80" />

      {/* Navigation Arrows */}
      <button
        onClick={() => scrollBy(-1)}
        aria-label="Previous anime"
        className="absolute -left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-900/90 text-zinc-300 border border-white/10 opacity-0 shadow-xl backdrop-blur transition-all duration-200 hover:bg-zinc-800 hover:text-lime-300 hover:scale-110 group-hover/carousel:opacity-100"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => scrollBy(1)}
        aria-label="Next anime"
        className="absolute -right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-900/90 text-zinc-300 border border-white/10 opacity-0 shadow-xl backdrop-blur transition-all duration-200 hover:bg-zinc-800 hover:text-lime-300 hover:scale-110 group-hover/carousel:opacity-100"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
