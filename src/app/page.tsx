import NetflixHomeView from "@/components/NetflixHomeView";
import { getTopAnime, getTrendingAnime } from "@/lib/anilist";
import { HOME_CATEGORIES } from "@/lib/categories";

export const revalidate = 3600;

export default async function Home() {
  const [trending, top] = await Promise.all([
    getTrendingAnime(12).catch(() => []),
    getTopAnime(30).catch(() => []),
  ]);

  const categories = await Promise.all(
    HOME_CATEGORIES.map(async (c) => ({
      slug: c.slug,
      title: c.title,
      subtitle: c.subtitle,
      items: await c.fetch(c.sectionLimit).catch(() => []),
    }))
  );

  // Spotlights for the Billboard Hero
  const spotlightItems = trending.length > 0 ? trending.slice(0, 6) : top.slice(0, 6);

  return <NetflixHomeView spotlightItems={spotlightItems} categories={categories} />;
}