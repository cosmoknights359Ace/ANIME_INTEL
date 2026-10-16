import AnimeCard from "@/components/AnimeCard";
import SearchBar from "@/components/SearchBar";
import LoadMore from "@/components/LoadMore";
import { searchAnime } from "@/lib/anilist";
import { Search } from "lucide-react";

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
    <div className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:py-10 space-y-10">
      <div className="flex flex-col items-center gap-6 pt-4 text-center max-w-3xl mx-auto">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-lime-400 mb-2">
            <Search className="h-3.5 w-3.5" />
            <span>AniList Search Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {query ? (
              <>
                Results for <span className="text-lime-400">&ldquo;{query}&rdquo;</span>
              </>
            ) : (
              "Explore Anime Intelligence"
            )}
          </h1>
        </div>
        <SearchBar />
      </div>

      {query && results.length === 0 && (
        <div className="rounded-3xl border border-white/[0.08] bg-[#0c101a] py-16 px-6 text-center shadow-xl max-w-xl mx-auto">
          <p className="text-sm text-zinc-400">
            No matches found for &ldquo;{query}&rdquo;.
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Try checking for alternate romaji or English spellings.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-6">
          <p className="text-xs text-zinc-400">
            Found <span className="font-semibold text-zinc-200 tabular-nums">{results.length}</span> results for &ldquo;{query}&rdquo;
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {results.map((a, i) => (
              <AnimeCard key={`${a.id}-${i}`} anime={a} />
            ))}
          </div>
          <LoadMore
            endpoint={`/api/search?q=${encodeURIComponent(query)}`}
            initial={results}
            pageSize={PAGE_SIZE}
          />
        </div>
      )}
    </div>
  );
}
