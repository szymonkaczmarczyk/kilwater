import type { Localized } from "../i18n/locales";

export type RouteStop = { name: string; lat: number; lon: number; labelSide?: "left" | "right" | "above" | "below" };
export type RouteLeg = { from: string; to: string; text: Localized<string> };

export type SampleRoute = {
  slug: string;
  destination: string;
  title: Localized<string>;
  nights: number;
  stops: RouteStop[];
  legs: RouteLeg[];
};

export const sampleRoutes: SampleRoute[] = [
  {
    slug: "split-wyspy",
    destination: "chorwacja",
    title: { pl: "Split i wyspy środkowej Dalmacji", en: "Split and the islands of central Dalmatia" },
    nights: 7,
    stops: [
      { name: "Split", lat: 43.505, lon: 16.44 },
      { name: "Milna", lat: 43.327, lon: 16.449, labelSide: "right" },
      { name: "Bol", lat: 43.262, lon: 16.656 },
      { name: "Hvar", lat: 43.172, lon: 16.441 },
      { name: "Vis", lat: 43.061, lon: 16.185 },
      { name: "Komiža", lat: 43.044, lon: 16.093, labelSide: "left" },
      { name: "Maslinica", lat: 43.398, lon: 16.207, labelSide: "left" },
      { name: "Split", lat: 43.505, lon: 16.44 },
    ],
    legs: [
      { from: "Split", to: "Milna", text: { pl: "Spokojny start po odbiorze jachtu i kolacja w kamiennym porcie na Braču.", en: "An easy start after check-in and dinner in a stone harbour on Brač." } },
      { from: "Milna", to: "Bol", text: { pl: "Wzdłuż południowego brzegu Braču aż do plaży Zlatni Rat.", en: "Along the south coast of Brač to the Zlatni Rat beach." } },
      { from: "Bol", to: "Hvar", text: { pl: "Przez kanał na Hvar i wieczór w najbardziej znanym miasteczku Dalmacji.", en: "Across the channel to Hvar and an evening in Dalmatia's best known town." } },
      { from: "Hvar", to: "Vis", text: { pl: "Najdalej wysunięta wyspa, długo zamknięta dla turystów, z czystą wodą i ciszą.", en: "The outermost island, long closed to tourists, with clear water and quiet." } },
      { from: "Vis", to: "Komiža", text: { pl: "Dookoła wyspy, z możliwością wizyty w Modrej Špilji na Biševie.", en: "Around the island, with an optional visit to the Blue Cave on Biševo." } },
      { from: "Komiža", to: "Maslinica", text: { pl: "Najdłuższy przelot, z kąpielą po drodze i nocą w zielonej zatoce Šolty.", en: "The longest passage, with a swim on the way and a night in a green bay on Šolta." } },
      { from: "Maslinica", to: "Split", text: { pl: "Krótki odcinek do mariny i zdanie jachtu.", en: "A short leg to the marina and check-out." } },
    ],
  },
  {
    slug: "cyklady-lavrio",
    destination: "grecja",
    title: { pl: "Zachodnie Cyklady z Lavrio", en: "The Western Cyclades from Lavrio" },
    nights: 7,
    stops: [
      { name: "Lavrio", lat: 37.713, lon: 24.057, labelSide: "left" },
      { name: "Kea", lat: 37.661, lon: 24.316 },
      { name: "Kythnos", lat: 37.391, lon: 24.396, labelSide: "left" },
      { name: "Serifos", lat: 37.143, lon: 24.515, labelSide: "left" },
      { name: "Sifnos", lat: 36.99, lon: 24.674 },
      { name: "Syros", lat: 37.444, lon: 24.943 },
      { name: "Kea", lat: 37.661, lon: 24.316 },
      { name: "Lavrio", lat: 37.713, lon: 24.057, labelSide: "left" },
    ],
    legs: [
      { from: "Lavrio", to: "Kea", text: { pl: "Krótki przelot i kolacja w zatoce Vourkari.", en: "A short passage and dinner in Vourkari bay." } },
      { from: "Kea", to: "Kythnos", text: { pl: "Kotwica przy piaszczystym przesmyku Kolona, z wodą po obu stronach.", en: "Anchoring at the Kolona sandbar, with water on both sides." } },
      { from: "Kythnos", to: "Serifos", text: { pl: "Port Livadi i wieczór w białej Chorze na szczycie wzgórza.", en: "Livadi harbour and an evening in the white Chora on the hilltop." } },
      { from: "Serifos", to: "Sifnos", text: { pl: "Wyspa ceramiki i jednej z najlepszych kuchni na Cykladach.", en: "The island of pottery and some of the best food in the Cyclades." } },
      { from: "Sifnos", to: "Syros", text: { pl: "Ermoupoli, neoklasyczna stolica Cykladów z marmurowym rynkiem.", en: "Ermoupoli, the neoclassical capital of the Cyclades with a marble square." } },
      { from: "Syros", to: "Kea", text: { pl: "Dłuższy przelot na północny zachód, z powrotem w stronę lądu.", en: "A longer passage north west, back towards the mainland." } },
      { from: "Kea", to: "Lavrio", text: { pl: "Powrót do mariny i zdanie jachtu.", en: "Back to the marina and check-out." } },
    ],
  },
  {
    slug: "amalfi-procida",
    destination: "wlochy",
    title: { pl: "Zatoka Neapolitańska i Wybrzeże Amalfi", en: "The Bay of Naples and the Amalfi Coast" },
    nights: 7,
    stops: [
      { name: "Procida", lat: 40.762, lon: 14.024 },
      { name: "Ischia", lat: 40.746, lon: 13.943, labelSide: "left" },
      { name: "Capri", lat: 40.556, lon: 14.238, labelSide: "left" },
      { name: "Positano", lat: 40.628, lon: 14.485, labelSide: "above" },
      { name: "Amalfi", lat: 40.634, lon: 14.602 },
      { name: "Nerano", lat: 40.584, lon: 14.351, labelSide: "below" },
      { name: "Sorrento", lat: 40.629, lon: 14.376, labelSide: "left" },
      { name: "Procida", lat: 40.762, lon: 14.024 },
    ],
    legs: [
      { from: "Procida", to: "Ischia", text: { pl: "Krótki przelot, źródła termalne i Zamek Aragoński na skale.", en: "A short passage, hot springs and the Aragonese Castle on its rock." } },
      { from: "Ischia", to: "Capri", text: { pl: "Przez zatokę na Capri, z kąpielą przy skałach Faraglioni.", en: "Across the bay to Capri, with a swim by the Faraglioni rocks." } },
      { from: "Capri", to: "Positano", text: { pl: "Wybrzeże Amalfi od strony morza i kolorowe domy na klifie.", en: "The Amalfi Coast from the sea and colourful houses on the cliff." } },
      { from: "Positano", to: "Amalfi", text: { pl: "Krótki odcinek z postojem przy fiordzie Furore.", en: "A short leg with a stop at the Furore fjord." } },
      { from: "Amalfi", to: "Nerano", text: { pl: "Zatoka Ieranto i spaghetti z cukinią, z którego słynie Nerano.", en: "Ieranto bay and the courgette spaghetti Nerano is famous for." } },
      { from: "Nerano", to: "Sorrento", text: { pl: "Wieczór w Sorrento z widokiem na Wezuwiusz po drugiej stronie zatoki.", en: "An evening in Sorrento with Vesuvius across the bay." } },
      { from: "Sorrento", to: "Procida", text: { pl: "Powrót przez zatokę i zdanie jachtu.", en: "Back across the bay and check-out." } },
    ],
  },
  {
    slug: "mazury-gizycko",
    destination: "mazury",
    title: { pl: "Wielkie Jeziora Mazurskie z Giżycka", en: "The Great Masurian Lakes from Giżycko" },
    nights: 7,
    stops: [
      { name: "Giżycko", lat: 54.038, lon: 21.765 },
      { name: "Rydzewo", lat: 53.968, lon: 21.79 },
      { name: "Mikołajki", lat: 53.802, lon: 21.571, labelSide: "left" },
      { name: "Wierzba", lat: 53.757, lon: 21.64 },
      { name: "Ruciane-Nida", lat: 53.642, lon: 21.55, labelSide: "left" },
      { name: "Pranie", lat: 53.618, lon: 21.602 },
      { name: "Mikołajki", lat: 53.802, lon: 21.571, labelSide: "left" },
      { name: "Giżycko", lat: 54.038, lon: 21.765 },
    ],
    legs: [
      { from: "Giżycko", to: "Rydzewo", text: { pl: "Przez Niegocin do spokojnej przystani na skraju jeziora Boczne.", en: "Across Lake Niegocin to a quiet harbour at the edge of Lake Boczne." } },
      { from: "Rydzewo", to: "Mikołajki", text: { pl: "Przez Jagodne i Tałty do żeglarskiej stolicy Mazur.", en: "Through lakes Jagodne and Tałty to the sailing capital of Masuria." } },
      { from: "Mikołajki", to: "Wierzba", text: { pl: "Na Bełdany i nocleg w Wierzbie, na skraju Puszczy Piskiej.", en: "Onto Lake Bełdany and a night in Wierzba, at the edge of the Pisz Forest." } },
      { from: "Wierzba", to: "Ruciane-Nida", text: { pl: "Krętymi Bełdanami i przez śluzę Guzianka do Ruciane.", en: "Along winding Bełdany and through the Guzianka lock to Ruciane." } },
      { from: "Ruciane-Nida", to: "Pranie", text: { pl: "Jezioro Nidzkie, leśna cisza i leśniczówka Gałczyńskiego.", en: "Lake Nidzkie, forest quiet and the poet Gałczyński's forester's lodge." } },
      { from: "Pranie", to: "Mikołajki", text: { pl: "Powrót przez Guziankę i Bełdany.", en: "Back through Guzianka and Bełdany." } },
      { from: "Mikołajki", to: "Giżycko", text: { pl: "Ostatni odcinek na północ i zdanie jachtu.", en: "The last leg north and check-out." } },
    ],
  },
];
