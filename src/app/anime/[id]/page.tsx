import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAnimeDetail } from "@/lib/anilist";
import { getWatchOrder } from "@/lib/watchOrder";
import Timeline from "@/components/Timeline";
import ListButton, { ProgressControl } from "@/components/ListButton";
import AnimeStickyHeader from "@/components/AnimeStickyHeader";
import NextEpisode from "@/components/NextEpisode";
import { Star, ExternalLink, Sparkles } from "lucide-react";

export const revalidate = 3600;

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default async function AnimePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const anime = await getAnimeDetail(Number(id));
  if (!anime) notFound();
  const watchOrder = await getWatchOrder(anime.id).catch(() => null);

  const statusColor =
    anime.status === "airing"
      ? "text-emerald-400"
      : anime.status === "upcoming"
      ? "text-sky-400"
      : "text-zinc-400";

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:py-10 space-y-12">
      {/* Sticky header bar docking under navbar while scrolling */}
      <AnimeStickyHeader anime={anime} />

      {/* Hero section */}
      <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c101a] p-6 sm:p-10 shadow-2xl">
        {/* Subtle blurred ambient backdrop */}
        {anime.image && (
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-25">
            <Image
              src={anime.image}
              alt=""
              fill
              className="object-cover blur-3xl scale-125"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c101a] via-[#0c101a]/80 to-transparent" />
          </div>
        )}

        <div className="flex flex-col gap-8 sm:flex-row items-start">
          {/* Main Poster */}
          <div className="relative aspect-[2/3] w-48 sm:w-56 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
            {anime.image && (
              <Image
                src={anime.image}
                alt={anime.title}
                fill
                priority
                sizes="(max-width: 640px) 192px, 224px"
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            )}
          </div>

          {/* Details & Primary Metadata */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                {anime.title}
              </h1>
              {anime.titleJapanese && (
                <p className="mt-1 text-sm text-zinc-400 font-medium">
                  {anime.titleJapanese}
                </p>
              )}
            </div>

            {/* Score & Ranking Row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {anime.rating != null && (
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  <span className="text-xl tabular-nums">{anime.rating.toFixed(2)}</span>
                  <span className="text-xs font-normal text-zinc-500">
                    ({anime.scoredBy?.toLocaleString()} votes)
                  </span>
                </div>
              )}
              {anime.popularityRank != null && (
                <span className="text-xs text-zinc-400">
                  #{anime.popularityRank} most popular
                </span>
              )}
              <span className="text-zinc-600">&middot;</span>
              <span className={`text-xs font-semibold uppercase tracking-wider ${statusColor}`}>
                {anime.status === "airing" ? "Currently Airing" : anime.status}
              </span>
              {anime.nextEpisodeAt && <NextEpisode airingAt={anime.nextEpisodeAt} />}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <ListButton anime={anime} />
              <ProgressControl animeId={anime.id} />
            </div>

            {/* Spec Definition Grid */}
            <dl className="grid grid-cols-2 gap-x-8 gap-y-3 pt-2 text-xs sm:grid-cols-3 border-t border-white/[0.08]">
              <div>
                <dt className="text-zinc-500">Episodes</dt>
                <dd className="mt-0.5 text-zinc-200 font-medium">{anime.episodes ?? "?"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Duration</dt>
                <dd className="mt-0.5 text-zinc-200 font-medium">{anime.episodeDuration ?? "?"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Air Date</dt>
                <dd className="mt-0.5 text-zinc-200 font-medium">
                  {formatDate(anime.airedFrom) ?? "?"}
                  {anime.airedTo ? ` – ${formatDate(anime.airedTo)}` : ""}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Studio</dt>
                <dd className="mt-0.5 text-zinc-200 font-medium">{anime.studios.join(", ") || "?"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Source</dt>
                <dd className="mt-0.5 text-zinc-200 font-medium">{anime.source ?? "?"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Genres & Themes</dt>
                <dd className="flex flex-wrap gap-1 pt-1">
                  {[...anime.genres, ...anime.themes].map((g) => (
                    <Link
                      key={g}
                      href={`/genre/${encodeURIComponent(g)}`}
                      className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[11px] text-zinc-300 border border-white/5 transition hover:border-lime-400/40 hover:text-lime-300"
                    >
                      {g}
                    </Link>
                  ))}
                </dd>
              </div>
            </dl>

            {/* Curated Taste Tags */}
            {anime.tasteTags.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-lime-400" />
                  Curated Taste Tags
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {anime.tasteTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg bg-lime-400/10 px-2.5 py-1 text-xs text-lime-300 border border-lime-400/25"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Where to Stream */}
            {anime.streaming.length > 0 && (
              <div className="pt-2">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Where to stream
                </h2>
                <div className="flex flex-wrap gap-2">
                  {anime.streaming.map((s, i) => (
                    <a
                      key={`${s.platform}-${i}`}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-white/[0.05] px-3.5 py-2 text-xs font-medium text-zinc-200 border border-white/10 transition-colors hover:border-lime-400/50 hover:bg-white/[0.1] hover:text-lime-300"
                    >
                      <span>{s.platform}</span>
                      <ExternalLink className="h-3 w-3 text-zinc-400" />
                    </a>
                  ))}
                </div>
                <p className="mt-1.5 text-[11px] text-zinc-500">
                  Regional availability may vary &mdash; check your local streaming catalog.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Synopsis Section */}
      {anime.synopsis && (
        <section className="rounded-3xl border border-white/[0.08] bg-[#0c101a] p-6 sm:p-8">
          <h2 className="mb-3 text-xl font-bold tracking-tight text-white">Synopsis</h2>
          <p className="max-w-4xl text-sm leading-relaxed whitespace-pre-line text-zinc-300">
            {anime.synopsis}
          </p>
        </section>
      )}

      {/* Characters & Voice Cast */}
      {anime.characters.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-white">Main Characters & Cast</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {anime.characters.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-2.5 rounded-2xl bg-[#0c101a] p-2.5 border border-white/[0.07] transition hover:border-white/20"
              >
                {c.image && (
                  <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-zinc-100">{c.name}</p>
                  <p className="text-[10px] text-zinc-400">{c.role}</p>
                  {c.voiceActors[0] && (
                    <p className="truncate text-[10px] text-zinc-500">
                      CV: {c.voiceActors[0].name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Watch Order Timeline */}
      {watchOrder && (
        <section className="rounded-3xl border border-white/[0.08] bg-[#0c101a] p-6 sm:p-8">
          <Timeline order={watchOrder} />
        </section>
      )}

      {/* Related Franchise Entries */}
      {anime.relations.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-white">Related Series & Media</h2>
          <div className="flex flex-wrap gap-2">
            {anime.relations.map((r, i) =>
              r.animeId ? (
                <Link
                  key={`${r.animeId}-${i}`}
                  href={`/anime/${r.animeId}`}
                  className="rounded-xl bg-[#0c101a] px-3.5 py-2 text-xs font-medium text-zinc-300 border border-white/10 transition hover:border-lime-400/50 hover:text-lime-300"
                >
                  <span className="text-zinc-500 uppercase tracking-wider text-[10px] mr-1.5">
                    {r.type}:
                  </span>
                  {r.title}
                </Link>
              ) : (
                <span
                  key={`${r.title}-${i}`}
                  className="rounded-xl bg-[#0c101a]/50 px-3.5 py-2 text-xs text-zinc-500 border border-white/5"
                >
                  <span className="uppercase tracking-wider text-[10px] mr-1.5">{r.type}:</span>
                  {r.title}
                </span>
              )
            )}
          </div>
        </section>
      )}
    </div>
  );
}
