"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#07090e] text-white antialiased">
        <div className="flex flex-col items-center gap-4 text-center p-6 max-w-md">
          <h2 className="text-2xl font-bold">Something went wrong</h2>
          <p className="text-sm text-zinc-400">An unexpected system error occurred.</p>
          <button
            onClick={() => reset()}
            className="rounded-xl bg-lime-400 px-6 py-2.5 text-sm font-bold text-zinc-950 transition hover:bg-lime-300"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
