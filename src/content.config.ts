import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const guide = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/poradnik" }),
  schema: ({ image }) =>
    z.strictObject({
      title: z.string(),
      description: z.string().max(170),
      published: z.coerce.date(),
      updated: z.coerce.date().optional(),
      cover: image(),
      coverAlt: z.string(),
      topic: z.string(),
      order: z.number().int(),
    }),
});

export const collections = { guide };
