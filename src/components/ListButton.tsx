"use client";

import { useEffect, useRef, useState } from "react";
import type { AnimeSummary } from "@/lib/types";
import {
  LIST_STATUSES,
  removeEntry,
  setProgress,
  setStatus,
  type ListStatus,
} from "@/lib/list";
import { useListEntry } from "@/lib/useList";

const STATUS_STYLE: Record<ListStatus, string> = {
  watching: "bg-lime-400/15 text-lime-300 ring-lime-400/40",
  completed: "bg-sky-400/15 text-sky-300 ring-sky-400/40",
  plan: "bg-orange-400/15 text-orange-300 ring-orange-400/40",
  paused: "bg-zinc-400/15 text-zinc-300 ring-zinc-400/40",
  dropped: "bg-red-400/15 text-red-300 ring-red-400/40",
};

export default function ListButton({
  anime,
  variant = "full",
}: {
  anime: AnimeSummary;
  variant?: "full" | "compact";
}) {
  const entry = useListEntry(anime.id);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const currentLabel = entry
    ? LIST_STATUSES.find((s) => s.key === entry.status)?.label
    : null;

  if (variant === "compact") {
    return (
      <div ref={boxRef} className="relative">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          aria-label="Add to list"
          className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ring-1 transition ${
            entry
              ? STATUS_STYLE[entry.status]
              : "bg-zinc-800/80 text-zinc-300 ring-zinc-600 hover:text-lime-300 hover:ring-lime-400"
          }`}
        >
          {entry ? "✓" : "+"}
        </button>
        {open && (
          <div className="absolute right-0 z-30 mt-1 w-40 overflow-hidden rounded-lg bg-zinc-900 py-1 ring-1 ring-zinc-700 shadow-xl">
            {LIST_STATUSES.map((s) => (
              <button
                key={s.key}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setStatus(anime, s.key);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-1.5 text-left text-xs hover:bg-zinc-800 ${
                  entry?.status === s.key ? "text-lime-300" : "text-zinc-300"
                }`}
              >
                {s.label}
              </button>
            ))}
            {entry && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeEntry(anime.id);
                  setOpen(false);
                }}
                className="block w-full px-3 py-1.5 text-left text-xs text-red-400 hover:bg-zinc-800"
              >
                Remove
              </button>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={boxRef} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`rounded-lg px-4 py-2 text-sm font-medium ring-1 transition ${
          entry
            ? STATUS_STYLE[entry.status]
            : "bg-lime-400 text-zinc-950 ring-lime-400 hover:bg-lime-300"
        }`}
      >
        {entry ? `✓ ${currentLabel}` : "+ Add to List"}
      </button>
      {open && (
        <div className="absolute z-30 mt-2 w-48 overflow-hidden rounded-xl bg-zinc-900 py-1 ring-1 ring-zinc-700 shadow-xl">
          {LIST_STATUSES.map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setStatus(anime, s.key);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2 text-left text-sm hover:bg-zinc-800 ${
                entry?.status === s.key ? "text-lime-300" : "text-zinc-300"
              }`}
            >
              {entry?.status === s.key ? "✓ " : ""}
              {s.label}
            </button>
          ))}
          {entry && (
            <button
              onClick={() => {
                removeEntry(anime.id);
                setOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-zinc-800"
            >
              Remove from list
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function ProgressControl({ animeId }: { animeId: number }) {
  const entry = useListEntry(animeId);
  if (!entry || entry.status === "plan") return null;

  const total = entry.episodes;
  return (
    <div className="inline-flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2 ring-1 ring-zinc-700">
      <span className="text-xs text-zinc-400">Progress</span>
      <button
        onClick={() => setProgress(animeId, entry.progress - 1)}
        disabled={entry.progress <= 0}
        className="h-6 w-6 rounded bg-zinc-700 text-sm text-zinc-200 transition hover:bg-zinc-600 disabled:opacity-30"
      >
        −
      </button>
      <span className="min-w-16 text-center text-sm text-zinc-100">
        {entry.progress}
        {total != null ? ` / ${total}` : ""}
      </span>
      <button
        onClick={() => setProgress(animeId, entry.progress + 1)}
        disabled={total != null && entry.progress >= total}
        className="h-6 w-6 rounded bg-zinc-700 text-sm text-zinc-200 transition hover:bg-zinc-600 disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
