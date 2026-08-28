import AnimeCard from "@/components/AnimeCard";
import SearchBar from "@/components/SearchBar";
import LoadMore from "@/components/LoadMore";
import { searchAnime } from "@/lib/anilist";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 48;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? await searchAnime(query, PAGE_SIZE).catch(() => []) : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-6 pt-6 text-center">
        <h1 className="text-2xl font-bold">
          {query ? (
            <>
              Results for <span className="text-lime-400">“{query}”</span>
            </>
          ) : (
            "Search anime"
          )}
        </h1>
        <SearchBar />
      </div>

      {query && results.length === 0 && (
        <p className="py-16 text-center text-zinc-500">
          Nothing found for “{query}” — try a different spelling?
        </p>
      )}

      {results.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {results.map((a, i) => (
              <AnimeCard key={`${a.id}-${i}`} anime={a} />
            ))}
          </div>
          <LoadMore endpoint={`/api/search?q=${encodeURIComponent(query)}`} initial={results} pageSize={PAGE_SIZE} />
        </>
      )}
    </div>
  );
}
