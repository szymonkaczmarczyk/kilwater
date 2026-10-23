import { getCollection, type CollectionEntry } from "astro:content";

export type GuideArticle = CollectionEntry<"guide">;

const wordsPerMinute = 200;

export const readingMinutes = (text: string) =>
  Math.max(1, Math.round(text.split(/\s+/).filter(Boolean).length / wordsPerMinute));

export const formatGuideDate = (date: Date) =>
  new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" }).format(date);

export const guideArticles = async () =>
  (await getCollection("guide")).sort((first, second) => first.data.order - second.data.order);

export const guidePath = (article: GuideArticle) => `/poradnik/${article.id}`;
