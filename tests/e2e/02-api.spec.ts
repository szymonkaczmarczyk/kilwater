import { expect, test } from "@playwright/test";

const nextMonthIso = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().slice(0, 10);
};

const validInquiry = () => ({
  destination: "grecja",
  startDate: nextMonthIso(),
  nights: "7",
  guests: 4,
  cruiseType: "pelna-zaloga",
  extras: ["sup"],
  name: "Jan Testowy",
  email: "jan@przyklad.pl",
  phone: "",
  message: "",
  consent: true,
  website: "",
});

test.describe.serial("endpoint /api/zapytanie", () => {
  test("odrzuca treść inną niż JSON", async ({ request }) => {
    const response = await request.post("/api/zapytanie", { headers: { "Content-Type": "text/plain" }, data: "test" });
    expect(response.status()).toBe(415);
  });

  test("odrzuca niedozwolone pola i zwraca błędy pól", async ({ request }) => {
    const response = await request.post("/api/zapytanie", {
      data: { ...validInquiry(), guests: 40, isAdmin: true },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errors.guests).toContain("Maksymalnie 12");
    expect(JSON.stringify(body)).not.toContain("stack");
  });

  test("po cichu przyjmuje zgłoszenie bota z wypełnioną pułapką", async ({ request }) => {
    const response = await request.post("/api/zapytanie", { data: { ...validInquiry(), website: "https://spam.example" } });
    expect(response.status()).toBe(200);
  });

  test("ogranicza liczbę zapytań z jednego adresu", async ({ request }) => {
    const statuses: number[] = [];
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const response = await request.post("/api/zapytanie", { data: validInquiry() });
      statuses.push(response.status());
    }
    expect(statuses).toContain(429);
  });
});
