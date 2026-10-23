export type RouteStop = { name: string; lat: number; lon: number; labelSide?: "left" | "right" | "above" | "below" };
export type RouteLeg = { from: string; to: string; text: string };

export type SampleRoute = {
  slug: string;
  destination: string;
  tab: string;
  title: string;
  nights: number;
  stops: RouteStop[];
  legs: RouteLeg[];
};

export const sampleRoutes: SampleRoute[] = [
  {
    slug: "split-wyspy",
    destination: "chorwacja",
    tab: "Chorwacja",
    title: "Split i wyspy środkowej Dalmacji",
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
      { from: "Split", to: "Milna", text: "Spokojny start po odbiorze jachtu i kolacja w kamiennym porcie na Braču." },
      { from: "Milna", to: "Bol", text: "Wzdłuż południowego brzegu Braču aż do plaży Zlatni Rat." },
      { from: "Bol", to: "Hvar", text: "Przez kanał na Hvar i wieczór w najbardziej znanym miasteczku Dalmacji." },
      { from: "Hvar", to: "Vis", text: "Najdalej wysunięta wyspa, długo zamknięta dla turystów, z czystą wodą i ciszą." },
      { from: "Vis", to: "Komiža", text: "Dookoła wyspy, z możliwością wizyty w Modrej Špilji na Biševie." },
      { from: "Komiža", to: "Maslinica", text: "Najdłuższy przelot, z kąpielą po drodze i nocą w zielonej zatoce Šolty." },
      { from: "Maslinica", to: "Split", text: "Krótki odcinek do mariny i zdanie jachtu." },
    ],
  },
  {
    slug: "cyklady-lavrio",
    destination: "grecja",
    tab: "Grecja",
    title: "Zachodnie Cyklady z Lavrio",
    nights: 7,
    stops: [
      { name: "Lavrio", lat: 37.713, lon: 24.057, labelSide: "left" },
      { name: "Kea", lat: 37.669, lon: 24.322 },
      { name: "Kythnos", lat: 37.432, lon: 24.38, labelSide: "left" },
      { name: "Serifos", lat: 37.143, lon: 24.515, labelSide: "left" },
      { name: "Sifnos", lat: 36.99, lon: 24.674 },
      { name: "Syros", lat: 37.444, lon: 24.943 },
      { name: "Kea", lat: 37.655, lon: 24.31 },
      { name: "Lavrio", lat: 37.713, lon: 24.057, labelSide: "left" },
    ],
    legs: [
      { from: "Lavrio", to: "Kea", text: "Krótki przelot i kolacja w zatoce Vourkari." },
      { from: "Kea", to: "Kythnos", text: "Kotwica przy piaszczystym przesmyku Kolona, z wodą po obu stronach." },
      { from: "Kythnos", to: "Serifos", text: "Port Livadi i wieczór w białej Chorze na szczycie wzgórza." },
      { from: "Serifos", to: "Sifnos", text: "Wyspa ceramiki i jednej z najlepszych kuchni na Cykladach." },
      { from: "Sifnos", to: "Syros", text: "Ermoupoli, neoklasyczna stolica Cykladów z marmurowym rynkiem." },
      { from: "Syros", to: "Kea", text: "Dłuższy przelot na północny zachód, z powrotem w stronę lądu." },
      { from: "Kea", to: "Lavrio", text: "Powrót do mariny i zdanie jachtu." },
    ],
  },
  {
    slug: "amalfi-procida",
    destination: "wlochy",
    tab: "Włochy",
    title: "Zatoka Neapolitańska i Wybrzeże Amalfi",
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
      { from: "Procida", to: "Ischia", text: "Krótki przelot, źródła termalne i Zamek Aragoński na skale." },
      { from: "Ischia", to: "Capri", text: "Przez zatokę na Capri, z kąpielą przy skałach Faraglioni." },
      { from: "Capri", to: "Positano", text: "Wybrzeże Amalfi od strony morza i kolorowe domy na klifie." },
      { from: "Positano", to: "Amalfi", text: "Krótki odcinek z postojem przy fiordzie Furore." },
      { from: "Amalfi", to: "Nerano", text: "Zatoka Ieranto i spaghetti z cukinią, z którego słynie Nerano." },
      { from: "Nerano", to: "Sorrento", text: "Wieczór w Sorrento z widokiem na Wezuwiusz po drugiej stronie zatoki." },
      { from: "Sorrento", to: "Procida", text: "Powrót przez zatokę i zdanie jachtu." },
    ],
  },
  {
    slug: "mazury-gizycko",
    destination: "mazury",
    tab: "Mazury",
    title: "Wielkie Jeziora Mazurskie z Giżycka",
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
      { from: "Giżycko", to: "Rydzewo", text: "Przez Niegocin do spokojnej przystani na skraju jeziora Boczne." },
      { from: "Rydzewo", to: "Mikołajki", text: "Przez Jagodne i Tałty do żeglarskiej stolicy Mazur." },
      { from: "Mikołajki", to: "Wierzba", text: "Na Bełdany i nocleg w Wierzbie, na skraju Puszczy Piskiej." },
      { from: "Wierzba", to: "Ruciane-Nida", text: "Krętymi Bełdanami i przez śluzę Guzianka do Ruciane." },
      { from: "Ruciane-Nida", to: "Pranie", text: "Jezioro Nidzkie, leśna cisza i leśniczówka Gałczyńskiego." },
      { from: "Pranie", to: "Mikołajki", text: "Powrót przez Guziankę i Bełdany." },
      { from: "Mikołajki", to: "Giżycko", text: "Ostatni odcinek na północ i zdanie jachtu." },
    ],
  },
];
