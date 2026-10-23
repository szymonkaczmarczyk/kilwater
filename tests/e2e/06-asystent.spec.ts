import { expect, test, type Page } from "@playwright/test";

const assistantOf = (page: Page) => page.locator("[data-assistant]");

const ask = async (page: Page, question: string) => {
  const assistant = assistantOf(page);
  await assistant.getByLabel("Twoje pytanie o rejs").fill(question);
  await assistant.getByRole("button", { name: "Zapytaj" }).click();
};

test.describe.serial("asystent w FAQ", () => {
  test.beforeAll(async ({ request }) => {
    expect((await request.get("/api/asystent")).status()).toBe(204);
    const warmUp = await request.post("/api/asystent", { data: { question: "Co spakować na rejs?" }, timeout: 60_000 });
    expect(warmUp.status()).toBe(200);
  });

  test("podpowiedź zadaje pytanie i pokazuje odpowiedź z bazy", async ({ page }) => {
    await page.goto("/");
    const assistant = assistantOf(page);
    await expect(assistant.getByText("Odpowiedzi z bazy wiedzy Kilwater")).toBeVisible();
    await assistant.getByRole("button", { name: "Kiedy na Cykladach wieje meltemi?" }).click();
    await expect(assistant.locator("[data-assistant-answer]")).toHaveAttribute("data-kind", "answer");
    await expect(assistant.locator("[data-assistant-text]")).toContainText("meltemi");
    await expect(assistant.getByRole("link", { name: "Zobacz kalendarz sezonu" })).toBeVisible();
    await expect(assistant.getByLabel("Twoje pytanie o rejs")).toHaveValue("");
  });

  test("pytanie innymi słowami trafia w pytanie z bazy", async ({ page }) => {
    await page.goto("/");
    await ask(page, "czy na jacht wejdzie mój labrador");
    const assistant = assistantOf(page);
    await expect(assistant.locator("[data-assistant-matched]")).toHaveText("Najbliższe pytanie w naszej bazie: „Czy mogę zabrać psa?”");
    await expect(assistant.locator("[data-assistant-text]")).toContainText("To zależy od armatora");
  });

  test("pytanie o cenę odsyła do formularza", async ({ page }) => {
    await page.goto("/");
    await ask(page, "jaki jest koszt tygodnia na katamaranie");
    const cta = assistantOf(page).getByRole("link", { name: "Wyślij zapytanie do brokera" });
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page.locator("#zapytanie")).toBeInViewport();
  });

  test("pytanie spoza tematu kieruje na e-mail z treścią pytania", async ({ page }) => {
    await page.goto("/");
    await ask(page, "jak zrobić bigos");
    const assistant = assistantOf(page);
    await expect(assistant.locator("[data-assistant-answer]")).toHaveAttribute("data-kind", "unknown");
    await expect(assistant.locator("[data-assistant-text]")).toContainText("Nie znam odpowiedzi");
    const mail = assistant.getByRole("link", { name: "Napisz na kontakt@kilwater.com" });
    await expect(mail).toHaveAttribute("href", /^mailto:kontakt@kilwater\.com\?subject=Pytanie%20o%20rejs&body=jak%20zrobi/);
  });

  test("dane kontaktowe są zatrzymane przed przetworzeniem", async ({ page }) => {
    await page.goto("/");
    await ask(page, "Zadzwońcie do mnie, mój numer to 500 600 700");
    const answer = assistantOf(page).locator("[data-assistant-answer]");
    await expect(answer).toHaveAttribute("data-kind", "blocked");
    await expect(answer).toContainText("Nie wpisuj tu danych kontaktowych");
  });

  test("puste pytanie pokazuje błąd przy polu", async ({ page }) => {
    await page.goto("/");
    const assistant = assistantOf(page);
    await assistant.getByRole("button", { name: "Zapytaj" }).click();
    await expect(assistant.getByRole("alert")).toContainText("Wpisz pytanie, co najmniej 3 znaki.");
    await expect(assistant.getByLabel("Twoje pytanie o rejs")).toHaveAttribute("aria-invalid", "true");
  });

  test("Enter wysyła pytanie, a Shift + Enter dodaje nową linię", async ({ page }) => {
    await page.goto("/");
    const field = assistantOf(page).getByLabel("Twoje pytanie o rejs");
    await field.fill("Co spakować");
    await field.press("Shift+Enter");
    await expect(field).toHaveValue("Co spakować\n");
    await field.pressSequentially(" na rejs?");
    await field.press("Enter");
    await expect(assistantOf(page).locator("[data-assistant-asked]")).toHaveText("Co spakować na rejs?");
  });

  test("baza odpowiedzi i model zostają na serwerze", async ({ page, request }) => {
    await page.goto("/");
    const scriptUrls = await page.locator("script[src]").evaluateAll((scripts) =>
      scripts.map((script) => (script as HTMLScriptElement).src),
    );
    const bundles = await Promise.all(scriptUrls.map(async (url) => (await request.get(url)).text()));
    const clientCode = bundles.join("\n") + (await page.content());
    expect(clientCode).not.toContain("Trasa po portach");
    expect(clientCode).not.toContain("bge-m3");
    expect(clientCode).not.toContain("onnxruntime");
  });

  test("API odrzuca złe zapytania i nadmiarowe pola", async ({ request }) => {
    const notJson = await request.post("/api/asystent", { headers: { "Content-Type": "text/plain" }, data: "test" });
    expect(notJson.status()).toBe(415);

    const extraField = await request.post("/api/asystent", { data: { question: "Co spakować?", model: "inny" } });
    expect(extraField.status()).toBe(400);
    expect((await extraField.json()).error).toBe("To pole nie jest obsługiwane.");

    const tooLong = await request.post("/api/asystent", { data: { question: "a".repeat(301) } });
    expect(tooLong.status()).toBe(400);
    expect((await tooLong.json()).error).toContain("maksymalnie 300");

    const withLink = await request.post("/api/asystent", { data: { question: "Co sądzisz o https://example.com?" } });
    expect(await withLink.json()).toMatchObject({ ok: true, kind: "blocked" });

    const bot = await request.post("/api/asystent", { data: { question: "Co spakować?", website: "spam" } });
    expect(await bot.json()).toMatchObject({ ok: true, kind: "unknown" });
  });

  test("na angielskiej stronie asystent odpowiada po angielsku", async ({ page }) => {
    await page.goto("/en/");
    const assistant = assistantOf(page);
    await expect(assistant.getByText("Answers from the Kilwater knowledge base")).toBeVisible();
    await assistant.getByLabel("Your question about the cruise").fill("can my labrador come on the boat");
    await assistant.getByRole("button", { name: "Ask" }).click();
    await expect(assistant.locator("[data-assistant-text]")).toContainText("It depends on the owner");
    await assistant.getByLabel("Your question about the cruise").fill("how to bake a cheesecake");
    await assistant.getByRole("button", { name: "Ask" }).click();
    await expect(assistant.locator("[data-assistant-text]")).toContainText("I do not know the answer");
    await expect(assistant.getByRole("link", { name: "Write to kontakt@kilwater.com" })).toBeVisible();
  });

  test("API ogranicza liczbę pytań z jednego adresu", async ({ request }) => {
    const statuses: number[] = [];
    for (let attempt = 0; attempt < 16; attempt += 1) {
      const response = await request.post("/api/asystent", { data: { question: "Co spakować na rejs?" } });
      statuses.push(response.status());
    }
    expect(statuses).toContain(429);
  });
});
