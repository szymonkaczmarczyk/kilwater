import type { APIRoute } from "astro";
import { z } from "astro/zod";
import { answerQuestion, loadAssistant, normalizeQuestion, screenQuestion } from "../../lib/assistant";
import { questionLimits } from "../../lib/assistant-limits";
import { readEnv } from "../../lib/env";
import { createRateLimiter } from "../../lib/rate-limit";
import { assistantFallback } from "../../data/assistant-answers";

export const prerender = false;

const maxBodyBytes = 2_000;
const isRateLimited = createRateLimiter(Number(readEnv("ASSISTANT_RATE_LIMIT") ?? 20), 10 * 60 * 1000);

const questionSchema = z.strictObject({
  question: z
    .string({ error: "Wpisz pytanie." })
    .transform(normalizeQuestion)
    .pipe(
      z
        .string()
        .min(questionLimits.min, { error: `Wpisz pytanie, co najmniej ${questionLimits.min} znaki.` })
        .max(questionLimits.max, { error: `Pytanie może mieć maksymalnie ${questionLimits.max} znaków.` }),
    ),
  website: z.string().optional(),
});

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

  const parsed = questionSchema.safeParse(payload);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const message = issue?.code === "unrecognized_keys" ? "To pole nie jest obsługiwane." : issue?.message;
    return json(400, { ok: false, error: message ?? "Wpisz pytanie." });
  }

  const { question, website } = parsed.data;
  if (website) return json(200, { ok: true, kind: "unknown", text: assistantFallback.unknown, related: [] });

  const screened = screenQuestion(question);
  if (screened) return json(200, { ok: true, ...screened });

  try {
    const reply = await answerQuestion(question);
    console.info(`[asystent] ${reply.kind}`);
    return json(200, { ok: true, ...reply });
  } catch {
    console.error("[asystent] model nie jest dostępny, uruchom npm run assistant:model");
    return json(503, { ok: false, reason: "unavailable" });
  }
};
