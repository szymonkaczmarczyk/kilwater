import { expect, test } from "@playwright/test";

const nextMonthIso = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().slice(0, 10);
};

test.beforeEach(async ({ page }) => {
  await page.goto("/#zapytanie");
  await page.locator("#zapytanie").scrollIntoViewIfNeeded();
});

test("pusty formularz pokazuje błędy przy wymaganych polach", async ({ page }) => {
  await page.getByRole("button", { name: "Wyślij zapytanie" }).click();

  await expect(page.locator(".field__error.is-visible")).toHaveCount(6);
  await expect(page.locator("#destination-error")).toHaveText("Wybierz akwen albo „Jeszcze nie wiem”.");
  await expect(page.locator("#consent-error")).toContainText("Zaznacz akceptację regulaminu");
  await expect(page.locator("#destination")).toBeFocused();
  await expect(page.locator("#destination")).toHaveAttribute("aria-invalid", "true");
});

test("błędny e-mail i telefon dostają konkretną podpowiedź", async ({ page }) => {
  await page.locator("#email").fill("jan.przyklad.pl");
  await page.locator("#phone").fill("abc");
  await page.getByRole("button", { name: "Wyślij zapytanie" }).click();

  await expect(page.locator("#email-error")).toHaveText("Podaj poprawny adres e-mail, np. jan@przyklad.pl.");
  await expect(page.locator("#phone-error")).toContainText("+48 600 000 000");
});

test("stepper liczby osób trzyma się limitów", async ({ page }) => {
  const guests = page.locator("#guests");
  await guests.fill("12");
  await page.getByRole("button", { name: "Więcej osób" }).click();
  await expect(guests).toHaveValue("12");
  await guests.fill("1");
  await page.getByRole("button", { name: "Mniej osób" }).click();
  await expect(guests).toHaveValue("1");
});

test("poprawnie wypełniony formularz pokazuje potwierdzenie", async ({ page }) => {
  await page.locator("#destination").selectOption("chorwacja");
  await page.locator("#startDate").fill(nextMonthIso());
  await page.locator("#nights").selectOption("7");
  await page.locator("#guests").fill("6");
  await page.locator("label.choice", { hasText: "Ze skipperem" }).click();
  await page.locator("label.chip", { hasText: "Deski SUP" }).click();
  await page.locator("#name").fill("Anna Kowalska");
  await page.locator("#email").fill("anna@przyklad.pl");
  await page.locator("#message").fill("Pierwszy rejs, dwoje dzieci.");
  await page.locator("label.consent").click();

  await page.locator("#name").press("ControlOrMeta+Enter");

  await expect(page.locator("[data-form-success]")).toBeVisible();
  await expect(page.locator("[data-success-text]")).toContainText("Dziękujemy, Anna");
  await expect(page.locator("[data-inquiry-form]")).toBeHidden();
});

test("link z akwenu ustawia akwen w formularzu", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Zapytaj o rejs: Mazury" });
  await link.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);
  await link.click();
  await expect(page).toHaveURL(/\?akwen=mazury$/);
  await expect(page.locator("#destination")).toHaveValue("mazury");
  await expect(page.locator("#zapytanie")).toBeInViewport();
});
