import type { APIRoute } from "astro";
import { z } from "astro/zod";
import { answerQuestion, loadAssistant, normalizeQuestion, screenQuestion } from "../../lib/assistant";
import { questionLimits } from "../../lib/assistant-limits";
import { readEnv } from "../../lib/env";
import { createRateLimiter } from "../../lib/rate-limit";
import { assistantFallback } from "../../data/assistant-answers";
import { locales, toLocale, type Locale } from "../../i18n/locales";
import { useTranslations } from "../../i18n/ui";

export const prerender = false;

const maxBodyBytes = 2_000;
const isRateLimited = createRateLimiter(Number(readEnv("ASSISTANT_RATE_LIMIT") ?? 20), 10 * 60 * 1000);

const createQuestionSchema = (locale: Locale) => {
  const t = useTranslations(locale).assistant;
  return z.strictObject({
    question: z
      .string({ error: t.missing })
      .transform(normalizeQuestion)
      .pipe(
        z
          .string()
          .min(questionLimits.min, { error: t.minLength(questionLimits.min) })
          .max(questionLimits.max, { error: t.maxLength(questionLimits.max) }),
      ),
    website: z.string().optional(),
    lang: z.enum(locales).default("pl"),
  });
};

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export const GET: APIRoute = () => {
  loadAssistant().catch(() => console.error("[asystent] model nie jest dostępny, uruchom npm run assistant:model"));
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
};

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!request.headers.get("content-type")?.includes("application/json")) return json(415, { ok: false });

  const rawBody = await request.text();
  if (rawBody.length > maxBodyBytes) return json(413, { ok: false });

  if (isRateLimited(clientAddress ?? "unknown")) return json(429, { ok: false, reason: "rate_limited" });

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return json(400, { ok: false });
  }

  const locale = toLocale(typeof payload === "object" && payload && "lang" in payload ? String(payload.lang) : undefined);
  const parsed = createQuestionSchema(locale).safeParse(payload);
  if (!parsed.success) {
    const t = useTranslations(locale).assistant;
    const issue = parsed.error.issues[0];
    const message = issue?.code === "unrecognized_keys" ? t.unsupported : issue?.message;
    return json(400, { ok: false, error: message ?? t.missing });
  }

  const { question, website, lang } = parsed.data;
  if (website) return json(200, { ok: true, kind: "unknown", text: assistantFallback[lang].unknown, related: [] });

  const screened = screenQuestion(question, lang);
  if (screened) return json(200, { ok: true, ...screened });

  try {
    const reply = await answerQuestion(question, lang);
    console.info(`[asystent] ${reply.kind}`);
    return json(200, { ok: true, ...reply });
  } catch {
    console.error("[asystent] model nie jest dostępny, uruchom npm run assistant:model");
    return json(503, { ok: false, reason: "unavailable" });
  }
};
