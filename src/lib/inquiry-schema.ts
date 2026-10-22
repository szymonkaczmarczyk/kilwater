import { z } from "astro/zod";
import {
  cruiseOptions,
  destinationOptions,
  extraOptions,
  guestLimits,
  messageMaxLength,
  nightOptions,
} from "../data/inquiry-options";

const valuesOf = <T extends readonly { value: string }[]>(options: T) =>
  options.map((option) => option.value) as [T[number]["value"], ...T[number]["value"][]];

const todayIso = () => new Date().toISOString().slice(0, 10);

export const inquirySchema = z.strictObject({
  destination: z.enum(valuesOf(destinationOptions), { error: "Wybierz akwen albo „Jeszcze nie wiem”." }),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { error: "Podaj datę wypłynięcia." })
    .refine((date) => date >= todayIso(), { error: "Data wypłynięcia nie może być w przeszłości." }),
  nights: z.enum(valuesOf(nightOptions), { error: "Wybierz długość rejsu." }),
  guests: z.coerce
    .number({ error: "Podaj liczbę osób." })
    .int({ error: "Liczba osób musi być liczbą całkowitą." })
    .min(guestLimits.min, { error: `Minimum ${guestLimits.min} osoba.` })
    .max(guestLimits.max, { error: `Maksymalnie ${guestLimits.max} osób na jednym jachcie.` }),
  cruiseType: z.enum(valuesOf(cruiseOptions), { error: "Wybierz rodzaj rejsu." }),
  extras: z.array(z.enum(valuesOf(extraOptions))).max(extraOptions.length).default([]),
  name: z.string().trim().min(2, { error: "Podaj imię i nazwisko." }).max(120, { error: "Imię i nazwisko jest za długie." }),
  email: z.string().trim().max(200).email({ error: "Podaj poprawny adres e-mail, np. jan@przyklad.pl." }),
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^$|^\+?[0-9 ()-]{7,}$/, { error: "Podaj numer w formacie +48 600 000 000 albo zostaw puste." })
    .default(""),
  message: z.string().trim().max(messageMaxLength, { error: `Wiadomość może mieć maksymalnie ${messageMaxLength} znaków.` }).default(""),
  consent: z.literal(true, { error: "Zaznacz akceptację regulaminu, żebyśmy mogli przygotować ofertę." }),
  website: z.string().max(0).default(""),
});

export type Inquiry = z.infer<typeof inquirySchema>;

const unsupportedFieldMessage = "To pole nie jest obsługiwane.";

export const fieldErrors = (error: z.ZodError) =>
  Object.fromEntries(
    error.issues.flatMap((issue) => {
      if (issue.code === "unrecognized_keys") return issue.keys.map((key) => [key, unsupportedFieldMessage]);
      return typeof issue.path[0] === "string" ? [[issue.path[0], issue.message]] : [];
    }),
  );
