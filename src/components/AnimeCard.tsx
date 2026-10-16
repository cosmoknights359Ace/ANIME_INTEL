"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Info } from "lucide-react";
import type { AnimeSummary } from "@/lib/types";
import ListButton from "./ListButton";

export default function AnimeCard({
  anime,
  onPreview,
}: {
  anime: AnimeSummary;
  onPreview?: (anime: AnimeSummary) => void;
}) {
  const statusLabel =
    anime.status === "airing"
      ? "Airing"
      : anime.status === "finished"
      ? "Finished"
      : "Upcoming";

  const statusColor =
    anime.status === "airing"
      ? "text-emerald-400"
      : anime.status === "upcoming"
      ? "text-sky-400"
      : "text-zinc-400";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl bg-[#0e121c] border border-white/[0.07] transition-all duration-300 hover:-translate-y-1 hover:border-lime-400/30 hover:shadow-[0_12px_32px_-8px_rgba(163,230,53,0.15)]">
      {/* Poster Media Box */}
      <Link href={`/anime/${anime.id}`} className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900 block">
        {anime.image ? (
          <Image
            src={anime.image}
            alt={anime.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-zinc-500">
            No cover art
          </div>
        )}

        {/* Ambient bottom gradient scrim */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0e121c] via-[#0e121c]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Rating overlay badge at top-left */}
        {anime.rating != null && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-xs font-semibold text-amber-400 backdrop-blur-md border border-white/10 shadow-sm">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="tabular-nums">{anime.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Action triggers on top-right */}
        <div className="absolute right-2 top-2 z-10 flex items-center gap-1">
          {onPreview && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onPreview(anime);
              }}
              title="Quick Preview"
              aria-label="Quick Preview"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-black/70 text-zinc-300 border border-white/15 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-black transition-all"
            >
              <Info className="h-4 w-4" />
            </button>
          )}
          <ListButton anime={anime} variant="compact" />
        </div>
      </Link>

      {/* Card Content & Metadata */}
      <div className="flex flex-1 flex-col justify-between p-3.5">
        <div>
          <Link href={`/anime/${anime.id}`} className="group/title block">
            <h3
              className="line-clamp-2 text-sm font-semibold text-zinc-100 group-hover/title:text-lime-300 transition-colors"
              title={anime.title}
            >
              {anime.title}
            </h3>
          </Link>
          {anime.titleJapanese && (
            <p className="mt-0.5 truncate text-[11px] text-zinc-500 font-normal">
              {anime.titleJapanese}
            </p>
          )}
        </div>

        {/* Clean unboxed metadata with dot separators */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-zinc-300">{anime.type ?? "TV"}</span>
            <span aria-hidden="true">·</span>
            <span>{anime.episodes ? `${anime.episodes} ep` : "Ongoing"}</span>
            <span aria-hidden="true">·</span>
            <span className={statusColor}>{statusLabel}</span>
          </div>

          {onPreview && (
            <button
              onClick={() => onPreview(anime)}
              className="text-[10px] text-zinc-500 hover:text-lime-300 transition-colors"
            >
              Preview
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
