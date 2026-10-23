import { readdirSync } from "node:fs";
import { expect, test } from "@playwright/test";
import { assistantEntries } from "../../src/data/assistant-answers";

const articleSlugs = readdirSync("src/content/poradnik").map((file) => file.replace(/\.md$/, ""));

test("poradnik pokazuje wszystkie artykuły i prowadzi do formularza", async ({ page }) => {
  await page.goto("/poradnik");
  await expect(page).toHaveTitle("Poradnik czarteru jachtów - Kilwater");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Zanim wypłyniesz");
  await expect(page.locator(".article-card")).toHaveCount(articleSlugs.length);
  await expect(page.getByRole("navigation", { name: "Główna nawigacja" }).getByRole("link", { name: "Poradnik" })).toHaveAttribute("href", "/poradnik");
  await page.getByRole("link", { name: /Pierwszy czarter jachtu krok po kroku/ }).click();
  await expect(page).toHaveURL("/poradnik/pierwszy-czarter-krok-po-kroku");
});

test("artykuł ma spis treści, dane strukturalne i powiązane teksty", async ({ page }) => {
  await page.goto("/poradnik/rejs-bez-patentu");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Rejs bez patentu. Jak popłynąć ze skipperem albo z pełną załogą");
  const toc = page.getByRole("navigation", { name: "Spis treści" });
  await toc.getByRole("link", { name: "Rejs ze skipperem" }).click();
  await expect(page.locator("#rejs-ze-skipperem")).toBeInViewport();
  const structuredData = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "[]");
  expect(structuredData[0]["@type"]).toBe("Article");
  expect(structuredData[0].inLanguage).toBe("pl");
  expect(structuredData[1]["@type"]).toBe("BreadcrumbList");
  await expect(page.locator(".related")).toHaveCount(2);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://kilwater.com/poradnik/rejs-bez-patentu");
});

test("linki wewnątrz artykułów prowadzą do istniejących stron", async ({ page, request }) => {
  for (const slug of articleSlugs) {
    await page.goto(`/poradnik/${slug}`);
    const hrefs = await page.locator(".post__body a").evaluateAll((links) => links.map((link) => link.getAttribute("href")!));
    for (const href of hrefs.filter((href) => href.startsWith("/"))) {
      const path = href.split("#")[0].split("?")[0] || "/";
      expect((await request.get(path)).status(), `${slug}: ${href}`).toBe(200);
    }
  }
});

test("każdy artykuł ma odpowiedź w bazie asystenta", () => {
  const linkedArticles = assistantEntries.pl.flatMap((entry) => (entry.link?.href.startsWith("/poradnik/") ? [entry.link.href.replace("/poradnik/", "")] : []));
  expect(linkedArticles.sort()).toEqual([...articleSlugs].sort());
});
