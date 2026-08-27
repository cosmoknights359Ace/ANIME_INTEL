"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { AnimeSummary } from "@/lib/types";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeSummary[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results ?? []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function submit() {
    const q = query.trim();
    if (q.length < 2) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div ref={boxRef} className="relative w-full max-w-xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            submit();
          }}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search any anime… try “Attack on Titan”"
          className="w-full rounded-full bg-zinc-900 py-3 pl-5 pr-14 text-sm text-zinc-100 ring-1 ring-zinc-700 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
        />
        <button
          onClick={submit}
          aria-label="Search"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-lime-400 px-4 py-1.5 text-sm font-semibold text-zinc-950 transition hover:bg-lime-300"
        >
          Go
        </button>
      </div>
      {open && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-zinc-700 shadow-xl">
          {loading && <p className="px-4 py-3 text-sm text-zinc-500">Searching…</p>}
          {!loading && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-zinc-500">No results found.</p>
          )}
          {!loading &&
            results.slice(0, 8).map((a) => (
              <Link
                key={a.id}
                href={`/anime/${a.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-zinc-800"
              >
                {a.image && (
                  <Image
                    src={a.image}
                    alt=""
                    width={36}
                    height={50}
                    className="rounded object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-zinc-100">{a.title}</p>
                  <p className="text-xs text-zinc-500">
                    {a.type ?? ""}
                    {a.year ? ` · ${a.year}` : ""}
                    {a.rating != null ? ` · ★ ${a.rating.toFixed(1)}` : ""}
                  </p>
                </div>
              </Link>
            ))}
          {!loading && results.length > 0 && (
            <button
              onClick={submit}
              className="w-full bg-zinc-800/60 px-4 py-2.5 text-center text-xs font-medium text-lime-300 transition hover:bg-zinc-800"
            >
              See all results for “{query}” →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
