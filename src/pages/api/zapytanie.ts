import type { APIRoute } from "astro";
import { createInquirySchema, fieldErrors, type Inquiry } from "../../lib/inquiry-schema";
import { toLocale } from "../../i18n/locales";
import { cruiseOptions, destinationOptions, extraOptions, nightOptions } from "../../data/inquiry-options";
import { readEnv } from "../../lib/env";
import { createRateLimiter } from "../../lib/rate-limit";

export const prerender = false;

const maxBodyBytes = 10_000;
const isRateLimited = createRateLimiter(5, 10 * 60 * 1000);

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const labelOf = (options: readonly { value: string; label: { pl: string } }[], value: string) =>
  options.find((option) => option.value === value)?.label.pl ?? value;

const inquiryText = (inquiry: Inquiry) =>
  [
    `Akwen: ${labelOf(destinationOptions, inquiry.destination)}`,
    `Data wypłynięcia: ${inquiry.startDate}`,
    `Długość: ${labelOf(nightOptions, inquiry.nights)}`,
    `Liczba osób: ${inquiry.guests}`,
    `Rodzaj rejsu: ${labelOf(cruiseOptions, inquiry.cruiseType)}`,
    `Dodatki: ${inquiry.extras.map((extra) => labelOf(extraOptions, extra)).join(", ") || "brak"}`,
    "",
    `Imię i nazwisko: ${inquiry.name}`,
    `E-mail: ${inquiry.email}`,
    `Telefon: ${inquiry.phone || "nie podano"}`,
    "",
    `Wiadomość: ${inquiry.message || "brak"}`,
    `Język strony klienta: ${inquiry.lang === "en" ? "angielski" : "polski"}`,
  ].join("\n");

const deliverInquiry = async (inquiry: Inquiry) => {
  const apiKey = readEnv("RESEND_API_KEY");
  const recipient = readEnv("INQUIRY_TO_EMAIL");
  const sender = readEnv("INQUIRY_FROM_EMAIL");

  if (!apiKey || !recipient || !sender) {
    if (import.meta.env.DEV || readEnv("INQUIRY_DRY_RUN") === "1") {
      console.info(`[zapytanie] tryb testowy, wiadomość nie została wysłana:\n${inquiryText(inquiry)}`);
      return true;
    }
    console.error("[zapytanie] brak konfiguracji wysyłki e-mail");
    return false;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      reply_to: inquiry.email,
      subject: `Zapytanie o rejs: ${labelOf(destinationOptions, inquiry.destination)}, ${inquiry.startDate}`,
      text: inquiryText(inquiry),
    }),
  });

  if (!response.ok) console.error(`[zapytanie] błąd wysyłki e-mail: ${response.status}`);
  return response.ok;
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json(415, { ok: false });
  }

  const rawBody = await request.text();
  if (rawBody.length > maxBodyBytes) return json(413, { ok: false });

  if (isRateLimited(clientAddress ?? "unknown")) return json(429, { ok: false });

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return json(400, { ok: false });
  }

  if (typeof payload === "object" && payload && "website" in payload && (payload as { website: unknown }).website) {
    return json(200, { ok: true });
  }

  const locale = toLocale(typeof payload === "object" && payload && "lang" in payload ? String(payload.lang) : undefined);
  const parsed = createInquirySchema(locale).safeParse(payload);
  if (!parsed.success) return json(400, { ok: false, errors: fieldErrors(parsed.error, locale) });

  const delivered = await deliverInquiry(parsed.data);
  return delivered ? json(200, { ok: true }) : json(503, { ok: false });
};
