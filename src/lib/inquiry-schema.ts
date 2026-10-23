import { z } from "astro/zod";
import {
  cruiseOptions,
  destinationOptions,
  extraOptions,
  guestLimits,
  messageMaxLength,
  nightOptions,
} from "../data/inquiry-options";
import { inquiryMessages } from "../i18n/inquiry-messages";
import { locales, type Locale } from "../i18n/locales";

const valuesOf = <T extends readonly { value: string }[]>(options: T) =>
  options.map((option) => option.value) as [T[number]["value"], ...T[number]["value"][]];

const todayIso = () => new Date().toISOString().slice(0, 10);

export const createInquirySchema = (locale: Locale) => {
  const messages = inquiryMessages[locale];
  return z.strictObject({
    destination: z.enum(valuesOf(destinationOptions), { error: messages.destination }),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { error: messages.startDateMissing })
      .refine((date) => date >= todayIso(), { error: messages.startDatePast }),
    nights: z.enum(valuesOf(nightOptions), { error: messages.nights }),
    guests: z.coerce
      .number({ error: messages.guestsMissing })
      .int({ error: messages.guestsInteger })
      .min(guestLimits.min, { error: messages.guestsMin })
      .max(guestLimits.max, { error: messages.guestsMax }),
    cruiseType: z.enum(valuesOf(cruiseOptions), { error: messages.cruiseType }),
    extras: z.array(z.enum(valuesOf(extraOptions))).max(extraOptions.length).default([]),
    name: z.string().trim().min(2, { error: messages.nameMissing }).max(120, { error: messages.nameTooLong }),
    email: z.string().trim().max(200).pipe(z.email({ error: messages.email })),
    phone: z
      .string()
      .trim()
      .max(30)
      .regex(/^$|^\+?[0-9 ()-]{7,}$/, { error: messages.phone })
      .default(""),
    message: z.string().trim().max(messageMaxLength, { error: messages.message }).default(""),
    consent: z.literal(true, { error: messages.consent }),
    website: z.string().max(0).default(""),
    lang: z.enum(locales).default("pl"),
  });
};

export type Inquiry = z.infer<ReturnType<typeof createInquirySchema>>;

export const fieldErrors = (error: z.ZodError, locale: Locale) =>
  Object.fromEntries(
    error.issues.flatMap((issue) => {
      if (issue.code === "unrecognized_keys") return issue.keys.map((key) => [key, inquiryMessages[locale].unsupported]);
      return typeof issue.path[0] === "string" ? [[issue.path[0], issue.message]] : [];
    }),
  );
