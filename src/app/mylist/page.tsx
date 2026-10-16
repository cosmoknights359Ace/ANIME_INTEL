"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LIST_STATUSES,
  removeEntry,
  setProgress,
  setScore,
  type ListStatus,
} from "@/lib/list";
import { useList } from "@/lib/useList";
import { Trash2, BookmarkCheck, ArrowRight } from "lucide-react";

const TAB_STYLE: Record<ListStatus, { active: string; bar: string }> = {
  watching: { active: "text-lime-300 border-lime-400", bar: "bg-lime-400" },
  completed: { active: "text-sky-300 border-sky-400", bar: "bg-sky-400" },
  plan: { active: "text-amber-300 border-amber-400", bar: "bg-amber-400" },
  paused: { active: "text-zinc-300 border-zinc-400", bar: "bg-zinc-400" },
  dropped: { active: "text-red-300 border-red-400", bar: "bg-red-400" },
};

export default function MyListPage() {
  const entries = useList();
  const [tab, setTab] = useState<ListStatus | "all">("all");

  const filtered = tab === "all" ? entries : entries.filter((e) => e.status === tab);
  const countFor = (s: ListStatus | "all") =>
    s === "all" ? entries.length : entries.filter((e) => e.status === s).length;

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-lime-400">
            <BookmarkCheck className="h-4 w-4" />
            <span>Personal Collection</span>
          </div>
          <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            My List
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Saved securely in local browser storage &mdash; zero account creation required.
          </p>
        </div>
        <div className="text-xs text-zinc-400 font-medium">
          Total Tracked: <span className="font-bold text-white tabular-nums">{entries.length}</span> titles
        </div>
      </div>

      {/* Tabs / Filter Bar */}
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-white/[0.08] text-xs sm:text-sm">
        <button
          onClick={() => setTab("all")}
          className={`-mb-px border-b-2 pb-3 font-medium transition-colors ${
            tab === "all"
              ? "border-lime-400 text-lime-300"
              : "border-transparent text-zinc-400 hover:text-zinc-200"
          }`}
        >
          All ({countFor("all")})
        </button>
        {LIST_STATUSES.map((s) => (
          <button
            key={s.key}
            onClick={() => setTab(s.key)}
            className={`-mb-px border-b-2 pb-3 font-medium transition-colors ${
              tab === s.key
                ? TAB_STYLE[s.key].active
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {s.label} ({countFor(s.key)})
          </button>
        ))}
      </div>

      {/* List items */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-white/[0.08] bg-[#0c101a] p-12 text-center shadow-xl">
          <p className="text-sm text-zinc-400">
            {entries.length === 0
              ? "Your list is empty. Search for an anime or explore recommendations and hit “+ Add to List”."
              : "Nothing in this category yet."}
          </p>
          <Link
            href="/discover"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-lime-400 hover:text-lime-300"
          >
            <span>Discover anime to add</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((e) => {
            const total = e.episodes;
            const pct = total != null && total > 0 ? Math.min((e.progress / total) * 100, 100) : null;
            return (
              <li
                key={e.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/[0.07] bg-[#0c101a] p-4 transition hover:border-white/15"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <Link href={`/anime/${e.id}`} className="shrink-0">
                    <div className="relative h-20 w-14 overflow-hidden rounded-xl border border-white/10 bg-zinc-800">
                      {e.image && (
                        <Image
                          src={e.image}
                          alt={e.title}
                          fill
                          sizes="56px"
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/anime/${e.id}`}
                      className="block truncate font-semibold text-zinc-100 hover:text-lime-300 transition-colors"
                    >
                      {e.title}
                    </Link>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {LIST_STATUSES.find((s) => s.key === e.status)?.label}
                      {total != null && ` · ${total} episodes`}
                    </p>
                    {pct != null && (
                      <div className="mt-2.5 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${TAB_STYLE[e.status].bar}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress & Controls */}
                <div className="flex items-center gap-2.5 self-end sm:self-center">
                  {e.status === "completed" && (
                    <select
                      value={e.score ?? ""}
                      onChange={(ev) =>
                        setScore(e.id, ev.target.value ? Number(ev.target.value) : null)
                      }
                      className={`rounded-xl border border-white/10 bg-zinc-900 px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-lime-400 ${
                        e.score ? "text-amber-400" : "text-zinc-500"
                      }`}
                      aria-label="Your score"
                    >
                      <option value="">Score</option>
                      {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>
                          ★ {n}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Increment / Decrement buttons */}
                  <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-zinc-900 p-1">
                    <button
                      onClick={() => setProgress(e.id, e.progress - 1)}
                      disabled={e.progress <= 0}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-zinc-300 hover:bg-zinc-800 disabled:opacity-30"
                      aria-label="Decrease episode progress"
                    >
                      −
                    </button>
                    <span className="min-w-16 text-center text-xs font-semibold text-zinc-200 tabular-nums">
                      {e.progress}
                      {total != null ? ` / ${total}` : ""}
                    </span>
                    <button
                      onClick={() => setProgress(e.id, e.progress + 1)}
                      disabled={total != null && e.progress >= total}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-zinc-300 hover:bg-zinc-800 disabled:opacity-30"
                      aria-label="Increase episode progress"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeEntry(e.id)}
                    title="Remove from List"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
