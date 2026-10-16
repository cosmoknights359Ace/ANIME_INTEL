"use client";

import { useState } from "react";
import AnimeCard from "@/components/AnimeCard";
import { SkeletonGrid } from "@/components/Skeleton";
import type { AnimeSummary } from "@/lib/types";
import { MOODS, LENGTHS } from "@/lib/moods";
import { Compass, Clock, RotateCcw, ArrowLeft, Sparkles, Filter } from "lucide-react";

type Step = "mood" | "length" | "results";

const GENRES = ["Action", "Adventure", "Drama", "Fantasy", "Sci-Fi", "Romance", "Comedy", "Thriller"];
const SCORE_MIN = [0, 50, 70, 80, 90];

export default function DiscoverPage() {
  const [step, setStep] = useState<Step>("mood");
  const [mood, setMood] = useState<string | null>(null);
  const [moodLabel, setMoodLabel] = useState("");
  const [results, setResults] = useState<AnimeSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const [pickedLength, setPickedLength] = useState<string | null>(null);
  const [startersOnly, setStartersOnly] = useState(true);

  // Refine filters
  const [genre, setGenre] = useState<string | null>(null);
  const [minScore, setMinScore] = useState(70);
  const [sort, setSort] = useState<"score" | "popular">("score");

  async function run(
    moodId: string,
    lengthId: string,
    genreId: string | null,
    s: number,
    sortBy: "score" | "popular"
  ) {
    setLoading(true);
    setStep("results");
    try {
      const params = new URLSearchParams({
        mood: moodId,
        length: lengthId,
        starters: startersOnly ? "1" : "0",
        minScore: String(s),
        sort: sortBy,
      });
      if (genreId) params.set("genre", genreId);
      const res = await fetch(`/api/discover?${params}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setMoodLabel(data.mood ?? "");
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function pickMood(id: string, label: string) {
    setMood(id);
    setMoodLabel(label);
    setStep("length");
  }

  function pickLength(lengthId: string) {
    setPickedLength(lengthId);
    run(mood!, lengthId, genre, minScore, sort);
  }

  function filterGenre(g: string | null) {
    setGenre(g);
    run(mood!, pickedLength!, g, minScore, sort);
  }

  function filterScore(s: number) {
    setMinScore(s);
    run(mood!, pickedLength!, genre, s, sort);
  }

  function filterSort(v: "score" | "popular") {
    setSort(v);
    run(mood!, pickedLength!, genre, minScore, v);
  }

  function restart() {
    setStep("mood");
    setMood(null);
    setPickedLength(null);
    setResults([]);
    setGenre(null);
    setMinScore(70);
    setSort("score");
  }

  return (
    <div className="mx-auto max-w-5xl w-full px-4 py-8 sm:px-6 lg:py-10 space-y-8">
      {/* Step Progress Tracker */}
      <div className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {[
          { key: "mood", label: "1. Vibe Selection" },
          { key: "length", label: "2. Length & Format" },
          { key: "results", label: "3. Intelligence Picks" },
        ].map((item, i) => {
          const steps: Step[] = ["mood", "length", "results"];
          const active = steps.indexOf(step) >= i;
          return (
            <div key={item.key} className="flex items-center gap-3">
              {i > 0 && (
                <div
                  className={`h-px w-8 sm:w-12 transition-colors ${
                    active ? "bg-lime-400" : "bg-white/10"
                  }`}
                />
              )}
              <span className={`transition-colors ${active ? "text-lime-400" : "text-zinc-600"}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {step === "mood" && (
        <section className="text-center space-y-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-lime-400">
              <Compass className="h-3.5 w-3.5" />
              <span>Intuitive Discovery</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              What are you in the mood for?
            </h1>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto">
              Select an emotional frequency &mdash; our intelligence engine will curate the highest-rated matches.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-5">
            {MOODS.map((m) => (
              <button
                key={m.id}
                onClick={() => pickMood(m.id, m.label)}
                className={`group flex flex-col items-center justify-center gap-3 rounded-2xl p-6 border transition-all duration-300 active:scale-95 ${
                  mood === m.id
                    ? "bg-lime-400/10 border-lime-400 text-lime-300 shadow-[0_0_25px_rgba(163,230,53,0.25)]"
                    : "bg-[#0c101a] border-white/[0.07] hover:border-lime-400/50 hover:bg-white/[0.04] text-zinc-200"
                }`}
              >
                <span className="text-4xl transition-transform duration-300 group-hover:scale-125">
                  {m.emoji}
                </span>
                <span className="text-sm font-semibold">{m.label}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === "length" && (
        <section className="text-center space-y-8 max-w-lg mx-auto">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-lime-400">
              <Clock className="h-3.5 w-3.5" />
              <span>Commitment Budget</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              How much time do you have?
            </h1>
            <p className="text-sm text-zinc-400">
              Selected vibe: <span className="font-semibold text-lime-300">{moodLabel}</span>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {LENGTHS.map((l) => (
              <button
                key={l.id}
                onClick={() => pickLength(l.id)}
                className={`w-full rounded-2xl px-6 py-4 text-sm font-semibold border transition-all active:scale-98 ${
                  pickedLength === l.id
                    ? "bg-lime-400/10 text-lime-300 border-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.2)]"
                    : "bg-[#0c101a] text-zinc-200 border-white/[0.08] hover:border-lime-400/50 hover:bg-white/[0.04]"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <label className="flex cursor-pointer items-center justify-center gap-2.5 text-xs text-zinc-400 hover:text-zinc-300 transition-colors">
            <input
              type="checkbox"
              checked={startersOnly}
              onChange={(e) => setStartersOnly(e.target.checked)}
              className="h-4 w-4 rounded accent-lime-400 bg-zinc-800"
            />
            <span>Skip sequels &mdash; only show starting points of series</span>
          </label>

          <button
            onClick={() => setStep("mood")}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Change Vibe</span>
          </button>
        </section>
      )}

      {step === "results" && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-lime-400">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Custom Recommendations</span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {loading ? "Analyzing AniList Intelligence..." : `${moodLabel} Recommendations`}
              </h1>
            </div>

            <button
              onClick={restart}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0c101a] px-3.5 py-2 text-xs font-semibold text-zinc-300 transition hover:border-lime-400/50 hover:text-lime-300 self-start sm:self-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Start Over</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mr-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Refine:</span>
            </div>
            <select
              value={genre ?? ""}
              onChange={(e) => filterGenre(e.target.value || null)}
              className="rounded-xl border border-white/10 bg-[#0c101a] px-3.5 py-2 text-xs font-medium text-zinc-200 focus:outline-none focus:border-lime-400"
            >
              <option value="">Any Genre</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <select
              value={minScore}
              onChange={(e) => filterScore(Number(e.target.value))}
              className="rounded-xl border border-white/10 bg-[#0c101a] px-3.5 py-2 text-xs font-medium text-zinc-200 focus:outline-none focus:border-lime-400"
            >
              {SCORE_MIN.map((s) => (
                <option key={s} value={s}>
                  {s === 0 ? "Any Score" : `${s}+ Score`}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => filterSort(e.target.value as "score" | "popular")}
              className="rounded-xl border border-white/10 bg-[#0c101a] px-3.5 py-2 text-xs font-medium text-zinc-200 focus:outline-none focus:border-lime-400"
            >
              <option value="score">Sort: Highest Rated</option>
              <option value="popular">Sort: Most Popular</option>
            </select>
          </div>

          {loading ? (
            <SkeletonGrid count={12} />
          ) : results.length === 0 ? (
            <div className="rounded-3xl border border-white/[0.08] bg-[#0c101a] py-16 px-6 text-center shadow-xl">
              <p className="text-sm text-zinc-400">
                No titles matched these precise filter parameters.
              </p>
              <button
                onClick={restart}
                className="mt-3 text-xs font-semibold text-lime-400 hover:text-lime-300"
              >
                ← Reset filters and retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
              {results.map((a, i) => (
                <AnimeCard key={`${a.id}-${i}`} anime={a} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
