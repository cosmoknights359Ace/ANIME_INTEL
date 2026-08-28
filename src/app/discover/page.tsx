"use client";

import { useState } from "react";
import AnimeCard from "@/components/AnimeCard";
import { SkeletonGrid } from "@/components/Skeleton";
import type { AnimeSummary } from "@/lib/types";
import { MOODS, LENGTHS } from "@/lib/moods";

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
    <div className="mx-auto max-w-4xl">
      {/* progress */}
      <div className="mb-8 flex items-center justify-center gap-2 text-xs text-zinc-500">
        {["Vibe", "Length", "Results"].map((label, i) => {
          const steps: Step[] = ["mood", "length", "results"];
          const active = steps.indexOf(step) >= i;
          return (
            <span key={label} className="flex items-center gap-2">
              {i > 0 && <span className={`h-px w-8 ${active ? "bg-lime-400" : "bg-zinc-700"}`} />}
              <span className={active ? "text-lime-400" : ""}>{label}</span>
            </span>
          );
        })}
      </div>

      {step === "mood" && (
        <section className="text-center">
          <h1 className="text-3xl font-bold">What are you in the mood for?</h1>
          <p className="mt-2 text-zinc-400">Pick a vibe — we&apos;ll handle the rest.</p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {MOODS.map((m) => (
              <button
                key={m.id}
                onClick={() => pickMood(m.id, m.label)}
                className={`group flex flex-col items-center gap-2 rounded-xl p-5 ring-1 transition ${
                  mood === m.id
                    ? "bg-lime-400/10 ring-2 ring-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.25)]"
                    : "bg-zinc-900 ring-zinc-800 hover:ring-lime-400/60"
                }`}
              >
                <span className="text-3xl transition group-hover:scale-110">{m.emoji}</span>
                <span className="text-sm font-medium text-zinc-200">{m.label}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === "length" && (
        <section className="text-center">
          <h1 className="text-3xl font-bold">How much time do you have?</h1>
          <div className="mt-8 flex flex-col items-center gap-3">
            {LENGTHS.map((l) => (
              <button
                key={l.id}
                onClick={() => pickLength(l.id)}
                className={`w-full max-w-sm rounded-xl px-6 py-4 text-sm font-medium ring-1 transition ${
                  pickedLength === l.id
                    ? "bg-lime-400/10 text-lime-300 ring-2 ring-lime-400"
                    : "bg-zinc-900 text-zinc-200 ring-zinc-800 hover:ring-lime-400/60"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <label className="mt-6 flex cursor-pointer items-center justify-center gap-2 text-sm text-zinc-400">
            <input
              type="checkbox"
              checked={startersOnly}
              onChange={(e) => setStartersOnly(e.target.checked)}
              className="h-4 w-4 accent-lime-400"
            />
            Skip sequels — only show where each series starts
          </label>
          <button onClick={() => setStep("mood")} className="mt-4 text-sm text-zinc-500 hover:text-zinc-300">
            ← Back
          </button>
        </section>
      )}

      {step === "results" && (
        <section>
          <div className="mb-4 text-center">
            <h1 className="text-3xl font-bold">
              {loading ? "Finding your anime…" : `${moodLabel} picks`}
            </h1>
            <button onClick={restart} className="mt-2 text-sm text-lime-400 hover:underline">
              ← Start over
            </button>
          </div>

          {/* Filters */}
          <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
            <select
              value={genre ?? ""}
              onChange={(e) => filterGenre(e.target.value || null)}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-sm ring-1 ring-zinc-700 focus:outline-none"
            >
              <option value="">Any genre</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <select
              value={minScore}
              onChange={(e) => filterScore(Number(e.target.value))}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-sm ring-1 ring-zinc-700 focus:outline-none"
            >
              {SCORE_MIN.map((s) => (
                <option key={s} value={s}>
                  {s === 0 ? "Any score" : `${s}+ score`}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => filterSort(e.target.value as "score" | "popular")}
              className="rounded-lg bg-zinc-900 px-3 py-2 text-sm ring-1 ring-zinc-700 focus:outline-none"
            >
              <option value="score">Sort: top rated</option>
              <option value="popular">Sort: most popular</option>
            </select>
          </div>

          {loading ? (
            <SkeletonGrid count={12} />
          ) : results.length === 0 ? (
            <p className="py-20 text-center text-zinc-500">
              Nothing matched — loosen the filters.
            </p>
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
