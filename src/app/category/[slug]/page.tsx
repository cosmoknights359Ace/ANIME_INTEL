import Link from "next/link";
import { notFound } from "next/navigation";
import AnimeCard from "@/components/AnimeCard";
import { getCategory } from "@/lib/categories";
import { ArrowLeft, Sparkles } from "lucide-react";

export const revalidate = 3600;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const results = await category.fetch(category.pageLimit).catch(() => []);

  return (
    <div className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-lime-300 transition-colors mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Explore</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-lime-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Curated Collection</span>
        </div>
        <h1 className="mt-1 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          {category.title}
        </h1>
        {category.subtitle && (
          <p className="mt-1 text-sm text-zinc-400">{category.subtitle}</p>
        )}
      </div>

      {results.length === 0 ? (
        <div className="rounded-3xl border border-white/[0.08] bg-[#0c101a] p-12 text-center">
          <p className="text-zinc-400">No anime found in this category.</p>
          <Link
            href="/"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-lime-400 hover:text-lime-300"
          >
            ← Return to Home
          </Link>
        </div>
      ) : (
        <>
          <p className="text-xs text-zinc-400">
            Showing <span className="font-semibold text-zinc-200 tabular-nums">{results.length}</span> titles
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {results.map((a) => (
              <AnimeCard key={a.id} anime={a} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}