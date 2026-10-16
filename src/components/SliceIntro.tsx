"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getRandomQuote, type AnimeQuote } from "@/lib/quotes";
import { Swords, Sparkles, ArrowRight, X, Shuffle } from "lucide-react";

const SEEN_KEY = "animeintel:heavy-slash-v3";

export default function SliceIntro() {
  const [active, setActive] = useState(false);
  const [quote, setQuote] = useState<AnimeQuote | null>(null);

  const nextQuote = useCallback(() => {
    setQuote(getRandomQuote());
  }, []);

  const dismiss = useCallback(() => {
    setActive(false);
  }, []);

  useEffect(() => {
    // Check user preference for motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const forced = params.get("slash") === "1" || params.get("slice") === "1";
    const alreadySeen = sessionStorage.getItem(SEEN_KEY);

    if (forced || !alreadySeen) {
      sessionStorage.setItem(SEEN_KEY, "true");
      const startTimer = setTimeout(() => {
        setQuote(getRandomQuote());
        setActive(true);
      }, 10);
      const stopTimer = setTimeout(() => {
        setActive(false);
      }, 3200);

      return () => {
        clearTimeout(startTimer);
        clearTimeout(stopTimer);
      };
    }

    // Custom event to replay slash and quote on demand (e.g. from nav button)
    const handleTrigger = () => {
      setQuote(getRandomQuote());
      setActive(true);
      const timer = setTimeout(() => setActive(false), 3200);
      return () => clearTimeout(timer);
    };

    window.addEventListener("animeintel:play-slash", handleTrigger);
    return () => window.removeEventListener("animeintel:play-slash", handleTrigger);
  }, []);

  // Keyboard shortcut: Escape to dismiss instantly
  useEffect(() => {
    if (!active) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        dismiss();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active, dismiss]);

  if (!active || !quote) return null;

  return (
    <div
      className="heavy-katana-overlay"
      aria-label="Anime intro sequence"
      onClick={dismiss}
      style={{ cursor: "pointer", pointerEvents: "auto" }}
    >
      {/* Deep screen split halves */}
      <div className="heavy-split-top" />
      <div className="heavy-split-bottom" />

      {/* Optical slash flare */}
      <div className="heavy-blade-flare" />

      {/* High-voltage katana blade strike */}
      <div className="heavy-katana-streak" />

      {/* Cinematic Clickable Quote Card */}
      <div
        className="heavy-quote-card"
        onClick={(e) => e.stopPropagation()}
        style={{ cursor: "default" }}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-lime-400">
            <Swords className="h-4 w-4" />
            <span>Anime Intel &middot; 名言</span>
            <Sparkles className="h-3.5 w-3.5 text-lime-300" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={nextQuote}
              title="Next Quote"
              aria-label="Next anime quote"
              className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-zinc-400 hover:text-lime-300 hover:bg-white/10 transition-colors"
            >
              <Shuffle className="h-3 w-3" />
              <span className="hidden sm:inline">Next</span>
            </button>

            <button
              onClick={dismiss}
              aria-label="Skip intro"
              className="rounded-lg p-1 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 text-xs"
            >
              <span className="hidden sm:inline text-[10px] text-zinc-500 font-mono">ESC</span>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Japanese Calligraphy Subtext */}
        {quote.japanese && (
          <p className="text-xs sm:text-sm text-zinc-400 font-medium tracking-wide mb-2 select-none">
            {quote.japanese}
          </p>
        )}

        {/* The Quote Body */}
        <blockquote className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-snug px-2 my-2">
          &ldquo;{quote.quote}&rdquo;
        </blockquote>

        {/* Character Attribution & Series Link */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/[0.08]">
          <div className="text-xs text-left">
            <span className="font-bold text-lime-300 text-sm">{quote.character}</span>
            <span className="text-zinc-500 mx-1.5">&mdash;</span>
            <span className="text-zinc-400 font-medium italic">{quote.anime}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {quote.animeId && (
              <Link
                href={`/anime/${quote.animeId}`}
                onClick={dismiss}
                className="inline-flex items-center gap-1.5 rounded-xl bg-lime-400 px-4 py-2 text-xs font-bold text-zinc-950 transition-all hover:bg-lime-300 hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(163,230,53,0.3)]"
              >
                <span>Explore Series</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}

            <button
              onClick={dismiss}
              className="rounded-xl bg-white/[0.08] px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-white/[0.15] transition-colors"
            >
              Enter Hub &rarr;
            </button>
          </div>
        </div>

        {/* Subtle timed neon countdown bar at bottom of card */}
        <div className="absolute bottom-0 inset-x-0 h-1 overflow-hidden rounded-b-3xl bg-white/5">
          <div className="h-full bg-gradient-to-r from-lime-400 to-sky-400 animate-quoteProgress" />
        </div>
      </div>
    </div>
  );
}
