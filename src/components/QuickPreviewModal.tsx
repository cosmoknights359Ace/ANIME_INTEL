"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Star, Play, ArrowRight } from "lucide-react";
import type { AnimeSummary } from "@/lib/types";
import ListButton from "./ListButton";

export default function QuickPreviewModal({
  anime,
  onClose,
}: {
  anime: AnimeSummary | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!anime) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [anime, onClose]);

  if (!anime) return null;

  const matchPct = anime.rating ? Math.min(Math.round(anime.rating * 10 + 9), 99) : 95;
  const backdropSrc = anime.bannerImage || anime.image;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-[#0c101a] border border-white/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close preview"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-zinc-300 hover:text-white hover:bg-black border border-white/20 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Media Header Banner */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
          {backdropSrc ? (
            <Image
              src={backdropSrc}
              alt={anime.title}
              fill
              sizes="(max-width: 768px) 100vw, 680px"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-500">
              No artwork available
            </div>
          )}
          {/* Ambient scrims */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c101a] via-[#0c101a]/30 to-black/40" />

          {/* Floating poster thumbnail on the bottom-left */}
          {anime.image && (
            <div className="absolute bottom-4 left-6 hidden sm:block h-28 w-20 overflow-hidden rounded-xl border border-white/20 shadow-2xl">
              <Image
                src={anime.image}
                alt={anime.title}
                fill
                sizes="80px"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Quick title on banner for mobile */}
          <div className="absolute bottom-4 left-6 sm:left-30 right-16">
            <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-md line-clamp-1">
              {anime.title}
            </h2>
            {anime.titleJapanese && (
              <p className="text-xs text-zinc-300 font-medium truncate">
                {anime.titleJapanese}
              </p>
            )}
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-4">
          {/* Metadata bar */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-semibold text-zinc-300">
            <span className="text-lime-400 font-bold">{matchPct}% Match</span>
            <span className="text-zinc-600">&middot;</span>
            {anime.rating != null && (
              <div className="flex items-center gap-1 text-amber-400 font-bold">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                <span>{anime.rating.toFixed(2)}</span>
              </div>
            )}
            <span className="text-zinc-600">&middot;</span>
            <span className="rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-200 border border-white/10">
              {anime.type ?? "TV"}
            </span>
            <span className="text-zinc-600">&middot;</span>
            <span>{anime.episodes ? `${anime.episodes} Episodes` : "Currently Airing"}</span>
            {anime.year && (
              <>
                <span className="text-zinc-600">&middot;</span>
                <span className="text-zinc-400 font-normal">{anime.year}</span>
              </>
            )}
          </div>

          {/* Synopsis */}
          {anime.description ? (
            <p className="line-clamp-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {anime.description}
            </p>
          ) : (
            <p className="text-xs text-zinc-500 italic">
              Explore the intel page for detailed episode guides, characters, voice actors, and timeline notes.
            </p>
          )}

          {/* Genres */}
          {anime.genres && anime.genres.length > 0 && (
            <div className="flex flex-wrap gap-1.5 text-xs pt-1">
              {anime.genres.map((g) => (
                <span
                  key={g}
                  className="rounded-md bg-white/[0.06] px-2.5 py-1 text-zinc-300 border border-white/5"
                >
                  {g}
                </span>
              ))}
            </div>
          )}

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href={`/anime/${anime.id}`}
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-2.5 text-xs sm:text-sm font-bold text-zinc-950 transition hover:bg-lime-300 active:scale-95 shadow-[0_0_20px_rgba(163,230,53,0.3)]"
              >
                <Play className="h-4 w-4 fill-zinc-950" />
                <span>Full Intelligence</span>
              </Link>

              <ListButton anime={anime} />
            </div>

            <Link
              href={`/anime/${anime.id}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-lime-300 transition-colors"
            >
              <span>Watch Order & Specs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
