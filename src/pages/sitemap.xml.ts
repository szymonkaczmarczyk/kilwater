import type { APIRoute } from "astro";
import { alternatePaths, type PageKey } from "../i18n/locales";
import { guideArticles, guidePath } from "../lib/guide";

const pageKeys: PageKey[] = ["home", "privacy", "terms", "guide"];

const urlEntry = (site: URL, path: string, alternates: { locale: string; path: string }[]) => {
  const links =
    alternates.length > 1
      ? alternates
          .map((alternate) => `\n    <xhtml:link rel="alternate" hreflang="${alternate.locale}" href="${new URL(alternate.path, site).href}" />`)
          .join("")
      : "";
  return `  <url>\n    <loc>${new URL(path, site).href}</loc>${links}\n  </url>`;
};

export const GET: APIRoute = async ({ site }) => {
  const articles = await guideArticles();
  const urls = [
    ...pageKeys.flatMap((page) => alternatePaths(page).map(({ path }) => urlEntry(site!, path, alternatePaths(page)))),
    ...articles.map((article) => urlEntry(site!, guidePath(article), [])),
  ].join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
