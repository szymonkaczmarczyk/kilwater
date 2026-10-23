export const destinationTexts = [
  {
    slug: "chorwacja",
    name: "Chorwacja",
    region: "Dalmacja i Kornati",
    text: "Kamienne miasteczka, mariny co kilka mil i zatoki na noc pod sosnami. Krótkie przeloty sprawiają, że to dobry wybór na pierwszy rejs.",
  },
  {
    slug: "grecja",
    name: "Grecja",
    region: "Cyklady i Wyspy Jońskie",
    text: "Białe klify, turkusowe zatoki i meltemi, który na Cykladach daje żeglarzom prawdziwą frajdę. Na Morzu Jońskim spokojniej i bardziej zielono.",
  },
  {
    slug: "wlochy",
    name: "Włochy",
    region: "Wybrzeże Amalfi, Sardynia, Sycylia",
    text: "Wybrzeże, które najlepiej wygląda od strony morza, i kuchnia, która sama w sobie jest powodem rejsu. Dobre na jacht motorowy.",
  },
  {
    slug: "mazury",
    name: "Mazury",
    region: "Wielkie Jeziora Mazurskie",
    text: "Rejs bez lotu i bez fali. Mgła o świcie, trzciny, ciche zatoki i wieczory przy kei. Najprostszy sposób, żeby sprawdzić, czy żagle są dla Ciebie.",
  },
] as const;

export const cruiseTypeTexts = [
  {
    name: "Z pełną załogą",
    text: "Skipper prowadzi jacht, hostessa dba o kabiny, kucharz o stół. Ty wybierasz tylko zatokę na kolejny dzień i godzinę kąpieli.",
    audience: "Dla rodzin, firm i wyjazdów z okazji",
    included: ["Skipper, hostessa i kucharz", "Trasa ułożona pod pogodę", "Pełne wyżywienie na pokładzie"],
  },
  {
    name: "Ze skipperem",
    text: "Doświadczony skipper prowadzi jacht i zna lokalne kotwicowiska. Gotujecie sami albo jecie w portowych tawernach, a na wodzie uczycie się tyle, ile chcecie.",
    audience: "Dla grup bez patentu i na pierwszy rejs",
    included: ["Skipper na cały rejs", "Pomoc przy manewrach i nauka", "Trasa i rezerwacje miejsc w marinach"],
  },
  {
    name: "Bez załogi",
    text: "Bierzesz jacht na własne uprawnienia i płyniesz, gdzie chcesz. My sprawdzamy jacht, dokumenty i odprawę, żebyś w dniu odbioru po prostu wypłynął.",
    audience: "Dla żeglarzy z uprawnieniami wymaganymi w danym kraju",
    included: ["Sprawdzony jacht i odprawa", "Dokumenty i lista załogi", "Pomoc na wodzie przez telefon"],
  },
] as const;

export const crewRoles = [
  { icon: "helm", role: "Skipper", text: "Prowadzi jacht, układa trasę pod pogodę i zna porty, w których warto stanąć na noc." },
  { icon: "cup", role: "Hostessa", text: "Dba o kabiny i pokład, żeby rano czekała kawa, a wieczorem świeże ręczniki." },
  { icon: "chef", role: "Kucharz", text: "Gotuje z lokalnych produktów kupionych w porcie, pod gusta i diety całej załogi." },
] as const;

export const extraItems = [
  { icon: "paddleboard", name: "Deski SUP", text: "Na poranne wypady wzdłuż brzegu zatoki." },
  { icon: "mask", name: "Sprzęt do snorkelingu", text: "Maski, rurki i płetwy w rozmiarach całej załogi." },
  { icon: "dinghy", name: "Ponton z silnikiem", text: "Do zejścia na ląd, gdy jacht stoi na kotwicy." },
  { icon: "plane", name: "Transfer z lotniska", text: "Z hali przylotów prosto do mariny." },
  { icon: "basket", name: "Zaopatrzenie jachtu", text: "Lista zakupów rozpakowana, zanim wejdziesz na pokład." },
  { icon: "towel", name: "Pościel i ręczniki", text: "Komplet na każdą koję i sprzątanie po rejsie." },
] as const;

export const processSteps = [
  {
    title: "Opowiedz o rejsie",
    text: "Wypełniasz krótki formularz: akwen, termin, liczba osób i rodzaj rejsu. Wystarczy szkic, resztę dopytamy.",
  },
  {
    title: "Rozmowa z brokerem",
    text: "Twój broker oddzwania, poznaje załogę i oczekiwania. Od tej chwili rozmawiasz z jedną osobą.",
  },
  {
    title: "Wybrane jachty i trasa",
    text: "Dostajesz krótką listę sprawdzonych jachtów z propozycją trasy, załogi i dodatków. Zmieniamy, aż wszystko pasuje.",
  },
  {
    title: "Rezerwacja i wypłynięcie",
    text: "Podpisujesz umowę, my zajmujemy się dokumentami, odprawą i zaopatrzeniem. Ty pakujesz tylko torbę.",
  },
] as const;
