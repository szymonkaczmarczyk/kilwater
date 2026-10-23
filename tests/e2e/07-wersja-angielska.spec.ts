import { expect, test } from "@playwright/test";

test("angielska strona główna ma język, hreflang i angielskie menu", async ({ page }) => {
  await page.goto("/en/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveTitle(/crewed yacht charter/);
  await expect(page.locator('link[rel="alternate"][hreflang="pl"]')).toHaveAttribute("href", "https://kilwater.com/");
  await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute("href", "https://kilwater.com/en/");
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "en_GB");
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  await expect(navigation.getByRole("link", { name: "Sailing areas" })).toHaveAttribute("href", "/en/#akweny");
  await expect(navigation.getByRole("link", { name: "Guide" })).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Leave a wake");
});

test("przełącznik języka prowadzi do odpowiednika strony", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "English version" }).click();
  await expect(page).toHaveURL("/en/");
  await page.getByRole("link", { name: "Wersja polska" }).click();
  await expect(page).toHaveURL("/");
  await page.goto("/polityka-prywatnosci");
  await page.getByRole("link", { name: "English version" }).click();
  await expect(page).toHaveURL("/en/privacy-policy");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Privacy policy");
  await expect(page.getByText("the Polish version is binding")).toBeVisible();
});

test("formularz po angielsku pokazuje angielskie błędy i wypełnia się z trasy", async ({ page }) => {
  await page.goto("/en/");
  const form = page.locator("[data-inquiry-form]");
  await form.getByRole("button", { name: "Send enquiry" }).click();
  await expect(form.getByText("Choose a sailing area or “Not sure yet”.")).toBeVisible();
  await expect(form.getByText("Accept the terms so we can prepare your offer.")).toBeVisible();

  const routes = page.locator("#trasy");
  await routes.getByRole("tab").nth(2).click();
  await routes.getByRole("link", { name: "Ask about this route" }).click();
  await expect(page.locator("#destination")).toHaveValue("wlochy");
  await expect(page.locator("#message")).toHaveValue(/The Bay of Naples and the Amalfi Coast/);
});

test("kalendarz sezonu i trasy mają angielskie treści", async ({ page }) => {
  await page.goto("/en/");
  const season = page.locator("#kiedy-plynac");
  await season.getByRole("button", { name: "Greece, September: Best time" }).click();
  await expect(season.getByRole("heading", { name: "Greece in September" })).toBeVisible();
  await expect(season.getByRole("link", { name: "Ask about September" })).toHaveAttribute("href", "/en/?akwen=grecja&miesiac=9#zapytanie");
  await expect(page.locator("#trasy").getByText("Day 1").first()).toBeVisible();
  await expect(page.locator("#trasy svg text").filter({ hasText: /\d\.\d° N/ }).first()).toBeAttached();
});

test("sitemap zawiera wersje językowe i poradnik", async ({ request }) => {
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("<loc>https://kilwater.com/en/</loc>");
  expect(sitemap).toContain("<loc>https://kilwater.com/en/terms</loc>");
  expect(sitemap).toContain('hreflang="en" href="https://kilwater.com/en/privacy-policy"');
  expect(sitemap).toContain("<loc>https://kilwater.com/poradnik/rejs-bez-patentu</loc>");
});
