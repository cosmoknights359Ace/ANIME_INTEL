"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, Flame } from "lucide-react";
import type { AnimeSummary } from "@/lib/types";
import ListButton from "./ListButton";

export default function FeaturedHero({ items }: { items: AnimeSummary[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items || items.length === 0) return null;
  const current = items[activeIndex] || items[0];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c101a] shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
      {/* Background cinematic backdrop */}
      {current.image && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 select-none">
          <Image
            src={current.image}
            alt={current.title}
            fill
            priority
            className="object-cover scale-110 blur-xl saturate-150 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c101a] via-[#0c101a]/80 to-[#0c101a]/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c101a] via-[#0c101a]/90 to-transparent" />
        </div>
      )}

      {/* Main Content Split */}
      <div className="relative z-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-8 p-6 sm:p-10 lg:p-12">
        {/* Left Column: Intel & Info */}
        <div className="flex-1 space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-lime-400">
            <Flame className="h-4 w-4 fill-lime-400" />
            <span>Featured Spotlight</span>
            <span className="text-zinc-500 font-normal">·</span>
            <span className="text-zinc-400 font-normal">注目のアニメ</span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight">
              {current.title}
            </h1>
            {current.titleJapanese && (
              <p className="mt-1 text-sm text-zinc-400 font-medium">
                {current.titleJapanese}
              </p>
            )}
          </div>

          {/* Unboxed Typographic Metadata */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-zinc-300">
            {current.rating != null && (
              <div className="flex items-center gap-1 font-bold text-amber-400">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm tabular-nums">{current.rating.toFixed(2)}</span>
                <span className="text-[11px] text-zinc-400 font-normal">/ 10</span>
              </div>
            )}
            <span className="text-zinc-600">·</span>
            <span>{current.type ?? "TV Series"}</span>
            <span className="text-zinc-600">·</span>
            <span>{current.episodes ? `${current.episodes} Episodes` : "Currently Airing"}</span>
            {current.year && (
              <>
                <span className="text-zinc-600">·</span>
                <span className="text-zinc-400">{current.year}</span>
              </>
            )}
            <span className="text-zinc-600">·</span>
            <span className={current.status === "airing" ? "text-emerald-400 font-medium" : "text-zinc-400"}>
              {current.status === "airing" ? "Currently Airing" : "Completed Series"}
            </span>
          </div>

          {/* Genres row */}
          {current.genres && current.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1 text-xs">
              {current.genres.slice(0, 4).map((g) => (
                <Link
                  key={g}
                  href={`/genre/${encodeURIComponent(g)}`}
                  className="rounded-md bg-white/[0.06] px-2.5 py-1 text-zinc-300 border border-white/5 transition hover:border-lime-400/40 hover:text-lime-300"
                >
                  {g}
                </Link>
              ))}
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              href={`/anime/${current.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-lime-300 hover:shadow-[0_0_24px_rgba(163,230,53,0.35)] active:scale-95"
            >
              <span>Explore Intel</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <ListButton anime={current} />
          </div>

          {/* Switcher Thumbnails */}
          {items.length > 1 && (
            <div className="pt-6 border-t border-white/[0.08]">
              <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 mb-2.5">
                Spotlight Selection
              </p>
              <div className="flex items-center gap-2.5">
                {items.slice(0, 4).map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`group/thumb relative flex items-center gap-2 rounded-lg p-1.5 transition-all ${
                      activeIndex === idx
                        ? "bg-white/10 ring-1 ring-lime-400/70"
                        : "bg-white/[0.03] hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="relative h-10 w-8 overflow-hidden rounded bg-zinc-800 shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="32px"
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                    <span className="hidden sm:inline-block max-w-[110px] truncate text-xs text-zinc-300 group-hover/thumb:text-white">
                      {item.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Hero Poster */}
        <div className="relative shrink-0 w-52 sm:w-64 lg:w-72 aspect-[2/3] rounded-2xl overflow-hidden border border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.8)] group">
          {current.image ? (
            <Image
              src={current.image}
              alt={current.title}
              fill
              priority
              sizes="(max-width: 640px) 208px, (max-width: 1024px) 256px, 288px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-zinc-900 text-zinc-500">
              No poster
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        </div>
      </div>
    </div>
  );
}
