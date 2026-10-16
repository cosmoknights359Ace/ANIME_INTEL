"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Plus, Trash2, BookmarkCheck, ChevronDown } from "lucide-react";
import type { AnimeSummary } from "@/lib/types";
import {
  LIST_STATUSES,
  removeEntry,
  setProgress,
  setStatus,
  type ListStatus,
} from "@/lib/list";
import { useListEntry } from "@/lib/useList";

const STATUS_STYLE: Record<ListStatus, { bg: string; text: string; border: string }> = {
  watching: {
    bg: "bg-lime-400/15",
    text: "text-lime-300",
    border: "border-lime-400/40",
  },
  completed: {
    bg: "bg-sky-400/15",
    text: "text-sky-300",
    border: "border-sky-400/40",
  },
  plan: {
    bg: "bg-amber-400/15",
    text: "text-amber-300",
    border: "border-amber-400/40",
  },
  paused: {
    bg: "bg-zinc-400/15",
    text: "text-zinc-300",
    border: "border-zinc-400/40",
  },
  dropped: {
    bg: "bg-red-400/15",
    text: "text-red-300",
    border: "border-red-400/40",
  },
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
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
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
          aria-label="Add or change list status"
          className={`flex h-8 w-8 items-center justify-center rounded-lg border backdrop-blur-md shadow-md transition-all active:scale-90 ${
            entry
              ? `${STATUS_STYLE[entry.status].bg} ${STATUS_STYLE[entry.status].text} ${STATUS_STYLE[entry.status].border}`
              : "bg-black/60 text-zinc-300 border-white/10 hover:border-lime-400/60 hover:text-lime-300"
          }`}
        >
          {entry ? <BookmarkCheck className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        </button>
        {open && (
          <div className="absolute right-0 z-40 mt-1.5 w-44 overflow-hidden rounded-xl bg-[#0e121c] py-1 border border-white/10 shadow-2xl backdrop-blur-xl">
            {LIST_STATUSES.map((s) => (
              <button
                key={s.key}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setStatus(anime, s.key);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3.5 py-2 text-left text-xs transition-colors hover:bg-white/[0.06] ${
                  entry?.status === s.key ? "text-lime-300 font-semibold" : "text-zinc-300"
                }`}
              >
                <span>{s.label}</span>
                {entry?.status === s.key && <Check className="h-3.5 w-3.5 text-lime-400" />}
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
                className="flex w-full items-center gap-2 border-t border-white/[0.06] px-3.5 py-2 text-left text-xs text-red-400 hover:bg-white/[0.06] transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove from List</span>
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
        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold border backdrop-blur-sm transition-all active:scale-95 ${
          entry
            ? `${STATUS_STYLE[entry.status].bg} ${STATUS_STYLE[entry.status].text} ${STATUS_STYLE[entry.status].border}`
            : "bg-white/[0.06] text-zinc-100 border-white/10 hover:border-lime-400/50 hover:bg-white/[0.1]"
        }`}
      >
        {entry ? (
          <>
            <BookmarkCheck className="h-4 w-4" />
            <span>{currentLabel}</span>
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            <span>Add to List</span>
          </>
        )}
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </button>

      {open && (
        <div className="absolute left-0 z-40 mt-2 w-48 overflow-hidden rounded-xl bg-[#0e121c] py-1 border border-white/10 shadow-2xl backdrop-blur-xl">
          {LIST_STATUSES.map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setStatus(anime, s.key);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-xs sm:text-sm transition-colors hover:bg-white/[0.06] ${
                entry?.status === s.key ? "text-lime-300 font-semibold" : "text-zinc-300"
              }`}
            >
              <span>{s.label}</span>
              {entry?.status === s.key && <Check className="h-4 w-4 text-lime-400" />}
            </button>
          ))}
          {entry && (
            <button
              onClick={() => {
                removeEntry(anime.id);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 border-t border-white/[0.06] px-4 py-2 text-left text-xs sm:text-sm text-red-400 hover:bg-white/[0.06] transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Remove from List</span>
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
    <div className="inline-flex items-center gap-2 rounded-xl bg-[#0e121c] border border-white/10 px-3 py-1.5 text-xs">
      <span className="text-zinc-400 font-medium">Progress</span>
      <button
        onClick={() => setProgress(animeId, entry.progress - 1)}
        disabled={entry.progress <= 0}
        className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-800 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-700 disabled:opacity-30"
      >
        −
      </button>
      <span className="min-w-16 text-center text-sm font-semibold text-zinc-100 tabular-nums">
        {entry.progress}
        {total != null ? ` / ${total}` : ""}
      </span>
      <button
        onClick={() => setProgress(animeId, entry.progress + 1)}
        disabled={total != null && entry.progress >= total}
        className="flex h-6 w-6 items-center justify-center rounded-lg bg-zinc-800 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-700 disabled:opacity-30"
      >
        +
      </button>
    </div>
  );
}
