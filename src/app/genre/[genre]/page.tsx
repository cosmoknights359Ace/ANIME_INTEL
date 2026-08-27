import Link from "next/link";
import { notFound } from "next/navigation";
import { getGenreAnime } from "@/lib/anilist";
import AnimeCard from "@/components/AnimeCard";

export const revalidate = 3600;

export default async function GenrePage({
  params,
}: {
  params: Promise<{ genre: string }>;
}) {
  const { genre } = await params;
  const decoded = decodeURIComponent(genre);
  if (decoded.length < 2 || decoded.length > 40) notFound();

  const results = await getGenreAnime(decoded).catch(() => []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-500">Genre</p>
        <h1 className="text-3xl font-bold tracking-tight capitalize">{decoded}</h1>
      </div>

      {results.length === 0 ? (
        <div className="rounded-xl bg-zinc-900 p-10 text-center ring-1 ring-zinc-800">
          <p className="text-zinc-400">No anime found for this genre.</p>
          <Link href="/" className="mt-2 inline-block text-sm text-lime-400 hover:text-lime-300">
            ← Back to home
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {results.map((a) => (
            <AnimeCard key={a.id} anime={a} />
          ))}
        </div>
      )}
    </div>
  );
}