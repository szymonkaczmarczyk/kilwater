export type SeasonLevel = "best" | "peak" | "good" | "cool";

export const seasonMonths = [
  { number: 4, short: "IV", name: "kwiecień", inName: "w kwietniu" },
  { number: 5, short: "V", name: "maj", inName: "w maju" },
  { number: 6, short: "VI", name: "czerwiec", inName: "w czerwcu" },
  { number: 7, short: "VII", name: "lipiec", inName: "w lipcu" },
  { number: 8, short: "VIII", name: "sierpień", inName: "w sierpniu" },
  { number: 9, short: "IX", name: "wrzesień", inName: "we wrześniu" },
  { number: 10, short: "X", name: "październik", inName: "w październiku" },
] as const;

export const seasonLevels: Record<SeasonLevel, { label: string; text: string }> = {
  best: {
    label: "Najlepszy czas",
    text: "Ciepła woda, mniej ludzi niż w wakacje i łatwiej o miejsce w marinie.",
  },
  peak: {
    label: "Szczyt sezonu",
    text: "Najcieplej i najwięcej jachtów. Rezerwuj z kilkumiesięcznym wyprzedzeniem.",
  },
  good: {
    label: "Dobry termin",
    text: "Chłodniejsza woda, ale spokojne zatoki i wolne miejsca w portach.",
  },
  cool: {
    label: "Chłodniej",
    text: "Dla żeglarzy, którym nie przeszkadza zimna woda i zmienna pogoda.",
  },
};

export const seasons = [
  {
    destination: "chorwacja",
    name: "Chorwacja",
    inName: "w Chorwacji",
    levels: ["cool", "good", "best", "peak", "peak", "best", "good"],
    wind: "Latem popołudniowy maestral z północnego zachodu, poza sezonem częściej bura i jugo.",
    water: "Woda ok. 18-19°C w maju, 24-25°C w sierpniu.",
  },
  {
    destination: "grecja",
    name: "Grecja",
    inName: "w Grecji",
    levels: ["cool", "good", "best", "peak", "peak", "best", "good"],
    wind: "W lipcu i sierpniu na Cykladach wieje silne meltemi z północy. Morze Jońskie jest wtedy spokojniejsze.",
    water: "Woda ok. 19-20°C w maju, 24-25°C w sierpniu i wrześniu.",
  },
  {
    destination: "wlochy",
    name: "Włochy",
    inName: "we Włoszech",
    levels: ["cool", "good", "best", "peak", "peak", "best", "good"],
    wind: "Przeważnie łagodna bryza od morza. W połowie sierpnia, w okolicach Ferragosto, zatoki są najbardziej zatłoczone.",
    water: "Woda ok. 19°C w maju, 25-26°C w sierpniu.",
  },
  {
    destination: "mazury",
    name: "Mazury",
    inName: "na Mazurach",
    levels: ["cool", "good", "best", "peak", "peak", "best", "cool"],
    wind: "Zmienny wiatr i szybkie burze w upalne dni. Po wakacjach przystanie pustoszeją.",
    water: "Woda ok. 15°C w maju, 20-22°C w lipcu.",
  },
] as const satisfies readonly {
  destination: string;
  name: string;
  inName: string;
  levels: readonly SeasonLevel[];
  wind: string;
  water: string;
}[];
