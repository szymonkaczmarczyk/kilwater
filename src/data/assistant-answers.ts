import { company } from "./company";
import { faqItems } from "./faq";
import { guestLimits } from "./inquiry-options";
import { cruiseTypeTexts, crewRoles, destinationTexts, extraItems, processSteps } from "./offer";
import { sampleRoutes } from "./routes";
import { seasonMonths, seasons, type SeasonLevel } from "./seasons";

export type AssistantLink = { href: string; label: string };
type AssistantEntry = { id: string; questions: readonly string[]; answer: string; link?: AssistantLink };

const inquiryLink: AssistantLink = { href: "/#zapytanie", label: "Wyślij zapytanie do brokera" };

const joinPolish = (items: readonly string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} i ${items.at(-1)}`;

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

const seasonOf = (slug: string) => seasons.find((season) => season.destination === slug)!;

const monthsWith = (levels: readonly SeasonLevel[], wanted: SeasonLevel) =>
  joinPolish(seasonMonths.filter((_, index) => levels[index] === wanted).map((month) => month.name));

const faqEntries: AssistantEntry[] = faqItems.map((item, index) => ({
  id: `faq-${index + 1}`,
  questions: [item.question, ...item.alsoAsked],
  answer: item.answer,
}));

const destinationEntries: AssistantEntry[] = destinationTexts.map((destination) => {
  const { inName } = seasonOf(destination.slug);
  return {
    id: `akwen-${destination.slug}`,
    questions: [
      `Opowiedz o rejsie ${inName}`,
      `Czy ${destination.name} to dobry kierunek na rejs?`,
      `Jak wygląda żeglowanie ${inName}?`,
      `Co zobaczę podczas rejsu ${inName}?`,
      `Jakie miejsca odwiedzimy ${inName}?`,
      `Rejs w regionie: ${destination.region}`,
    ],
    answer: `${destination.name}, czyli ${destination.region}. ${destination.text}`,
    link: { href: `/?akwen=${destination.slug}#zapytanie`, label: `Zapytaj o rejs ${inName}` },
  };
});

const seasonQuestions: Record<string, string[]> = {
  chorwacja: ["Kiedy najlepiej płynąć do Dalmacji?", "Kiedy wieje maestral, bura albo jugo?"],
  grecja: ["Kiedy wieje meltemi?", "Jaki wiatr jest latem na Cykladach?", "Kiedy płynąć na Cyklady albo Wyspy Jońskie?"],
  wlochy: ["Kiedy płynąć na Wybrzeże Amalfi, Sardynię albo Sycylię?", "Czy w sierpniu we Włoszech jest tłoczno?"],
  mazury: ["Kiedy najlepiej płynąć na Wielkie Jeziora Mazurskie?", "Czy na Mazurach latem są burze?"],
};

const seasonEntries: AssistantEntry[] = seasons.map((season) => ({
  id: `sezon-${season.destination}`,
  questions: [
    ...seasonQuestions[season.destination],
    `Kiedy najlepiej płynąć ${season.inName}?`,
    `Jaki miesiąc wybrać na rejs ${season.inName}?`,
    `Kiedy jest sezon ${season.inName}?`,
    `Jaka jest temperatura wody ${season.inName}?`,
    `Jak wieje wiatr ${season.inName}?`,
    `Czy we wrześniu warto płynąć ${season.inName}?`,
  ],
  answer: `Najlepszy czas ${season.inName} to ${monthsWith(season.levels, "best")}, a szczyt sezonu przypada na ${monthsWith(season.levels, "peak")}. ${season.wind} ${season.water}`,
  link: { href: "/#kiedy-plynac", label: "Zobacz kalendarz sezonu" },
}));

const routeEntries: AssistantEntry[] = sampleRoutes.map((route) => {
  const { inName } = seasonOf(route.destination);
  const ports = [...route.legs.map((leg) => leg.from), route.legs.at(-1)!.to];
  const uniquePorts = [...new Set(ports)];
  const region = destinationTexts.find((destination) => destination.slug === route.destination)!.region;
  return {
    id: `trasa-${route.slug}`,
    questions: [
      `Jak wygląda przykładowa trasa ${inName}?`,
      `Jaką trasę polecacie ${inName}?`,
      `Plan rejsu ${inName} dzień po dniu`,
      `Gdzie popłyniemy w tydzień ${inName}?`,
      `Pokażcie mapę trasy ${inName}`,
      `Trasa po portach: ${uniquePorts.join(", ")}`,
      `Przykładowy tydzień w regionie ${region}`,
      route.title,
    ],
    answer: `Przykładowa pętla „${route.title}” trwa ${route.nights} nocy: ${ports.join(" → ")}. Trasę dopasowujemy do pogody, tempa i życzeń załogi.`,
    link: { href: "/#trasy", label: "Zobacz trasę na mapie" },
  };
});

const cruiseTypeQuestions: Record<string, string[]> = {
  "Z pełną załogą": [
    "Na czym polega rejs z pełną załogą?",
    "Czy na jachcie może być kucharz i hostessa?",
    "Chcę rejs, na którym niczym się nie zajmuję",
    "Rejs z pełną obsługą i wyżywieniem",
  ],
  "Ze skipperem": [
    "Co to jest rejs ze skipperem?",
    "Nie mam patentu, czy możecie dać skippera?",
    "Czy skipper nauczy nas żeglować?",
    "Wynajem jachtu z kapitanem",
  ],
  "Bez załogi": [
    "Czy mogę wynająć jacht bez załogi?",
    "Czarter bareboat, sam prowadzę jacht",
    "Mam patent i chcemy płynąć sami",
  ],
};

const cruiseTypeEntries: AssistantEntry[] = cruiseTypeTexts.map((cruiseType, index) => ({
  id: `rejs-${index + 1}`,
  questions: cruiseTypeQuestions[cruiseType.name],
  answer: `${cruiseType.name}: ${cruiseType.audience.toLowerCase()}. ${cruiseType.text} W pakiecie: ${cruiseType.included.join(", ").toLowerCase()}.`,
  link: { href: "/#rejsy", label: "Zobacz rodzaje rejsów" },
}));

const [fullCrew, withSkipper, bareboat] = cruiseTypeTexts;

const manualEntries: AssistantEntry[] = [
  {
    id: "kilwater",
    questions: ["Czym jest Kilwater?", "Czym się zajmujecie?", "Kim jesteście?", "Czy jesteście armatorem czy pośrednikiem?"],
    answer: `Kilwater to polski broker czarteru jachtów. Dobieramy jacht, załogę i dodatki ${joinPolish(seasons.map((season) => season.inName))}, a od pierwszej wiadomości do końca rejsu rozmawiasz z jednym brokerem.`,
  },
  {
    id: "akweny",
    questions: [
      "Gdzie można popłynąć?",
      "Gdzie pływacie?",
      "Jakie akweny obsługujecie?",
      "Gdzie najlepiej na pierwszy rejs?",
      "Czy pływacie po Bałtyku albo Karaibach?",
      "Jakie kraje są w ofercie?",
    ],
    answer: `Pływamy w czterech miejscach: ${joinPolish(destinationTexts.map((destination) => `${destination.name} (${destination.region})`))}. Na pierwszy rejs dobrze sprawdza się Chorwacja z krótkimi przelotami albo Mazury bez fali.`,
    link: { href: "/#akweny", label: "Zobacz akweny" },
  },
  {
    id: "rodzaje-rejsow",
    questions: [
      "Jakie rodzaje rejsów oferujecie?",
      "Czym różni się rejs ze skipperem od rejsu z pełną załogą?",
      "Jaki rejs wybrać na pierwszy raz?",
      "Jakie macie opcje czarteru?",
    ],
    answer: `${fullCrew.name}: ${fullCrew.included.join(", ").toLowerCase()}. ${withSkipper.name}: skipper prowadzi jacht, a gotujecie sami albo jecie w tawernach. ${bareboat.name}: płyniesz na własnych uprawnieniach. Na pierwszy rejs bez patentu polecamy rejs ze skipperem.`,
    link: { href: "/#rejsy", label: "Zobacz rodzaje rejsów" },
  },
  {
    id: "jachty",
    questions: [
      "Jakie jachty macie?",
      "Czy macie katamarany?",
      "Czy można wynająć jacht motorowy?",
      "Jacht żaglowy czy katamaran?",
      "Jaki jacht wybrać?",
    ],
    answer:
      "Dobieramy jachty żaglowe, katamarany i jachty motorowe. Katamaran mniej się kołysze, a jacht motorowy dobrze sprawdza się na Wybrzeżu Amalfi. Konkretne jachty broker pokazuje w ofercie przygotowanej pod Twoją załogę.",
    link: inquiryLink,
  },
  {
    id: "w-trakcie-rejsu",
    questions: [
      "Z kim się kontaktować w trakcie rejsu?",
      "Co jeśli coś pójdzie nie tak podczas rejsu?",
      "Co jeśli się spóźnię na odbiór jachtu?",
      "Czy można zmienić coś w trakcie rejsu?",
    ],
    answer:
      "Każdą sprawę przed wypłynięciem i w trakcie rejsu zgłaszasz swojemu brokerowi. Rozmawiasz z nim od pierwszej wiadomości do ostatniego dnia rejsu, a on ustala szczegóły z armatorem i skipperem.",
    link: { href: `mailto:${company.email}`, label: `Napisz na ${company.email}` },
  },
  {
    id: "zasady-na-pokladzie",
    questions: [
      "Czy mogę palić na pokładzie?",
      "Czy można łowić ryby z jachtu?",
      "Czy wolno pić alkohol na jachcie?",
      "Czy można głośno puszczać muzykę wieczorem?",
      "Jakie są zasady na pokładzie?",
    ],
    answer:
      "Zasady na pokładzie, np. palenie, łowienie ryb czy cisza nocna w porcie, ustala armator i skipper, a na wodzie decyduje skipper. Napisz w zapytaniu, na czym Ci zależy, a broker sprawdzi to przed rezerwacją.",
    link: inquiryLink,
  },
  {
    id: "wyposazenie",
    questions: [
      "Czy jacht ma klimatyzację?",
      "Czy na jachcie jest wifi?",
      "Czy będzie dostęp do internetu na łodzi?",
      "Ile kabin i łazienek ma jacht?",
      "Czy na jachcie jest prysznic i ciepła woda?",
      "Jakie wyposażenie ma jacht?",
    ],
    answer:
      "Wyposażenie zależy od konkretnego jachtu: liczba kabin i łazienek, klimatyzacja, internet czy generator. Napisz w zapytaniu, co jest dla Ciebie ważne, a broker pokaże w ofercie tylko jachty, które to mają.",
    link: inquiryLink,
  },
  {
    id: "zaloga",
    questions: [
      "Kto jest w załodze jachtu?",
      "Co robi hostessa na jachcie?",
      "Czy na jachcie jest kucharz?",
      "Czy kucharz ugotuje dania wegetariańskie?",
      "Czy ktoś będzie dla nas gotował?",
      "Kto sprząta kabiny na jachcie?",
      "Co robi skipper?",
    ],
    answer: crewRoles.map((member) => `${member.role}: ${lowerFirst(member.text)}`).join(" "),
    link: { href: "/#zaloga", label: "Zobacz załogę i dodatki" },
  },
  {
    id: "dodatki",
    questions: [
      "Jakie dodatki można zamówić?",
      "Czy mogę wypożyczyć deskę SUP?",
      "Czy jest sprzęt do snorkelingu?",
      "Czy zorganizujecie transfer z lotniska?",
      "Czy jacht ma ponton?",
      "Czy zrobicie zakupy przed rejsem?",
    ],
    answer: `Na pokład możesz zamówić: ${extraItems.map((extra) => lowerFirst(extra.name)).join(", ")}. Zaznacz je w formularzu zapytania, a broker doda je do oferty.`,
    link: inquiryLink,
  },
  {
    id: "rezerwacja",
    questions: [
      "Jak zarezerwować jacht?",
      "Jak wygląda współpraca z brokerem?",
      "Co się dzieje po wysłaniu zapytania?",
      "Kiedy podpisuję umowę?",
      "Jak przebiega rezerwacja rejsu?",
    ],
    answer: processSteps.map((step, index) => `${index + 1}. ${step.title}: ${step.text}`).join(" "),
    link: { href: "/#jak-to-dziala", label: "Zobacz, jak to działa" },
  },
  {
    id: "zapytanie",
    questions: [
      "Czy wysłanie zapytania coś kosztuje?",
      "Czy zapytanie jest rezerwacją?",
      "Jak wysłać zapytanie?",
      "Czy zapytanie mnie do czegoś zobowiązuje?",
    ],
    answer:
      "Zapytanie nic nie kosztuje i nie jest rezerwacją. Wypełniasz krótki formularz z akwenem, terminem, liczbą osób i rodzajem rejsu, a broker odzywa się z propozycją. Rezerwacja następuje dopiero po podpisaniu umowy.",
    link: inquiryLink,
  },
  {
    id: "cena",
    questions: [
      "Ile kosztuje czarter jachtu?",
      "Jaka jest cena tygodnia na katamaranie?",
      "Ile kosztuje rejs z załogą?",
      "Macie cennik?",
      "Czy są rabaty dla grup?",
      "Ile zapłacę za jacht w lipcu?",
    ],
    answer:
      "Cena zależy od jachtu, akwenu, terminu, długości rejsu i załogi, dlatego podajemy ją w ofercie przygotowanej pod Twój plan. Wyślij zapytanie, a broker odpowie z propozycjami jachtów i ceną.",
    link: inquiryLink,
  },
  {
    id: "dostepnosc",
    questions: [
      "Czy macie wolny jacht w lipcu?",
      "Czy termin w sierpniu jest dostępny?",
      "Sprawdźcie dostępność jachtu",
      "Czy są jeszcze wolne jachty na wakacje?",
    ],
    answer:
      "Dostępność jachtów zmienia się z dnia na dzień, dlatego sprawdza ją broker przy przygotowaniu oferty. Wyślij zapytanie z terminem i liczbą osób.",
    link: inquiryLink,
  },
  {
    id: "liczba-osob",
    questions: [
      "Ile osób zmieści się na jachcie?",
      "Czy 8 osób zmieści się na jednym jachcie?",
      "Jaka jest maksymalna liczba osób na pokładzie?",
      "Płyniemy dużą grupą, co wtedy?",
    ],
    answer: `W zapytaniu możesz zgłosić od ${guestLimits.min} do ${guestLimits.max} osób na jeden jacht. Liczbę kabin i koi broker dobiera do Twojej załogi. Przy większej grupie napisz o tym w zapytaniu.`,
    link: inquiryLink,
  },
  {
    id: "kontakt",
    questions: [
      "Jak się z wami skontaktować?",
      "Podajcie numer telefonu",
      "Jaki jest wasz adres e-mail?",
      "Gdzie jest wasze biuro?",
      "Dane firmy Kilwater",
    ],
    answer: `Napisz na ${company.email} albo zadzwoń pod ${company.phone}. ${company.name}, ${company.street}, ${company.postalCity}.`,
    link: { href: `mailto:${company.email}`, label: `Napisz na ${company.email}` },
  },
];

export const assistantEntries: AssistantEntry[] = [
  ...faqEntries,
  ...manualEntries,
  ...cruiseTypeEntries,
  ...destinationEntries,
  ...seasonEntries,
  ...routeEntries,
];

export const assistantFallback = {
  unknown: `Nie znam odpowiedzi na to pytanie. Napisz do nas na ${company.email}, a broker odpowie osobiście.`,
  unsure: `Nie mam pewnej odpowiedzi. Sprawdź podobne pytania poniżej albo napisz na ${company.email}.`,
  link: "Nie otwieram linków. Opisz pytanie własnymi słowami.",
  contact: "Nie wpisuj tu danych kontaktowych. Jeśli broker ma się do Ciebie odezwać, wyślij formularz zapytania niżej na stronie.",
};
