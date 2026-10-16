"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Play, Flame, GitBranch, ChevronLeft, ChevronRight, Info } from "lucide-react";
import type { AnimeSummary } from "@/lib/types";
import ListButton from "./ListButton";

export default function NetflixBillboard({
  items,
  onOpenPreview,
}: {
  items: AnimeSummary[];
  onOpenPreview?: (anime: AnimeSummary) => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!items || items.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [items, isPaused]);

  if (!items || items.length === 0) return null;
  const current = items[activeIndex] || items[0];

  // Derive pseudo match percentage from rating (e.g. 8.9 -> 98% Match)
  const matchPct = current.rating ? Math.min(Math.round(current.rating * 10 + 9), 99) : 95;
  const backdropSrc = current.bannerImage || current.image;

  function prevSpotlight() {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }

  function nextSpotlight() {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full overflow-hidden bg-black min-h-[560px] sm:min-h-[640px] lg:min-h-[700px] flex items-center"
    >
      {/* True cinematic landscape backdrop with cross-fade */}
      {backdropSrc && (
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <Image
            key={backdropSrc}
            src={backdropSrc}
            alt={current.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105 opacity-55 blur-[0.3px] transition-all duration-1000 ease-out"
            referrerPolicy="no-referrer"
          />
          {/* Netflix-style multi-stop gradient scrims */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090e] via-[#07090e]/85 to-transparent sm:w-4/5 lg:w-3/5" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-black/50" />
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#07090e] to-transparent" />
        </div>
      )}

      {/* Billboard Hero Content */}
      <div className="relative z-10 w-full px-6 sm:px-12 lg:px-16 py-16 sm:py-24 max-w-4xl space-y-4">
        {/* Top Kicker */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-lime-400">
          <Flame className="h-4 w-4 fill-lime-400 animate-pulse" />
          <span>Trending Spotlight</span>
          <span className="text-zinc-600">&middot;</span>
          <span className="text-zinc-400 font-medium">#{activeIndex + 1} of {items.length}</span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white leading-none text-balance drop-shadow-xl">
            {current.title}
          </h1>
          {current.titleJapanese && (
            <p className="text-sm sm:text-base text-zinc-400 font-medium tracking-wide">
              {current.titleJapanese}
            </p>
          )}
        </div>

        {/* Netflix-style Metadata Bar */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs sm:text-sm font-semibold text-zinc-300">
          <span className="text-lime-400 font-bold">{matchPct}% Match</span>
          <span className="text-zinc-600">&middot;</span>
          {current.rating != null && (
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span>{current.rating.toFixed(2)}</span>
            </div>
          )}
          <span className="text-zinc-600">&middot;</span>
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[11px] font-bold text-zinc-200 border border-white/10">
            {current.type ?? "TV"}
          </span>
          <span className="text-zinc-600">&middot;</span>
          <span>{current.episodes ? `${current.episodes} Episodes` : "Currently Airing"}</span>
          {current.year && (
            <>
              <span className="text-zinc-600">&middot;</span>
              <span className="text-zinc-400 font-normal">{current.year}</span>
            </>
          )}
        </div>

        {/* Synopsis Hook */}
        {current.description && (
          <p className="line-clamp-3 text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed pt-1 drop-shadow">
            {current.description}
          </p>
        )}

        {/* Genres Row */}
        {current.genres && current.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 text-xs pt-1">
            {current.genres.slice(0, 4).map((g) => (
              <span
                key={g}
                className="rounded-md bg-white/[0.08] px-2.5 py-1 text-zinc-300 border border-white/5"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {/* Netflix-style Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-3">
          <Link
            href={`/anime/${current.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-6 sm:px-7 py-3 text-sm font-extrabold text-black transition-all hover:bg-zinc-200 hover:scale-105 active:scale-95 shadow-xl"
          >
            <Play className="h-4 w-4 fill-black" />
            <span>Explore Intel</span>
          </Link>

          {onOpenPreview && (
            <button
              onClick={() => onOpenPreview(current)}
              className="inline-flex items-center gap-2 rounded-xl bg-white/[0.12] px-5 py-3 text-sm font-bold text-white border border-white/15 hover:bg-white/[0.2] transition-colors"
            >
              <Info className="h-4 w-4" />
              <span>Quick Preview</span>
            </button>
          )}

          <ListButton anime={current} />

          <Link
            href={`/anime/${current.id}`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/[0.08] px-4 py-3 text-xs sm:text-sm font-semibold text-zinc-200 border border-white/10 hover:bg-white/[0.15] hover:text-lime-300 transition-colors"
          >
            <GitBranch className="h-4 w-4" />
            <span>Watch Order</span>
          </Link>
        </div>

        {/* Featured Switcher Thumbnails with Auto-Advance Progress */}
        {items.length > 1 && (
          <div className="pt-4 sm:pt-6">
            <div className="flex items-center justify-between max-w-xs mb-2">
              <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                Trending Spotlights
              </p>
              <span className="text-[10px] text-zinc-600">
                {isPaused ? "Paused" : "Auto-advance"}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              {items.slice(0, 5).map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative h-12 w-9 sm:h-14 sm:w-10 overflow-hidden rounded-lg border transition-all duration-300 ${
                    activeIndex === idx
                      ? "border-lime-400 ring-2 ring-lime-400/50 scale-110 shadow-lg"
                      : "border-white/15 opacity-55 hover:opacity-100 hover:scale-105"
                  }`}
                  aria-label={`Switch to ${item.title}`}
                >
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="40px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Side Arrow Navigation */}
      <button
        onClick={prevSpotlight}
        aria-label="Previous spotlight"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-12 w-10 items-center justify-center rounded-r-xl bg-black/60 text-white/70 hover:text-lime-300 hover:bg-black/90 hover:w-12 transition-all backdrop-blur-md border-y border-r border-white/10"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={nextSpotlight}
        aria-label="Next spotlight"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 hidden md:flex h-12 w-10 items-center justify-center rounded-l-xl bg-black/60 text-white/70 hover:text-lime-300 hover:bg-black/90 hover:w-12 transition-all backdrop-blur-md border-y border-l border-white/10"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
