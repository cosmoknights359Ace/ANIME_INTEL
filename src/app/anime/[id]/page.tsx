import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAnimeDetail } from "@/lib/anilist";
import { getWatchOrder } from "@/lib/watchOrder";
import Timeline from "@/components/Timeline";
import ListButton, { ProgressControl } from "@/components/ListButton";
import NextEpisode from "@/components/NextEpisode";

export const revalidate = 3600;

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function StatusPill({ status }: { status: string }) {
  const style: Record<string, string> = {
    airing: "bg-emerald-500/20 text-emerald-300",
    finished: "bg-zinc-500/20 text-zinc-300",
    upcoming: "bg-sky-500/20 text-sky-300",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${style[status]}`}>
      {status === "airing" ? "Currently airing" : status}
    </span>
  );
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

  return (
    <div className="space-y-10">
      {/* Above the fold: what is it, is it good, where do I watch */}
      <section className="flex flex-col gap-8 sm:flex-row">
        <div className="relative aspect-[2/3] w-48 shrink-0 overflow-hidden rounded-xl bg-zinc-800">
          {anime.image && (
            <Image src={anime.image} alt={anime.title} fill className="object-cover" priority />
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{anime.title}</h1>
            {anime.titleJapanese && (
              <p className="mt-1 text-sm text-zinc-500">{anime.titleJapanese}</p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {anime.rating != null && (
              <span className="text-lg font-semibold text-orange-400">
                ★ {anime.rating.toFixed(2)}
                <span className="ml-1 text-xs font-normal text-zinc-500">
                  ({anime.scoredBy?.toLocaleString()} votes)
                </span>
              </span>
            )}
            {anime.popularityRank != null && (
              <span className="text-zinc-400">#{anime.popularityRank} most popular</span>
            )}
            <StatusPill status={anime.status} />
            {anime.nextEpisodeAt && <NextEpisode airingAt={anime.nextEpisodeAt} />}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <ListButton anime={anime} />
            <ProgressControl animeId={anime.id} />
          </div>

          <dl className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-zinc-500">Episodes</dt>
              <dd>{anime.episodes ?? "?"}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Episode length</dt>
              <dd>{anime.episodeDuration ?? "?"}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Aired</dt>
              <dd>
                {formatDate(anime.airedFrom) ?? "?"}
                {anime.airedTo ? ` – ${formatDate(anime.airedTo)}` : ""}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">Studio</dt>
              <dd>{anime.studios.join(", ") || "?"}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Source</dt>
              <dd>{anime.source ?? "?"}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Genres</dt>
              <dd className="flex flex-wrap gap-1.5 pt-1">
                {[...anime.genres, ...anime.themes].map((g) => (
                  <Link
                    key={g}
                    href={`/genre/${encodeURIComponent(g)}`}
                    className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-300 ring-1 ring-zinc-700 transition hover:text-lime-300 hover:ring-lime-400"
                  >
                    {g}
                  </Link>
                ))}
              </dd>
            </div>
          </dl>

          {anime.tasteTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {anime.tasteTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-lime-400/10 px-3 py-1 text-xs text-lime-300 ring-1 ring-lime-400/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {anime.streaming.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-medium text-zinc-400">
                Where to watch
              </h2>
              <div className="flex flex-wrap gap-2">
                {anime.streaming.map((s, i) => (
                  <a
                    key={`${s.platform}-${i}`}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm transition hover:bg-zinc-700"
                  >
                    {s.platform} ↗
                  </a>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-zinc-600">
                Availability varies by region — check the platform for your country.
              </p>
            </div>
          )}
        </div>
      </section>

      {anime.synopsis && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">Synopsis</h2>
          <p className="max-w-3xl text-sm leading-relaxed whitespace-pre-line text-zinc-300">{anime.synopsis}</p>
        </section>
      )}

      {anime.characters.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Characters</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {anime.characters.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-2 rounded-lg bg-zinc-900 p-2 ring-1 ring-zinc-800"
              >
                {c.image && (
                  <Image
                    src={c.image}
                    alt={c.name}
                    width={40}
                    height={56}
                    className="rounded object-cover"
                  />
                )}
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{c.name}</p>
                  <p className="text-[10px] text-zinc-500">{c.role}</p>
                  {c.voiceActors[0] && (
                    <p className="truncate text-[10px] text-zinc-400">
                      CV: {c.voiceActors[0].name}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {watchOrder && (
        <section>
          <Timeline order={watchOrder} />
        </section>
      )}

      {anime.relations.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-semibold">Related</h2>
          <div className="flex flex-wrap gap-2">
            {anime.relations.map((r, i) =>
              r.animeId ? (
                <Link
                  key={`${r.animeId}-${i}`}
                  href={`/anime/${r.animeId}`}
                  className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm ring-1 ring-zinc-800 transition hover:ring-zinc-600"
                >
                  <span className="text-zinc-500">{r.type}:</span> {r.title}
                </Link>
              ) : (
                <span
                  key={`${r.title}-${i}`}
                  className="rounded-lg bg-zinc-900/50 px-3 py-1.5 text-sm text-zinc-500 ring-1 ring-zinc-800/50"
                >
                  {r.type}: {r.title}
                </span>
              )
            )}
          </div>
        </section>
      )}
    </div>
  );
}
