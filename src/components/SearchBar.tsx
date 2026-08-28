"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { AnimeSummary } from "@/lib/types";

const RECENT_KEY = "ai:recent-searches";

function readRecent(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 6) : [];
  } catch {
    return [];
  }
}

function saveRecent(q: string) {
  const list = [q, ...readRecent().filter((x) => x.toLowerCase() !== q.toLowerCase())].slice(0, 6);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list));
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeSummary[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  // "/" focuses the search from anywhere on the page (unless typing).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = document.activeElement as HTMLElement | null;
      const typing =
        el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function submit(skipSave = false) {
    const q = query.trim();
    if (q.length < 2) return;
    setOpen(false);
    if (!skipSave) {
      saveRecent(q);
      setRecent(readRecent());
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function openTop() {
    // Enter does the fastest thing: jump straight to the top result.
    if (results.length > 0) {
      saveRecent(query.trim());
      setOpen(false);
      router.push(`/anime/${results[0].id}`);
    } else {
      submit();
    }
  }

  function showRecent() {
    const list = readRecent();
    setRecent(list);
    if (query.trim().length < 2) setOpen(list.length > 0);
  }

  return (
    <div ref={boxRef} className="relative w-full max-w-xl">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            openTop();
          }}
          onFocus={showRecent}
          placeholder="Search any anime… try “Attack on Titan”"
          className="w-full rounded-full bg-zinc-900 py-3 pl-5 pr-14 text-sm text-zinc-100 ring-1 ring-zinc-700 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-lime-400"
        />
        <button
          onClick={() => submit()}
          aria-label="Search"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-lime-400 px-4 py-1.5 text-sm font-semibold text-zinc-950 transition hover:bg-lime-300"
        >
          Go
        </button>
      </div>
      {open && recent.length > 0 && query.trim().length < 2 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl bg-zinc-900 ring-1 ring-zinc-700 shadow-xl">
          <p className="px-4 pt-3 text-xs uppercase tracking-wide text-zinc-500">Recent</p>
          {recent.map((r) => (
            <button
              key={r}
              onClick={() => {
                setQuery(r);
                setOpen(false);
                saveRecent(r);
                router.push(`/search?q=${encodeURIComponent(r)}`);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-zinc-200 transition hover:bg-zinc-800"
            >
              {r}
            </button>
          ))}
        </div>
      )}
      {open && query.trim().length >= 2 && (
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
              onClick={() => submit()}
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
