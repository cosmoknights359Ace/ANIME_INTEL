"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, Sparkles, Clock, ArrowRight, Star, X } from "lucide-react";
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
      const timer = setTimeout(() => {
        setResults([]);
        setOpen(false);
      }, 0);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=8`);
        const data = await res.json();
        setResults(data.results ?? []);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query]);

  // "/" shortcut focuses search anywhere
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
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function submit(searchWord?: string) {
    const q = (searchWord ?? query).trim();
    if (q.length < 2) return;
    setOpen(false);
    saveRecent(q);
    setRecent(readRecent());
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function openTop() {
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
    if (query.trim().length < 2) {
      setOpen(list.length > 0);
    }
  }

  return (
    <div ref={boxRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        {/* Search icon */}
        <div className="pointer-events-none absolute left-4 text-zinc-400">
          <Search className="h-4 w-4" />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              openTop();
            }
            if (e.key === "Escape") {
              setOpen(false);
              inputRef.current?.blur();
            }
          }}
          onFocus={showRecent}
          placeholder="Search anime, studio, genre... (e.g. Jujutsu Kaisen, Chainsaw Man)"
          className="w-full rounded-2xl bg-[#0e121c]/90 py-3.5 pl-11 pr-24 text-sm text-zinc-100 border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.5)] placeholder:text-zinc-500 backdrop-blur-xl focus:border-lime-400/60 focus:outline-none focus:ring-2 focus:ring-lime-400/20 transition-all"
        />

        {/* Action icons / shortcut hint */}
        <div className="absolute right-3 flex items-center gap-2">
          {query ? (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
                setOpen(false);
              }}
              aria-label="Clear search"
              className="rounded-lg p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-white/10 bg-zinc-800/80 px-1.5 py-0.5 text-[10px] font-medium text-zinc-400">
              /
            </kbd>
          )}

          <button
            onClick={() => submit()}
            aria-label="Execute search"
            className="flex items-center justify-center rounded-xl bg-lime-400 px-3.5 py-1.5 text-xs font-semibold text-zinc-950 transition hover:bg-lime-300 active:scale-95 shadow-[0_0_14px_rgba(163,230,53,0.3)]"
          >
            {loading ? (
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
            ) : (
              <ArrowRight className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Dropdown Results Box */}
      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl bg-[#0e121c] border border-white/10 shadow-2xl backdrop-blur-2xl">
          {/* Live Search Results */}
          {results.length > 0 ? (
            <div>
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] text-xs font-medium text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-lime-400" />
                  Top Matches
                </span>
                <span className="text-[11px] text-zinc-500">Press ↵ to view first</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
                {results.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      saveRecent(query.trim());
                      setOpen(false);
                      router.push(`/anime/${a.id}`);
                    }}
                    className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-white/[0.04]"
                  >
                    <div className="relative h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                      {a.image && (
                        <Image
                          src={a.image}
                          alt={a.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-zinc-100">{a.title}</p>
                        {a.rating != null && (
                          <span className="flex items-center gap-1 text-xs font-medium text-amber-400 shrink-0">
                            <Star className="h-3 w-3 fill-amber-400" />
                            {a.rating.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-zinc-400">
                        {a.type ?? "Anime"} · {a.episodes ? `${a.episodes} ep` : "Ongoing"} ·{" "}
                        {a.status === "airing" ? "Airing" : "Finished"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => submit()}
                className="flex w-full items-center justify-center gap-1.5 border-t border-white/[0.06] py-3 text-xs font-medium text-lime-400 hover:text-lime-300 transition-colors"
              >
                View all results for &ldquo;{query}&rdquo;
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : query.trim().length >= 2 && !loading ? (
            <div className="p-6 text-center text-sm text-zinc-500">
              No results found for &ldquo;{query}&rdquo;. Check spelling or try a broader term.
            </div>
          ) : null}

          {/* Recent Searches */}
          {query.trim().length < 2 && recent.length > 0 && (
            <div className="p-3">
              <div className="flex items-center gap-1.5 px-2 pb-2 text-xs font-medium text-zinc-400">
                <Clock className="h-3.5 w-3.5" />
                Recent Searches
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {recent.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setQuery(r);
                      submit(r);
                    }}
                    className="flex items-center gap-1 rounded-lg bg-zinc-800/60 px-3 py-1.5 text-xs text-zinc-300 border border-white/5 transition-all hover:border-lime-400/40 hover:text-lime-300"
                  >
                    <span>{r}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
