import path from "node:path";
import { env, pipeline, type FeatureExtractionPipeline } from "@huggingface/transformers";
import { assistantEntries, assistantFallback, type AssistantLink } from "../data/assistant-answers";

type AssistantKind = "answer" | "unsure" | "unknown" | "blocked";
type AssistantReply = {
  kind: AssistantKind;
  text: string;
  link?: AssistantLink;
  matchedQuestion?: string;
  related: string[];
};

const assistantModelId = "Xenova/bge-m3";
export const matchThresholds = { confident: 0.8, answer: 0.7, margin: 0.04, alsoRelevant: 0.72, suggestion: 0.64 };
const relatedLimit = 3;

env.cacheDir = path.resolve("models");
env.localModelPath = path.resolve("models");
env.allowRemoteModels = false;

const emailPattern = /[\p{L}\d.+_-]+@[\p{L}\d-]+\.[\p{L}\d.]+/u;
const phonePattern = /(\+?\d[\s-]?){9,}/;
const linkPattern = /(https?:\/\/|www\.)\S+|\b[\p{L}\d-]+\.(com|pl|net|org|io|eu|info|app|dev)\b/iu;

export const normalizeQuestion = (question: string) => question.replace(/\s+/g, " ").trim();

export const screenQuestion = (question: string): AssistantReply | null => {
  if (emailPattern.test(question) || phonePattern.test(question)) {
    return { kind: "blocked", text: assistantFallback.contact, related: [] };
  }
  if (linkPattern.test(question)) return { kind: "blocked", text: assistantFallback.link, related: [] };
  return null;
};

const embedBatchSize = 8;

const embedTexts = async (embed: FeatureExtractionPipeline, texts: string[]) => {
  const vectors: number[][] = [];
  for (let start = 0; start < texts.length; start += embedBatchSize) {
    const batch = texts.slice(start, start + embedBatchSize);
    vectors.push(...((await embed(batch, { pooling: "cls", normalize: true })).tolist() as number[][]));
  }
  return vectors;
};

const similarity = (first: number[], second: number[]) =>
  first.reduce((sum, value, index) => sum + value * second[index], 0);

const buildIndex = async () => {
  const embed = await pipeline("feature-extraction", assistantModelId, {
    dtype: "q8",
    session_options: { enableCpuMemArena: false },
  });
  const phrases = assistantEntries.flatMap((entry, entryIndex) =>
    entry.questions.map((question) => ({ entryIndex, question })),
  );
  const vectors = await embedTexts(
    embed,
    phrases.map((phrase) => phrase.question),
  );
  return { embed, phrases: phrases.map((phrase, index) => ({ ...phrase, vector: vectors[index] })) };
};

let indexPromise: ReturnType<typeof buildIndex> | undefined;
export const loadAssistant = () => {
  indexPromise ??= buildIndex().catch((error) => {
    indexPromise = undefined;
    throw error;
  });
  return indexPromise;
};

export const rankEntries = async (question: string) => {
  const { embed, phrases } = await loadAssistant();
  const [questionVector] = await embedTexts(embed, [question]);
  const bestByEntry = new Map<number, { score: number; question: string }>();
  for (const phrase of phrases) {
    const score = similarity(questionVector, phrase.vector);
    const best = bestByEntry.get(phrase.entryIndex);
    if (!best || score > best.score) bestByEntry.set(phrase.entryIndex, { score, question: phrase.question });
  }
  return [...bestByEntry.entries()]
    .map(([entryIndex, best]) => ({ entry: assistantEntries[entryIndex], ...best }))
    .sort((first, second) => second.score - first.score);
};

export const answerQuestion = async (question: string): Promise<AssistantReply> => {
  const ranked = await rankEntries(question);
  const [top, ...rest] = ranked;
  const margin = top && rest[0] ? top.score - rest[0].score : 1;
  const isConfident =
    top &&
    (top.score >= matchThresholds.confident ||
      (top.score >= matchThresholds.answer && margin >= matchThresholds.margin));
  const relatedFrom = (candidates: typeof ranked, minimumScore: number) =>
    candidates
      .filter((candidate) => candidate.score >= minimumScore)
      .slice(0, relatedLimit)
      .map((candidate) => candidate.entry.questions[0]);

  if (isConfident) {
    return {
      kind: "answer",
      text: top.entry.answer,
      link: top.entry.link,
      matchedQuestion: top.entry.questions[0],
      related: relatedFrom(rest, matchThresholds.alsoRelevant),
    };
  }

  const related = relatedFrom(ranked, matchThresholds.suggestion);
  return related.length
    ? { kind: "unsure", text: assistantFallback.unsure, related }
    : { kind: "unknown", text: assistantFallback.unknown, related: [] };
};
