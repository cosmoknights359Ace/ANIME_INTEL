import Link from "next/link";
import Image from "next/image";
import SearchBar from "@/components/SearchBar";
import Carousel from "@/components/Carousel";
import { getTopAnime, getSeasonAnime } from "@/lib/anilist";

export const revalidate = 3600;

export default async function Home() {
  const [top, season] = await Promise.all([
    getTopAnime(60).catch(() => []),
    getSeasonAnime(20).catch(() => []),
  ]);
  // Reuse the same covers for the blurred hero backdrop (already fetched)
  const backdrop = top.slice(0, 8).map((a) => a.image).filter(Boolean) as string[];

  return (
    <div className="space-y-12">
      <section className="relative -mx-4 flex flex-col items-center gap-6 overflow-hidden px-4 py-16 text-center sm:py-20">
        {/* Blurred collage of popular anime covers */}
        {backdrop.length > 0 && (
          <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
            <div className="flex h-full items-stretch opacity-50 blur-lg saturate-[1.3]">
              {backdrop.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt=""
                  fill={false}
                  width={300}
                  height={420}
                  className="h-full flex-1 object-cover"
                />
              ))}
            </div>
            {/* fade into the page background */}
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/70 via-zinc-950/55 to-zinc-950" />
          </div>
        )}

        <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
          Anime answers, <span className="text-lime-400 drop-shadow-[0_0_18px_rgba(163,230,53,0.35)]">not anime data.</span>
        </h1>
        <p className="max-w-xl text-zinc-300">
          Ratings, watch order, where to stream — without the clutter.
        </p>
        <SearchBar />
        <Link
          href="/discover"
          className="rounded-full bg-lime-400 px-6 py-2.5 text-sm font-semibold text-zinc-950 shadow-[0_0_24px_rgba(163,230,53,0.4)] transition hover:bg-lime-300"
        >
          Not sure? Find your next watch →
        </Link>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Top rated right now</h2>
        <Carousel items={top} />
      </section>

      {season.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Airing this season</h2>
            <Link href="/discover" className="text-sm text-zinc-500 transition hover:text-lime-300">
              Explore more →
            </Link>
          </div>
          <Carousel items={season} />
        </section>
      )}
    </div>
  );
}
