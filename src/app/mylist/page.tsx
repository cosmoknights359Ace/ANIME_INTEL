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

const TAB_STYLE: Record<ListStatus, { active: string; bar: string }> = {
  watching: { active: "text-lime-300 border-lime-400", bar: "bg-lime-400" },
  completed: { active: "text-sky-300 border-sky-400", bar: "bg-sky-400" },
  plan: { active: "text-orange-300 border-orange-400", bar: "bg-orange-400" },
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My List</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Saved in this browser — no account needed.
        </p>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-2 border-b border-zinc-800 text-sm">
        <button
          onClick={() => setTab("all")}
          className={`-mb-px border-b-2 pb-2 transition ${
            tab === "all"
              ? "border-white text-white"
              : "border-transparent text-zinc-500 hover:text-zinc-300"
          }`}
        >
          All ({countFor("all")})
        </button>
        {LIST_STATUSES.map((s) => (
          <button
            key={s.key}
            onClick={() => setTab(s.key)}
            className={`-mb-px border-b-2 pb-2 transition ${
              tab === s.key
                ? TAB_STYLE[s.key].active
                : "border-transparent text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {s.label} ({countFor(s.key)})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl bg-zinc-900 p-10 text-center ring-1 ring-zinc-800">
          <p className="text-zinc-400">
            {entries.length === 0
              ? "Your list is empty. Search an anime and hit “+ Add to List”."
              : "Nothing in this category yet."}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((e) => {
            const total = e.episodes;
            const pct = total != null && total > 0 ? (e.progress / total) * 100 : null;
            return (
              <li
                key={e.id}
                className="flex items-center gap-4 rounded-xl bg-zinc-900 p-3 ring-1 ring-zinc-800"
              >
                <Link href={`/anime/${e.id}`} className="shrink-0">
                  <div className="relative h-20 w-14 overflow-hidden rounded-md bg-zinc-800">
                    {e.image && (
                      <Image src={e.image} alt={e.title} fill sizes="56px" className="object-cover" />
                    )}
                  </div>
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/anime/${e.id}`} className="hover:text-lime-300">
                    <h3 className="truncate font-medium text-zinc-100">{e.title}</h3>
                  </Link>
                  <p className="text-xs text-zinc-500">
                    {LIST_STATUSES.find((s) => s.key === e.status)?.label}
                    {total != null && ` · ${total} ep`}
                  </p>
                  {pct != null && (
                    <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-zinc-800">
                      <div
                        className={`h-full rounded-full transition-all ${TAB_STYLE[e.status].bar}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {e.status === "completed" && (
                    <select
                      value={e.score ?? ""}
                      onChange={(ev) =>
                        setScore(e.id, ev.target.value ? Number(ev.target.value) : null)
                      }
                      className={`rounded-lg bg-zinc-800 px-2 py-1.5 text-sm ring-1 ring-zinc-700 focus:outline-none ${
                        e.score ? "text-orange-400" : "text-zinc-500"
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
                  <button
                    onClick={() => setProgress(e.id, e.progress - 1)}
                    disabled={e.progress <= 0}
                    className="h-7 w-7 rounded bg-zinc-800 text-zinc-200 transition hover:bg-zinc-700 disabled:opacity-30"
                    aria-label="Decrease progress"
                  >
                    −
                  </button>
                  <span className="min-w-16 text-center text-sm text-zinc-300">
                    {e.progress}
                    {total != null ? ` / ${total}` : ""}
                  </span>
                  <button
                    onClick={() => setProgress(e.id, e.progress + 1)}
                    disabled={total != null && e.progress >= total}
                    className="h-7 w-7 rounded bg-zinc-800 text-zinc-200 transition hover:bg-zinc-700 disabled:opacity-30"
                    aria-label="Increase progress"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeEntry(e.id)}
                    className="ml-2 text-xs text-zinc-600 transition hover:text-red-400"
                  >
                    Remove
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
