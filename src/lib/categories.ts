// Homepage category rows. Each category maps to one curated fetch + a
// generous pageable limit so the rows aren't capped at a handful of titles.
import type { AnimeSummary } from "./types";
import {
  getTrendingAnime,
  getMustWatchAnime,
  getBingeWorthyAnime,
  getTopAnime,
  getSeasonAnime,
} from "./anilist";

export interface CategoryDef {
  slug: string;
  title: string;
  subtitle: string;
  fetch: (limit: number) => Promise<AnimeSummary[]>;
  sectionLimit: number; // how many to show in the homepage carousel
  pageLimit: number; // how many to show on the full category page (no cap
}

export const HOME_CATEGORIES: CategoryDef[] = [
  {
    slug: "trending",
    title: "Trending now",
    subtitle: "What everyone is watching right now",
    fetch: getTrendingAnime,
    sectionLimit: 30,
    pageLimit: 150,
  },
  {
    slug: "must-watch",
    title: "Must-watch classics",
    subtitle: "The essential anime every fan should see",
    fetch: getMustWatchAnime,
    sectionLimit: 30,
    pageLimit: 150,
  },
  {
    slug: "binge-worthy",
    title: "Binge-worthy",
    subtitle: "Long, finished series made for marathons",
    fetch: getBingeWorthyAnime,
    sectionLimit:  30,
    pageLimit: 150,
  },
  {
    slug: "top-rated",
    title:"Top rated right now",
    subtitle:"The highest-scoring anime of all time",
    fetch: getTopAnime,
    sectionLimit: 30,
    pageLimit: 150,
  },
  {
    slug:"airing",
    title:"Airing this season",
    subtitle:"What is airing right now",
    fetch: getSeasonAnime,
    sectionLimit:  20,
    pageLimit: 100,
  },
];

export function getCategory(slug: string): CategoryDef | undefined {
  return HOME_CATEGORIES.find((c) => c.slug === slug);
}