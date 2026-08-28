"use client";

import { useState } from "react";
import AnimeCard from "./AnimeCard";
import type { AnimeSummary } from "@/lib/types";

// Search pagination: pulls subsequent pages of results from /api/search and
// appends them under the server-rendered first page (search/page.tsx).
export default function LoadMore({
  query,
  initial,
  pageSize,
}: {
  query: string;
  initial: AnimeSummary[];
  pageSize: number;
}) {
  const [items, setItems] = useState<AnimeSummary[]>([]);
  const [page, setPage] = useState(1); // next AniList page number
  const [loading, setLoading] = useState(false);
  // The server rendered page 1 already, so the first fetch asks for page 2.
  const [exhausted, setExhausted] = useState(initial.length < pageSize);

  async function fetchPage() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&p=${page + 1}&limit=${pageSize}`
      );
      const data = await res.json();
      const next: AnimeSummary[] = data.results ?? [];
      setItems((prev) => [...prev, ...next]);
      setPage((p) => p + 1);
      if (next.length < pageSize) setExhausted(true);
    } finally {
      setLoading(false);
    }
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
