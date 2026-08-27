import Link from "next/link";
import Image from "next/image";
import type { AnimeSummary } from "@/lib/types";
import ListButton from "./ListButton";

const STATUS_STYLE: Record<string, string> = {
  airing: "bg-emerald-500/20 text-emerald-300",
  finished: "bg-zinc-500/20 text-zinc-300",
  upcoming: "bg-sky-500/20 text-sky-300",
};

export default function AnimeCard({ anime }: { anime: AnimeSummary }) {
  return (
    <Link
      href={`/anime/${anime.id}`}
      className="group block overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-zinc-800 transition hover:ring-zinc-600"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-800">
        {anime.image ? (
          <Image
            src={anime.image}
            alt={anime.title}
            fill
            sizes="(max-width: 640px) 50vw, 200px"
            className="object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-600">No image</div>
        )}
        <div className="absolute right-2 top-2">
          <ListButton anime={anime} variant="compact" />
        </div>
      </div>
      <div className="space-y-1.5 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-zinc-100">{anime.title}</h3>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          {anime.rating != null && <span className="text-orange-400">★ {anime.rating.toFixed(1)}</span>}
          {anime.type && <span>{anime.type}</span>}
          {anime.episodes != null && <span>{anime.episodes} ep</span>}
        </div>
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide ${STATUS_STYLE[anime.status]}`}
        >
          {anime.status}
        </span>
      </div>
    </Link>
  );
}
