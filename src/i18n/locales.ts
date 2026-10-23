export const locales = ["pl", "en"] as const;
export type Locale = (typeof locales)[number];
export type Localized<T> = Record<Locale, T>;

export const defaultLocale: Locale = "pl";

export const toLocale = (value: string | undefined | null): Locale =>
  locales.includes(value as Locale) ? (value as Locale) : defaultLocale;

export const localize =
  (locale: Locale) =>
  <T>(value: Localized<T>): T =>
    value[locale];

const pagePaths = {
  home: { pl: "/", en: "/en/" },
  privacy: { pl: "/polityka-prywatnosci", en: "/en/privacy-policy" },
  terms: { pl: "/regulamin", en: "/en/terms" },
  guide: { pl: "/poradnik", en: null },
} satisfies Record<string, Record<Locale, string | null>>;

export type PageKey = keyof typeof pagePaths;

export const pagePath = (page: PageKey, locale: Locale) => pagePaths[page][locale] ?? pagePaths[page].pl;

export const hasPage = (page: PageKey, locale: Locale) => pagePaths[page][locale] !== null;

export const alternatePaths = (page: PageKey) =>
  locales.flatMap((locale) => (pagePaths[page][locale] ? [{ locale, path: pagePaths[page][locale]! }] : []));

export const sectionHref = (locale: Locale, id: string, query?: Record<string, string>) => {
  const search = query ? `?${new URLSearchParams(query)}` : "";
  return `${pagePath("home", locale)}${search}#${id}`;
};
