import { expect, test } from "@playwright/test";

test("po odświeżeniu strona startuje od góry", async ({ page }) => {
  await page.goto("/");
  await page.mouse.wheel(0, 4000);
  await page.waitForTimeout(1500);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
  await page.reload();
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});

test("link w menu przewija do sekcji i nie zostawia kotwicy w adresie", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Główna nawigacja" }).getByRole("link", { name: "Akweny" }).click();
  await expect(page.locator("#akweny")).toBeInViewport();
  await expect(page).toHaveURL("/");
});

test("wejście z podstrony na kotwicę otwiera właściwą sekcję", async ({ page }) => {
  await page.goto("/regulamin");
  await page.getByRole("navigation", { name: "Główna nawigacja" }).getByRole("link", { name: "Jak to działa" }).click();
  await expect(page.locator("#jak-to-dziala")).toBeInViewport();
  await expect(page).toHaveURL("/");
});

test("ramka w hero pokrywa się z oknem zdjęcia po powrocie na górę", async ({ page }) => {
  await page.goto("/");
  await page.mouse.wheel(0, 3000);
  await page.waitForTimeout(1500);
  await page.mouse.wheel(0, -6000);
  await page.waitForTimeout(2000);
  const boxes = await page.evaluate(() => {
    const outline = document.querySelector("[data-hero-outline]")!.getBoundingClientRect();
    const frame = document.querySelector("[data-hero-window]")!.getBoundingClientRect();
    return { outlineLeft: outline.left, frameLeft: frame.left, outlineTop: outline.top, frameTop: frame.top };
  });
  expect(Math.abs(boxes.frameLeft - boxes.outlineLeft - 14)).toBeLessThan(2);
  expect(Math.abs(boxes.frameTop - boxes.outlineTop - 14)).toBeLessThan(2);
});

test("przewijanie w trakcie wczytywania nie wraca na górę", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.mouse.wheel(0, 2500);
  await page.waitForLoadState("load");
  await page.waitForTimeout(1200);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(1000);
});

for (const reducedMotion of ["reduce", "no-preference"] as const) {
  test(`nawigacja ma tło za hero (ruch: ${reducedMotion})`, async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion, viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("[data-nav]")).not.toHaveClass(/is-scrolled/);
    await page.evaluate(() => document.querySelector("#rejsy")!.scrollIntoView());
    await expect(page.locator("[data-nav]")).toHaveClass(/is-scrolled/);
    await context.close();
  });
}
