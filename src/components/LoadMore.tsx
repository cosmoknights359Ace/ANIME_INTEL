"use client";

import { useState } from "react";
import AnimeCard from "./AnimeCard";
import { SkeletonGrid } from "./Skeleton";
import type { AnimeSummary } from "@/lib/types";

// Pagination: pulls subsequent pages of results from an API endpoint and
// appends them under the server-rendered first page.
export default function LoadMore({
  endpoint,
  initial,
  pageSize,
}: {
  endpoint: string; // e.g. "/api/search?q=..." or "/api/genre?g=..."
  initial: AnimeSummary[];
  pageSize: number;
}) {
  const [items, setItems] = useState<AnimeSummary[]>([]);
  const [page, setPage] = useState(1); // next AniList page number (server rendered 1)
  const [loading, setLoading] = useState(false);
  const [exhausted, setExhausted] = useState(initial.length < pageSize);

  async function fetchPage() {
    setLoading(true);
    const sep = endpoint.includes("?") ? "&" : "?";
    const res = await fetch(
      `${endpoint}${sep}p=${page + 1}&limit=${pageSize}`
    ).catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      const next: AnimeSummary[] = data.results ?? [];
      setItems((prev) => [...prev, ...next]);
      setPage((p) => p + 1);
      if (next.length < pageSize) setExhausted(true);
    }
    setLoading(false);
  }

  return (
    <>
      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {items.map((a, i) => (
            <AnimeCard key={`${a.id}-${i}`} anime={a} />
          ))}
        </div>
      )}
      {loading && <SkeletonGrid count={pageSize} />}
      {!exhausted && (
        <div className="pt-4 text-center">
          <button
            onClick={fetchPage}
            disabled={loading}
            className="rounded-full bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-200 ring-1 ring-zinc-700 transition hover:bg-zinc-700 disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </>
  );
}
