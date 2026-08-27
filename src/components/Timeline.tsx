import Link from "next/link";
import Image from "next/image";
import type { WatchOrder } from "@/lib/types";

export default function Timeline({ order }: { order: WatchOrder }) {
  return (
    <div>
      <div className="mb-3 flex items-baseline gap-3">
        <h2 className="text-lg font-semibold">Watch order</h2>
        <span className="text-xs text-zinc-500">
          {order.franchiseName}
          {order.curated && (
            <span className="ml-2 rounded-full bg-orange-500/15 px-2 py-0.5 text-[10px] text-orange-300 ring-1 ring-orange-500/30">
              curated
            </span>
          )}
        </span>
      </div>

      <ol className="relative ml-3 space-y-4 border-l border-zinc-800">
        {order.steps.map((s, i) => (
          <li key={s.animeId} className="relative ml-6">
            <span
              className={`absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                s.isCurrent
                  ? "bg-lime-400 text-zinc-950 shadow-[0_0_10px_rgba(163,230,53,0.6)]"
                  : s.role === "optional"
                    ? "bg-zinc-800 text-zinc-400 ring-1 ring-zinc-700"
                    : "bg-zinc-800 text-zinc-200 ring-1 ring-zinc-600"
              }`}
            >
              {i + 1}
            </span>

            <Link
              href={`/anime/${s.animeId}`}
              className={`flex items-center gap-3 rounded-lg p-2 ring-1 transition ${
                s.isCurrent
                  ? "bg-lime-400/5 ring-lime-400/40"
                  : "bg-zinc-900 ring-zinc-800 hover:ring-zinc-600"
              }`}
            >
              {s.image && (
                <Image
                  src={s.image}
                  alt=""
                  width={36}
                  height={50}
                  className="rounded object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-100">
                  {s.title}
                  {s.isCurrent && (
                    <span className="ml-2 text-[10px] font-semibold uppercase text-lime-400">
                      You are here
                    </span>
                  )}
                </p>
                <p className="text-xs text-zinc-500">
                  {[s.type, s.episodes ? `${s.episodes} ep` : null, s.year, s.rating ? `★ ${s.rating.toFixed(1)}` : null]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                {s.note && (
                  <p className={`mt-0.5 text-xs ${s.role === "optional" ? "text-zinc-500" : "text-orange-300"}`}>
                    {s.note}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
