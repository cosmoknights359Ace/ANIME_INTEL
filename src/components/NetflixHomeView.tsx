"use client";

import { useState } from "react";
import Link from "next/link";
import NetflixBillboard from "@/components/NetflixBillboard";
import NetflixRail from "@/components/NetflixRail";
import WatchOrderHub from "@/components/WatchOrderHub";
import QuickPreviewModal from "@/components/QuickPreviewModal";
import SearchBar from "@/components/SearchBar";
import { Compass, ArrowRight } from "lucide-react";
import type { AnimeSummary } from "@/lib/types";

interface CategoryWithItems {
  slug: string;
  title: string;
  subtitle?: string;
  items: AnimeSummary[];
}

const QUICK_TAGS = [
  { label: "Trending Hits", href: "/category/trending" },
  { label: "Top 100 Classics", href: "/category/top-rated" },
  { label: "Airing Right Now", href: "/category/airing" },
  { label: "Quick Binge (<13 Ep)", href: "/category/binge-worthy" },
  { label: "Action Hype", href: "/genre/Action" },
  { label: "Psychological", href: "/genre/Psychological" },
  { label: "Sci-Fi & Cyber", href: "/genre/Sci-Fi" },
];

export default function NetflixHomeView({
  spotlightItems,
  categories,
}: {
  spotlightItems: AnimeSummary[];
  categories: CategoryWithItems[];
}) {
  const [previewAnime, setPreviewAnime] = useState<AnimeSummary | null>(null);

  return (
    <div className="w-full space-y-10 sm:space-y-14 pb-16">
      {/* 1. Full-Bleed Netflix Billboard Hero */}
      <NetflixBillboard
        items={spotlightItems}
        onOpenPreview={(anime) => setPreviewAnime(anime)}
      />

      {/* 2. Command Search & Quick Vibe Selector */}
      <section className="mx-auto max-w-4xl space-y-4 text-center px-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Instant Anime Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Ratings, where to stream, and chronological watch orders &mdash; zero bloat.
          </p>
        </div>

        <SearchBar />

        {/* Quick Filter Tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs">
          <span className="text-zinc-500 mr-1 text-[11px] uppercase tracking-wider font-semibold">
            Quick Jump:
          </span>
          {QUICK_TAGS.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className="rounded-lg bg-white/[0.04] px-3 py-1 text-zinc-300 border border-white/5 transition hover:border-lime-400/40 hover:text-lime-300 hover:bg-white/[0.08]"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Edge-to-Edge Netflix Content Rails */}
      <div className="w-full space-y-10 sm:space-y-14">
        {categories.slice(0, 2).map((c, idx) => (
          <NetflixRail
            key={c.slug}
            title={idx === 0 ? "Top 10 in Anime Today" : c.title}
            subtitle={c.subtitle}
            slug={c.slug}
            items={c.items}
            isTop10={idx === 0}
            onPreview={(anime) => setPreviewAnime(anime)}
          />
        ))}

        {/* 4. Interactive Franchise Watch Order Hub */}
        <div className="w-full px-4 sm:px-8 lg:px-14">
          <WatchOrderHub />
        </div>

        {/* 5. Remaining Netflix Rails */}
        {categories.slice(2).map((c) => (
          <NetflixRail
            key={c.slug}
            title={c.title}
            subtitle={c.subtitle}
            slug={c.slug}
            items={c.items}
            onPreview={(anime) => setPreviewAnime(anime)}
          />
        ))}
      </div>

      {/* 6. Vibe Discovery CTA Banner */}
      <section className="mx-4 sm:mx-8 lg:mx-14 relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-r from-lime-500/10 via-[#0c101a] to-sky-500/10 p-8 sm:p-12 text-center">
        <div className="relative z-10 mx-auto max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-300 border border-lime-400/20">
            <Compass className="h-3.5 w-3.5" />
            <span>Interactive Vibe Engine</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Not sure what to watch next?
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Filter by your current mood &mdash; whether you want an adrenaline rush, a late-night
            existential trip, wholesome comfort, or a high-IQ mystery.
          </p>
          <div className="pt-2">
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-3 text-sm font-bold text-zinc-950 shadow-[0_0_24px_rgba(163,230,53,0.35)] transition hover:bg-lime-300 active:scale-95"
            >
              <span>Launch Vibe Finder</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. In-Place Quick Preview Modal */}
      <QuickPreviewModal
        anime={previewAnime}
        onClose={() => setPreviewAnime(null)}
      />
    </div>
  );
}
