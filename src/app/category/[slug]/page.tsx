import Link from "next/link";
import { notFound } from "next/navigation";
import AnimeCard from "@/components/AnimeCard";
import { getCategory } from "@/lib/categories";

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
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-zinc-500">Category</p>
        <h1 className="text-3xl font-bold tracking-tight">{category.title}</h1>
        {category.subtitle && <p className="mt-1 text-zinc-400">{category.subtitle}</p>}
      </div>

      {results.length === 0 ? (
        <div className="rounded-xl bg-zinc-900 p-10 text-center ring-1 ring-zinc-800">
          <p className="text-zinc-400">No anime found.</p>
          <Link href="/" className="mt-2 inline-block text-sm text-lime-400 hover:text-lime-300">
            ← Back to home
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-zinc-500">
            {results.length} titles — no cap, everything in this category..
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