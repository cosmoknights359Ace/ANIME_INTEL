// Skeleton placeholders that mirror AnimeCard's 2:3 poster aspect so grids
// don't jump when real cards swap in.
export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-zinc-800">
      <div className="aspect-[2/3] animate-pulse bg-zinc-800/70" />
      <div className="space-y-1.5 p-2">
        <div className="h-3 w-4/5 animate-pulse rounded bg-zinc-800" />
        <div className="h-3 w-2/5 animate-pulse rounded bg-zinc-800/70" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
