import type { Localized } from "../i18n/locales";

export type SeasonLevel = "best" | "peak" | "good" | "cool";

type SeasonMonth = { number: number; short: string; name: Localized<string>; inName: Localized<string> };
type SeasonLevelText = { label: string; text: string };
type Season = {
  destination: string;
  name: Localized<string>;
  inName: Localized<string>;
  levels: readonly SeasonLevel[];
  wind: Localized<string>;
  water: Localized<string>;
};

export const seasonMonths: SeasonMonth[] = [
  { number: 4, short: "IV", name: { pl: "kwiecień", en: "April" }, inName: { pl: "w kwietniu", en: "in April" } },
  { number: 5, short: "V", name: { pl: "maj", en: "May" }, inName: { pl: "w maju", en: "in May" } },
  { number: 6, short: "VI", name: { pl: "czerwiec", en: "June" }, inName: { pl: "w czerwcu", en: "in June" } },
  { number: 7, short: "VII", name: { pl: "lipiec", en: "July" }, inName: { pl: "w lipcu", en: "in July" } },
  { number: 8, short: "VIII", name: { pl: "sierpień", en: "August" }, inName: { pl: "w sierpniu", en: "in August" } },
  { number: 9, short: "IX", name: { pl: "wrzesień", en: "September" }, inName: { pl: "we wrześniu", en: "in September" } },
  { number: 10, short: "X", name: { pl: "październik", en: "October" }, inName: { pl: "w październiku", en: "in October" } },
];

export const seasonLevels: Localized<Record<SeasonLevel, SeasonLevelText>> = {
  pl: {
    best: { label: "Najlepszy czas", text: "Ciepła woda, mniej ludzi niż w wakacje i łatwiej o miejsce w marinie." },
    peak: { label: "Szczyt sezonu", text: "Najcieplej i najwięcej jachtów. Rezerwuj z kilkumiesięcznym wyprzedzeniem." },
    good: { label: "Dobry termin", text: "Chłodniejsza woda, ale spokojne zatoki i wolne miejsca w portach." },
    cool: { label: "Chłodniej", text: "Dla żeglarzy, którym nie przeszkadza zimna woda i zmienna pogoda." },
  },
  en: {
    best: { label: "Best time", text: "Warm water, fewer people than in the holidays and easier marina berths." },
    peak: { label: "Peak season", text: "The warmest weather and the most yachts. Book a few months ahead." },
    good: { label: "Good time", text: "Cooler water, but quiet bays and free berths in the harbours." },
    cool: { label: "Cooler", text: "For sailors who do not mind cold water and changeable weather." },
  },
};

export const seasons: Season[] = [
  {
    destination: "chorwacja",
    name: { pl: "Chorwacja", en: "Croatia" },
    inName: { pl: "w Chorwacji", en: "in Croatia" },
    levels: ["cool", "good", "best", "peak", "peak", "best", "good"],
    wind: {
      pl: "Latem popołudniowy maestral z północnego zachodu, poza sezonem częściej bura i jugo.",
      en: "In summer an afternoon maestral from the north west, outside the season more often bora and jugo.",
    },
    water: { pl: "Woda ok. 18-19°C w maju, 24-25°C w sierpniu.", en: "Water about 18-19°C in May, 24-25°C in August." },
  },
  {
    destination: "grecja",
    name: { pl: "Grecja", en: "Greece" },
    inName: { pl: "w Grecji", en: "in Greece" },
    levels: ["cool", "good", "best", "peak", "peak", "best", "good"],
    wind: {
      pl: "W lipcu i sierpniu na Cykladach wieje silne meltemi z północy. Morze Jońskie jest wtedy spokojniejsze.",
      en: "In July and August a strong northerly meltemi blows in the Cyclades. The Ionian Sea is calmer then.",
    },
    water: {
      pl: "Woda ok. 19-20°C w maju, 24-25°C w sierpniu i wrześniu.",
      en: "Water about 19-20°C in May, 24-25°C in August and September.",
    },
  },
  {
    destination: "wlochy",
    name: { pl: "Włochy", en: "Italy" },
    inName: { pl: "we Włoszech", en: "in Italy" },
    levels: ["cool", "good", "best", "peak", "peak", "best", "good"],
    wind: {
      pl: "Przeważnie łagodna bryza od morza. W połowie sierpnia, w okolicach Ferragosto, zatoki są najbardziej zatłoczone.",
      en: "Mostly a gentle sea breeze. In mid August, around Ferragosto, the bays are at their busiest.",
    },
    water: { pl: "Woda ok. 19°C w maju, 25-26°C w sierpniu.", en: "Water about 19°C in May, 25-26°C in August." },
  },
  {
    destination: "mazury",
    name: { pl: "Mazury", en: "Masuria" },
    inName: { pl: "na Mazurach", en: "in Masuria" },
    levels: ["cool", "good", "best", "peak", "peak", "best", "cool"],
    wind: {
      pl: "Zmienny wiatr i szybkie burze w upalne dni. Po wakacjach przystanie pustoszeją.",
      en: "Changeable wind and quick thunderstorms on hot days. After the holidays the harbours empty out.",
    },
    water: { pl: "Woda ok. 15°C w maju, 20-22°C w lipcu.", en: "Water about 15°C in May, 20-22°C in July." },
  },
];
