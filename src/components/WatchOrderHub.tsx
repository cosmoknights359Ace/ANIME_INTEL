"use client";

import Link from "next/link";
import { GitBranch, ArrowRight, PlayCircle } from "lucide-react";

interface FranchiseFeature {
  id: number;
  name: string;
  jpName: string;
  tagline: string;
  difficulty: "Complex" | "Moderate" | "Direct";
  startAnimeId: number;
  totalEntries: string;
}

const FRANCHISES: FranchiseFeature[] = [
  {
    id: 1,
    name: "Fate Series",
    jpName: "フェイト",
    tagline: "Unlimited Blade Works vs Fate/Zero — solve the ultimate watch order debate.",
    difficulty: "Complex",
    startAnimeId: 10087, // Fate/Zero or UBW (356)
    totalEntries: "12+ installments",
  },
  {
    id: 2,
    name: "Monogatari Series",
    jpName: "物語シリーズ",
    tagline: "Nisio Isin's masterwork in chronological vs novel release order.",
    difficulty: "Complex",
    startAnimeId: 5081, // Bakemonogatari
    totalEntries: "10+ arcs",
  },
  {
    id: 3,
    name: "Attack on Titan",
    jpName: "進撃の巨人",
    tagline: "From Shingeki no Kyojin S1 to the Final Chapters & canon OVAs.",
    difficulty: "Direct",
    startAnimeId: 16498, // Shingeki no Kyojin
    totalEntries: "4 seasons + OVAs",
  },
  {
    id: 4,
    name: "Steins;Gate",
    jpName: "シュタインズ・ゲート",
    tagline: "Worldline divergence: original series + Episode 23β + Steins;Gate 0.",
    difficulty: "Moderate",
    startAnimeId: 9253, // Steins;Gate
    totalEntries: "2 series + Movie",
  },
];

export default function WatchOrderHub() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c101a] p-6 sm:p-8">
      {/* Ambient background light */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-lime-400/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-lime-400">
            <GitBranch className="h-4 w-4" />
            <span>Interactive Watch Orders</span>
            <span className="text-zinc-500">·</span>
            <span className="text-zinc-400 font-normal">見る順番ガイド</span>
          </div>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Where Do I Start?
          </h2>
          <p className="mt-1 text-sm text-zinc-400 max-w-xl">
            Never get lost in complex franchise timelines, prequels, and alternate routes.
            Curated sequence maps with zero spoilers.
          </p>
        </div>
        <Link
          href="/discover"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-lime-400 hover:text-lime-300 transition-colors"
        >
          <span>Find more series</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Franchise Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FRANCHISES.map((f) => (
          <Link
            key={f.id}
            href={`/anime/${f.startAnimeId}`}
            className="group relative flex flex-col justify-between rounded-2xl bg-white/[0.03] p-5 border border-white/[0.06] transition-all duration-300 hover:border-lime-400/40 hover:bg-white/[0.06] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(163,230,53,0.1)]"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                  {f.jpName}
                </span>
                <span className="text-[10px] font-medium text-zinc-400 bg-white/[0.05] px-2 py-0.5 rounded-full border border-white/5">
                  {f.difficulty}
                </span>
              </div>
              <h3 className="mt-2 text-lg font-bold text-zinc-100 group-hover:text-lime-300 transition-colors">
                {f.name}
              </h3>
              <p className="mt-1 text-xs text-zinc-400 leading-relaxed line-clamp-2">
                {f.tagline}
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-zinc-400">
              <span>{f.totalEntries}</span>
              <span className="flex items-center gap-1 font-medium text-lime-400 group-hover:translate-x-1 transition-transform">
                <PlayCircle className="h-3.5 w-3.5" />
                View Order
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
