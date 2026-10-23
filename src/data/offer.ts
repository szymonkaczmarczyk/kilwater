import type { Localized } from "../i18n/locales";

type Destination = { slug: string; name: string; region: string; text: string };
type CruiseType = { name: string; text: string; audience: string; included: string[] };
type CrewRole = { icon: "helm" | "cup" | "chef"; role: string; text: string };
type ExtraItem = { icon: "paddleboard" | "mask" | "dinghy" | "plane" | "basket" | "towel"; name: string; text: string };
type ProcessStep = { title: string; text: string };

export const destinationTexts: Localized<Destination[]> = {
  pl: [
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
  ],
  en: [
    {
      slug: "chorwacja",
      name: "Croatia",
      region: "Dalmatia and the Kornati",
      text: "Stone towns, marinas every few miles and coves for the night under the pines. Short passages make it a good choice for a first cruise.",
    },
    {
      slug: "grecja",
      name: "Greece",
      region: "The Cyclades and the Ionian Islands",
      text: "White cliffs, turquoise bays and the meltemi, which gives sailors real fun in the Cyclades. The Ionian Sea is calmer and greener.",
    },
    {
      slug: "wlochy",
      name: "Italy",
      region: "Amalfi Coast, Sardinia, Sicily",
      text: "A coastline that looks best from the sea, and food that is a reason to sail on its own. A good fit for a motor yacht.",
    },
    {
      slug: "mazury",
      name: "Masuria",
      region: "The Great Masurian Lakes",
      text: "A cruise with no flight and no swell. Morning mist, reeds, quiet coves and evenings at the quay. The simplest way to find out if sailing is for you.",
    },
  ],
};

export const cruiseTypeTexts: Localized<CruiseType[]> = {
  pl: [
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
  ],
  en: [
    {
      name: "Fully crewed",
      text: "The skipper sails the yacht, the host looks after the cabins and the chef after the table. You only choose tomorrow's bay and the time for a swim.",
      audience: "For families, companies and special occasions",
      included: ["Skipper, host and chef", "Route planned around the weather", "Full board on deck"],
    },
    {
      name: "With a skipper",
      text: "An experienced skipper sails the yacht and knows the local anchorages. You cook yourselves or eat in harbour tavernas, and learn as much on the water as you like.",
      audience: "For groups without a licence and first cruises",
      included: ["Skipper for the whole cruise", "Help with manoeuvres and lessons", "Route and marina bookings"],
    },
    {
      name: "Bareboat",
      text: "You take the yacht on your own licence and sail wherever you like. We check the yacht, the papers and the check-in so you simply cast off on the day.",
      audience: "For sailors with the licence required in the country",
      included: ["Checked yacht and check-in", "Papers and crew list", "Help on the water by phone"],
    },
  ],
};

export const crewRoles: Localized<CrewRole[]> = {
  pl: [
    { icon: "helm", role: "Skipper", text: "Prowadzi jacht, układa trasę pod pogodę i zna porty, w których warto stanąć na noc." },
    { icon: "cup", role: "Hostessa", text: "Dba o kabiny i pokład, żeby rano czekała kawa, a wieczorem świeże ręczniki." },
    { icon: "chef", role: "Kucharz", text: "Gotuje z lokalnych produktów kupionych w porcie, pod gusta i diety całej załogi." },
  ],
  en: [
    { icon: "helm", role: "Skipper", text: "Sails the yacht, plans the route around the weather and knows the harbours worth a night." },
    { icon: "cup", role: "Host", text: "Looks after the cabins and the deck, so coffee waits in the morning and fresh towels in the evening." },
    { icon: "chef", role: "Chef", text: "Cooks with local produce bought in port, to the tastes and diets of the whole crew." },
  ],
};

export const extraItems: Localized<ExtraItem[]> = {
  pl: [
    { icon: "paddleboard", name: "Deski SUP", text: "Na poranne wypady wzdłuż brzegu zatoki." },
    { icon: "mask", name: "Sprzęt do snorkelingu", text: "Maski, rurki i płetwy w rozmiarach całej załogi." },
    { icon: "dinghy", name: "Ponton z silnikiem", text: "Do zejścia na ląd, gdy jacht stoi na kotwicy." },
    { icon: "plane", name: "Transfer z lotniska", text: "Z hali przylotów prosto do mariny." },
    { icon: "basket", name: "Zaopatrzenie jachtu", text: "Lista zakupów rozpakowana, zanim wejdziesz na pokład." },
    { icon: "towel", name: "Pościel i ręczniki", text: "Komplet na każdą koję i sprzątanie po rejsie." },
  ],
  en: [
    { icon: "paddleboard", name: "SUP boards", text: "For morning trips along the shore of the bay." },
    { icon: "mask", name: "Snorkelling gear", text: "Masks, snorkels and fins in sizes for the whole crew." },
    { icon: "dinghy", name: "Dinghy with outboard", text: "To get ashore while the yacht is at anchor." },
    { icon: "plane", name: "Airport transfer", text: "From the arrivals hall straight to the marina." },
    { icon: "basket", name: "Provisioning", text: "Your shopping list unpacked before you step aboard." },
    { icon: "towel", name: "Bed linen and towels", text: "A set for every berth and cleaning after the cruise." },
  ],
};

export const processSteps: Localized<ProcessStep[]> = {
  pl: [
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
  ],
  en: [
    {
      title: "Tell us about the cruise",
      text: "You fill in a short form: area, dates, number of people and type of cruise. A sketch is enough, we will ask about the rest.",
    },
    {
      title: "A call with your broker",
      text: "Your broker calls back to get to know the crew and what you expect. From then on you talk to one person.",
    },
    {
      title: "Selected yachts and route",
      text: "You get a short list of checked yachts with a proposed route, crew and extras. We adjust it until everything fits.",
    },
    {
      title: "Booking and setting sail",
      text: "You sign the contract, we handle the papers, the check-in and the provisioning. You only pack a bag.",
    },
  ],
};
