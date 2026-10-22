import { expect, test } from "@playwright/test";

test("strona główna ma meta, canonical i obraz OG", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Kilwater/);
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /czarter|Jachty/i);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://kilwater.com/");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", "https://kilwater.com/og-image.jpg");
  await expect(page.locator("html")).toHaveAttribute("lang", "pl");
});

test("nieistniejący adres pokazuje własną stronę 404", async ({ page }) => {
  const response = await page.goto("/nie-ma-takiego-kursu");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("prosto we mgłę");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await expect(page.getByRole("link", { name: "Wróć na stronę główną" })).toHaveAttribute("href", "/");
});

for (const document of [
  { path: "/polityka-prywatnosci", heading: "Polityka prywatności" },
  { path: "/regulamin", heading: "Regulamin serwisu" },
]) {
  test(`dokument ${document.path} ma nagłówek, spis treści i unikalny tytuł`, async ({ page }) => {
    await page.goto(document.path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(document.heading);
    await expect(page.getByRole("navigation", { name: "Spis treści" }).getByRole("link").first()).toBeVisible();
    await expect(page).toHaveTitle(`${document.heading} - Kilwater`);
  });
}

test("robots.txt, sitemap.xml, favicon i obraz OG są dostępne", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Sitemap: https://kilwater.com/sitemap.xml");

  const sitemap = await request.get("/sitemap.xml");
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain("<loc>https://kilwater.com/regulamin</loc>");
  expect(sitemapText).not.toContain("404");

  for (const asset of ["/favicon.ico", "/favicon.svg", "/apple-touch-icon.png", "/og-image.jpg"]) {
    expect((await request.get(asset)).status(), asset).toBe(200);
  }
});
