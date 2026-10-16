"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search, X, Star, ArrowRight, Loader2 } from "lucide-react";
import type { AnimeSummary } from "@/lib/types";

export default function HeaderSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AnimeSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Focus input when opened
  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  // Click outside to collapse
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (!query) setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [query]);

  // "/" keyboard shortcut
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const el = document.activeElement as HTMLElement | null;
      const isTyping =
        el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      const timer = setTimeout(() => setResults([]), 0);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=6`);
        const data = await res.json();
        setResults(data.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  function submit() {
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <div ref={containerRef} className="relative flex items-center">
      {open ? (
        <div className="flex items-center gap-2 rounded-full bg-[#0a0d15] px-3 py-1.5 border border-white/15 shadow-xl transition-all w-48 sm:w-64 lg:w-72">
          <Search className="h-4 w-4 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
              if (e.key === "Escape") {
                setOpen(false);
                setQuery("");
              }
            }}
            placeholder="Search anime..."
            className="w-full bg-transparent text-xs text-white placeholder:text-zinc-500 focus:outline-none"
          />
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-lime-400 shrink-0" />
          ) : query ? (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="text-zinc-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setOpen(false)}
              className="text-zinc-400 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open search bar"
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] text-zinc-300 border border-white/10 hover:border-lime-400/50 hover:text-lime-300 transition-colors"
        >
          <Search className="h-4 w-4" />
        </button>
      )}

      {/* Floating mini search results dropdown when open */}
      {open && results.length > 0 && (
        <div className="absolute right-0 top-12 z-50 w-72 sm:w-80 overflow-hidden rounded-2xl bg-[#0c101a] border border-white/15 shadow-2xl backdrop-blur-2xl">
          <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.05]">
            {results.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  setOpen(false);
                  router.push(`/anime/${a.id}`);
                }}
                className="flex w-full items-center gap-2.5 p-2.5 text-left hover:bg-white/[0.06] transition-colors"
              >
                <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded bg-zinc-800">
                  {a.image && (
                    <Image
                      src={a.image}
                      alt={a.title}
                      fill
                      sizes="36px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-zinc-100">{a.title}</p>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mt-0.5">
                    {a.rating != null && (
                      <span className="flex items-center gap-0.5 text-amber-400 font-medium">
                        <Star className="h-2.5 w-2.5 fill-amber-400" />
                        {a.rating.toFixed(1)}
                      </span>
                    )}
                    <span>&middot;</span>
                    <span>{a.type ?? "Anime"}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={submit}
            className="flex w-full items-center justify-center gap-1.5 border-t border-white/[0.08] py-2 text-[11px] font-semibold text-lime-400 hover:text-lime-300 transition-colors"
          >
            <span>See all results</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
