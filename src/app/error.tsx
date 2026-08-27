"use client";

import Image from "next/image";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <Image
        src="/gojo.gif"
        alt="Oops"
        width={120}
        height={120}
        unoptimized
        className="rounded-full shadow-[0_0_30px_rgba(163,230,53,0.3)]"
      />
      <h2 className="text-xl font-semibold">Something broke.</h2>
      <p className="max-w-sm text-sm text-zinc-400">
        Even Gojo&apos;s infinity couldn&apos;t stop this one. Try again?
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-lime-400 px-6 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-lime-300"
      >
        Retry
      </button>
    </div>
  );
}
