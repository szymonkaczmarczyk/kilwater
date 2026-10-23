import { expect, test } from "@playwright/test";

test("zakładki tras przełączają mapę i działają ze strzałkami", async ({ page }) => {
  await page.goto("/");
  const routes = page.locator("#trasy");
  const tabs = routes.getByRole("tab");
  await expect(tabs).toHaveCount(4);
  await expect(routes.getByRole("tabpanel")).toHaveCount(1);
  await expect(routes.getByRole("heading", { name: "Split i wyspy środkowej Dalmacji" })).toBeVisible();

  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(routes.getByRole("heading", { name: "Zachodnie Cyklady z Lavrio" })).toBeVisible();

  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(2)).toBeFocused();
  await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("End");
  await expect(routes.getByRole("tabpanel").getByRole("listitem")).toHaveCount(7);
  await expect(routes.getByRole("img", { name: /Giżycko/ })).toBeVisible();
});

test("najechanie na dzień trasy podświetla odcinek na mapie", async ({ page }) => {
  await page.goto("/");
  const panel = page.locator("#trasy").getByRole("tabpanel");
  await panel.locator("[data-route-day]").nth(2).hover();
  await expect(panel.locator("[data-route-leg='2']")).toHaveClass(/is-active/);
  await expect(panel.locator("[data-route-stop='Hvar']")).toHaveClass(/is-active/);
});

test("przycisk trasy wypełnia formularz akwenem i wiadomością", async ({ page }) => {
  await page.goto("/");
  const routes = page.locator("#trasy");
  await routes.getByRole("tab").nth(3).click();
  await routes.getByRole("link", { name: "Zapytaj o tę trasę" }).click();
  await expect(page.locator("#zapytanie")).toBeInViewport();
  await expect(page.locator("#destination")).toHaveValue("mazury");
  await expect(page.locator("#message")).toHaveValue(/Wielkie Jeziora Mazurskie z Giżycka/);
  await expect(page.locator("[data-message-count]")).not.toHaveText("0 / 1000");
});

test("kalendarz sezonu pokazuje szczegóły i ustawia termin w formularzu", async ({ page }) => {
  await page.goto("/");
  const season = page.locator("#kiedy-plynac");
  await expect(season.getByRole("table")).toBeVisible();
  const cell = season.getByRole("button", { name: "Grecja, wrzesień: Najlepszy czas" });
  await cell.click();
  await expect(cell).toHaveAttribute("aria-pressed", "true");
  await expect(season.getByRole("heading", { name: "Grecja we wrześniu" })).toBeVisible();
  await expect(season.getByText(/meltemi/)).toBeVisible();

  await season.getByRole("link", { name: "Zapytaj o wrzesień" }).click();
  await expect(page.locator("#destination")).toHaveValue("grecja");
  const startDate = await page.locator("#startDate").inputValue();
  expect(startDate).toMatch(/^\d{4}-09-0[1-7]$/);
  expect(new Date(`${startDate}T12:00:00Z`).getUTCDay()).toBe(6);
});

test("wiadomość z trasy znika po wyborze innego terminu z kalendarza", async ({ page }) => {
  await page.goto("/?akwen=grecja&trasa=cyklady-lavrio");
  await expect(page.locator("#message")).toHaveValue(/Cyklady/);
  await page.locator("#kiedy-plynac").getByRole("button", { name: "Mazury, czerwiec: Najlepszy czas" }).click();
  await page.locator("#kiedy-plynac").getByRole("link", { name: "Zapytaj o czerwiec" }).click();
  await expect(page.locator("#destination")).toHaveValue("mazury");
  await expect(page.locator("#message")).toHaveValue("");
});

test("własna wiadomość nie zostaje nadpisana przez trasę", async ({ page }) => {
  await page.goto("/");
  await page.locator("#message").fill("Płyniemy z babcią.");
  await page.locator("#trasy").getByRole("link", { name: "Zapytaj o tę trasę" }).click();
  await expect(page.locator("#destination")).toHaveValue("chorwacja");
  await expect(page.locator("#message")).toHaveValue("Płyniemy z babcią.");
});

test("FAQ rozwija odpowiedzi i ma dane strukturalne", async ({ page }) => {
  await page.goto("/");
  const faq = page.locator("#faq");
  const items = faq.locator("details");
  await expect(items).toHaveCount(10);
  await expect(items.first()).toHaveAttribute("open", "");

  const dog = faq.locator("summary", { hasText: "Czy mogę zabrać psa?" });
  await dog.click();
  await expect(faq.getByText(/To zależy od armatora/)).toBeVisible();
  await dog.click();
  await expect(faq.getByText(/To zależy od armatora/)).toBeHidden();

  const structuredData = await faq.locator("script[type='application/ld+json']").textContent();
  const parsed = JSON.parse(structuredData ?? "{}");
  expect(parsed["@type"]).toBe("FAQPage");
  expect(parsed.mainEntity).toHaveLength(10);
  expect(parsed.mainEntity[0].acceptedAnswer.text).toContain("pełną załogą");
});

test("narysowana trasa zostaje na mapie po animacji na każdej zakładce", async ({ page }) => {
  await page.goto("/");
  await page.locator("#trasy").scrollIntoViewIfNeeded();
  const tabs = page.locator("#trasy").getByRole("tab");
  for (let index = 0; index < 4; index += 1) {
    await tabs.nth(index).click();
    const trail = page.locator("[data-route-panel]:not([hidden]) [data-route-trail]");
    await expect.poll(() => trail.evaluate((path) => getComputedStyle(path).strokeDasharray), { timeout: 6000 }).toBe("none");
  }
});

test("akwen w stopce ustawia formularz zapytania", async ({ page }) => {
  await page.goto("/");
  await page.locator("[data-footer]").getByRole("link", { name: "Grecja" }).click();
  await expect(page.locator("#zapytanie")).toBeInViewport();
  await expect(page.locator("#destination")).toHaveValue("grecja");
});
