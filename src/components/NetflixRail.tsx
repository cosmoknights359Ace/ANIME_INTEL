"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import AnimeCard from "@/components/AnimeCard";
import type { AnimeSummary } from "@/lib/types";

export default function NetflixRail({
  title,
  subtitle,
  slug,
  items,
  isTop10 = false,
  onPreview,
}: {
  title: string;
  subtitle?: string;
  slug?: string;
  items: AnimeSummary[];
  isTop10?: boolean;
  onPreview?: (anime: AnimeSummary) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollBy(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  }

  if (!items || items.length === 0) return null;

  return (
    <section className="relative group/rail w-full px-4 sm:px-8 lg:px-14 space-y-3">
      {/* Category Header Row */}
      <div className="flex items-end justify-between px-1">
        <div className="flex items-center gap-3">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover/rail:text-lime-300 transition-colors">
            {title}
          </h2>
          {isTop10 && (
            <span className="rounded bg-lime-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-lime-300 border border-lime-400/30">
              Top 10 Today
            </span>
          )}
          {subtitle && (
            <p className="hidden sm:block text-xs text-zinc-400 font-normal">{subtitle}</p>
          )}
        </div>

        {slug && (
          <Link
            href={`/category/${slug}`}
            className="group/link flex items-center gap-1 text-xs font-semibold text-lime-400 hover:text-lime-300 transition-colors"
          >
            <span>Explore all</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-1" />
          </Link>
        )}
      </div>

      {/* Horizontal Scroll Track Container */}
      <div className="relative">
        {/* Scrollable Track */}
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-3.5 sm:gap-4 overflow-x-auto scroll-smooth py-3 px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((anime, i) => (
            <div
              key={`${anime.id}-${i}`}
              className={`shrink-0 snap-start flex items-center ${
                isTop10
                  ? "w-[200px] sm:w-[245px] lg:w-[275px]"
                  : "w-[155px] sm:w-[185px] lg:w-[205px]"
              }`}
            >
              {/* Netflix-style Giant Number Rank */}
              {isTop10 && (
                <div
                  className="relative -mr-5 sm:-mr-7 select-none z-0 pointer-events-none"
                  aria-hidden="true"
                >
                  <span
                    className="text-7xl sm:text-8xl lg:text-9xl font-black leading-none tracking-tighter"
                    style={{
                      WebkitTextStroke: "3px rgba(255, 255, 255, 0.28)",
                      color: "#07090e",
                      textShadow: "0 0 20px rgba(0,0,0,0.8)",
                    }}
                  >
                    {i + 1}
                  </span>
                </div>
              )}

              {/* Card Container */}
              <div className="relative z-10 flex-1">
                <AnimeCard anime={anime} onPreview={onPreview} />
              </div>
            </div>
          ))}
        </div>

        {/* Ambient Edge Scrims */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#07090e] to-transparent opacity-80" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#07090e] to-transparent opacity-80" />

        {/* Floating Netflix-style Navigation Paddles */}
        <button
          onClick={() => scrollBy(-1)}
          aria-label="Scroll rail left"
          className="absolute -left-2 top-1/2 z-20 flex h-14 w-10 -translate-y-1/2 items-center justify-center rounded-r-xl bg-black/85 text-white border-y border-r border-white/15 opacity-0 shadow-2xl backdrop-blur-md transition-all duration-200 hover:bg-zinc-800 hover:text-lime-300 hover:w-12 group-hover/rail:opacity-100"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={() => scrollBy(1)}
          aria-label="Scroll rail right"
          className="absolute -right-2 top-1/2 z-20 flex h-14 w-10 -translate-y-1/2 items-center justify-center rounded-l-xl bg-black/85 text-white border-y border-l border-white/15 opacity-0 shadow-2xl backdrop-blur-md transition-all duration-200 hover:bg-zinc-800 hover:text-lime-300 hover:w-12 group-hover/rail:opacity-100"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
}
