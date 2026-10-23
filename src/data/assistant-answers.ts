import { company } from "./company";
import { faqItems } from "./faq";
import { guestLimits } from "./inquiry-options";
import { cruiseTypeTexts, crewRoles, destinationTexts, extraItems, processSteps } from "./offer";
import { sampleRoutes } from "./routes";
import { seasonMonths, seasons, type SeasonLevel } from "./seasons";
import { locales, sectionHref, type Locale, type Localized } from "../i18n/locales";

export type AssistantLink = { href: string; label: string };
type AssistantEntry = { id: string; questions: readonly string[]; answer: string; link?: AssistantLink };
type ManualEntry = {
  id: string;
  questions: Localized<string[]>;
  answer: Localized<string>;
  link?: (locale: Locale) => AssistantLink;
};

const joinList = (items: readonly string[], locale: Locale) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} ${locale === "pl" ? "i" : "and"} ${items.at(-1)}`;

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

const seasonOf = (slug: string) => seasons.find((season) => season.destination === slug)!;

const monthsWith = (levels: readonly SeasonLevel[], wanted: SeasonLevel, locale: Locale) =>
  joinList(
    seasonMonths.filter((_, index) => levels[index] === wanted).map((month) => month.name[locale]),
    locale,
  );

const linkLabels = {
  inquiry: { pl: "Wyślij zapytanie do brokera", en: "Send an enquiry to a broker" },
  season: { pl: "Zobacz kalendarz sezonu", en: "See the season calendar" },
  route: { pl: "Zobacz trasę na mapie", en: "See the route on the map" },
  cruises: { pl: "Zobacz rodzaje rejsów", en: "See the cruise types" },
  areas: { pl: "Zobacz akweny", en: "See the sailing areas" },
  crew: { pl: "Zobacz załogę i dodatki", en: "See the crew and extras" },
  process: { pl: "Zobacz, jak to działa", en: "See how it works" },
  mail: { pl: `Napisz na ${company.email}`, en: `Write to ${company.email}` },
  askArea: { pl: (inName: string) => `Zapytaj o rejs ${inName}`, en: (inName: string) => `Ask about a cruise ${inName}` },
};

const inquiryLink = (locale: Locale): AssistantLink => ({ href: sectionHref(locale, "zapytanie"), label: linkLabels.inquiry[locale] });
const mailLink = (locale: Locale): AssistantLink => ({ href: `mailto:${company.email}`, label: linkLabels.mail[locale] });

const templates = {
  pl: {
    area: (name: string, inName: string, region: string) => [
      `Opowiedz o rejsie ${inName}`,
      `Czy ${name} to dobry kierunek na rejs?`,
      `Jak wygląda żeglowanie ${inName}?`,
      `Co zobaczę podczas rejsu ${inName}?`,
      `Jakie miejsca odwiedzimy ${inName}?`,
      `Rejs w regionie: ${region}`,
    ],
    areaAnswer: (name: string, region: string, text: string) => `${name}, czyli ${region}. ${text}`,
    season: (inName: string) => [
      `Kiedy najlepiej płynąć ${inName}?`,
      `Jaki miesiąc wybrać na rejs ${inName}?`,
      `Kiedy jest sezon ${inName}?`,
      `Jaka jest temperatura wody ${inName}?`,
      `Jak wieje wiatr ${inName}?`,
      `Czy we wrześniu warto płynąć ${inName}?`,
    ],
    seasonAnswer: (inName: string, best: string, peak: string, wind: string, water: string) =>
      `Najlepszy czas ${inName} to ${best}, a szczyt sezonu przypada na ${peak}. ${wind} ${water}`,
    route: (inName: string, ports: string, region: string) => [
      `Jak wygląda przykładowa trasa ${inName}?`,
      `Jaką trasę polecacie ${inName}?`,
      `Plan rejsu ${inName} dzień po dniu`,
      `Gdzie popłyniemy w tydzień ${inName}?`,
      `Pokażcie mapę trasy ${inName}`,
      `Trasa po portach: ${ports}`,
      `Przykładowy tydzień w regionie ${region}`,
    ],
    routeAnswer: (title: string, nights: number, ports: string) =>
      `Przykładowa pętla „${title}” trwa ${nights} nocy: ${ports}. Trasę dopasowujemy do pogody, tempa i życzeń załogi.`,
    cruiseAnswer: (name: string, audience: string, text: string, included: string) =>
      `${name}: ${lowerFirst(audience)}. ${text} W pakiecie: ${included}.`,
    crewAnswer: (role: string, text: string) => `${role}: ${lowerFirst(text)}`,
    extrasAnswer: (list: string) => `Na pokład możesz zamówić: ${list}. Zaznacz je w formularzu zapytania, a broker doda je do oferty.`,
    aboutAnswer: (areas: string) =>
      `Kilwater to polski broker czarteru jachtów. Dobieramy jacht, załogę i dodatki ${areas}, a od pierwszej wiadomości do końca rejsu rozmawiasz z jednym brokerem.`,
    areasAnswer: (list: string) =>
      `Pływamy w czterech miejscach: ${list}. Na pierwszy rejs dobrze sprawdza się Chorwacja z krótkimi przelotami albo Mazury bez fali.`,
    cruiseTypesAnswer: (full: string, included: string, skipper: string, bareboat: string) =>
      `${full}: ${included}. ${skipper}: skipper prowadzi jacht, a gotujecie sami albo jecie w tawernach. ${bareboat}: płyniesz na własnych uprawnieniach. Na pierwszy rejs bez patentu polecamy rejs ze skipperem.`,
    guestsAnswer: `W zapytaniu możesz zgłosić od ${guestLimits.min} do ${guestLimits.max} osób na jeden jacht. Liczbę kabin i koi broker dobiera do Twojej załogi. Przy większej grupie napisz o tym w zapytaniu.`,
    contactAnswer: `Napisz na ${company.email} albo zadzwoń pod ${company.phone}. ${company.name}, ${company.street}, ${company.postalCity}.`,
  },
  en: {
    area: (name: string, inName: string, region: string) => [
      `Tell me about sailing ${inName}`,
      `Is ${name} a good destination for a cruise?`,
      `What is sailing like ${inName}?`,
      `What will I see on a cruise ${inName}?`,
      `Which places will we visit ${inName}?`,
      `A cruise in ${region}`,
    ],
    areaAnswer: (name: string, region: string, text: string) => `${name}: ${region}. ${text}`,
    season: (inName: string) => [
      `When is the best time to sail ${inName}?`,
      `Which month should I choose for a cruise ${inName}?`,
      `When is the season ${inName}?`,
      `How warm is the water ${inName}?`,
      `What is the wind like ${inName}?`,
      `Is September a good time to sail ${inName}?`,
    ],
    seasonAnswer: (inName: string, best: string, peak: string, wind: string, water: string) =>
      `The best time ${inName} is ${best}, and the peak season falls in ${peak}. ${wind} ${water}`,
    route: (inName: string, ports: string, region: string) => [
      `What does a sample route ${inName} look like?`,
      `Which route do you recommend ${inName}?`,
      `A day by day cruise plan ${inName}`,
      `Where will we sail in a week ${inName}?`,
      `Show me the route map ${inName}`,
      `A route via the ports: ${ports}`,
      `A sample week in ${region}`,
    ],
    routeAnswer: (title: string, nights: number, ports: string) =>
      `The sample loop “${title}” takes ${nights} nights: ${ports}. We adapt the route to the weather, your pace and the crew's wishes.`,
    cruiseAnswer: (name: string, audience: string, text: string, included: string) =>
      `${name}: ${lowerFirst(audience)}. ${text} Included: ${included}.`,
    crewAnswer: (role: string, text: string) => `${role}: ${lowerFirst(text)}`,
    extrasAnswer: (list: string) => `You can order for the deck: ${list}. Tick them in the enquiry form and your broker will add them to the offer.`,
    aboutAnswer: (areas: string) =>
      `Kilwater is a Polish yacht charter broker. We find the yacht, crew and extras ${areas}, and from the first message to the end of the cruise you talk to one broker.`,
    areasAnswer: (list: string) =>
      `We sail in four places: ${list}. For a first cruise Croatia with its short passages or Masuria with no swell work well.`,
    cruiseTypesAnswer: (full: string, included: string, skipper: string, bareboat: string) =>
      `${full}: ${included}. ${skipper}: the skipper sails the yacht, and you cook yourselves or eat in tavernas. ${bareboat}: you sail on your own licence. For a first cruise without a licence we recommend a skippered cruise.`,
    guestsAnswer: `In the enquiry you can request ${guestLimits.min} to ${guestLimits.max} people per yacht. Your broker matches the cabins and berths to your crew. For a larger group, mention it in the enquiry.`,
    contactAnswer: `Write to ${company.email} or call ${company.phone}. ${company.name}, ${company.street}, ${company.postalCity}, Poland.`,
  },
} satisfies Localized<Record<string, unknown>>;

const seasonQuestions: Localized<Record<string, string[]>> = {
  pl: {
    chorwacja: ["Kiedy najlepiej płynąć do Dalmacji?", "Kiedy wieje maestral, bura albo jugo?"],
    grecja: ["Kiedy wieje meltemi?", "Jaki wiatr jest latem na Cykladach?", "Kiedy płynąć na Cyklady albo Wyspy Jońskie?"],
    wlochy: ["Kiedy płynąć na Wybrzeże Amalfi, Sardynię albo Sycylię?", "Czy w sierpniu we Włoszech jest tłoczno?"],
    mazury: ["Kiedy najlepiej płynąć na Wielkie Jeziora Mazurskie?", "Czy na Mazurach latem są burze?"],
  },
  en: {
    chorwacja: ["When is the best time to sail in Dalmatia?", "When do the maestral, bora or jugo blow?"],
    grecja: ["When does the meltemi blow?", "What is the summer wind like in the Cyclades?", "When to sail the Cyclades or the Ionian Islands?"],
    wlochy: ["When to sail the Amalfi Coast, Sardinia or Sicily?", "Is Italy crowded in August?"],
    mazury: ["When is the best time to sail the Great Masurian Lakes?", "Are there thunderstorms in Masuria in summer?"],
  },
};

const cruiseTypeQuestions: Localized<string[][]> = {
  pl: [
    ["Na czym polega rejs z pełną załogą?", "Czy na jachcie może być kucharz i hostessa?", "Chcę rejs, na którym niczym się nie zajmuję", "Rejs z pełną obsługą i wyżywieniem"],
    ["Co to jest rejs ze skipperem?", "Nie mam patentu, czy możecie dać skippera?", "Czy skipper nauczy nas żeglować?", "Wynajem jachtu z kapitanem"],
    ["Czy mogę wynająć jacht bez załogi?", "Czarter bareboat, sam prowadzę jacht", "Mam patent i chcemy płynąć sami"],
  ],
  en: [
    ["What is a fully crewed cruise?", "Can there be a chef and a host on board?", "I want a cruise where I do not have to do anything", "A cruise with full service and meals"],
    ["What is a skippered cruise?", "I have no licence, can you provide a skipper?", "Will the skipper teach us to sail?", "Yacht charter with a captain"],
    ["Can I charter a yacht without crew?", "Bareboat charter, I sail the yacht myself", "I have a licence and we want to sail on our own"],
  ],
};

const manualEntries: ManualEntry[] = [
  {
    id: "rodzaje-rejsow",
    questions: {
      pl: ["Jakie rodzaje rejsów oferujecie?", "Czym różni się rejs ze skipperem od rejsu z pełną załogą?", "Jaki rejs wybrać na pierwszy raz?", "Jakie macie opcje czarteru?"],
      en: ["What types of cruise do you offer?", "What is the difference between a skippered and a fully crewed cruise?", "Which cruise should I choose for the first time?", "What charter options do you have?"],
    },
    answer: Object.fromEntries(
      locales.map((locale) => {
        const [full, skipper, bareboat] = cruiseTypeTexts[locale];
        return [locale, templates[locale].cruiseTypesAnswer(full.name, full.included.join(", ").toLowerCase(), skipper.name, bareboat.name)];
      }),
    ) as Localized<string>,
    link: (locale) => ({ href: sectionHref(locale, "rejsy"), label: linkLabels.cruises[locale] }),
  },
  {
    id: "jachty",
    questions: {
      pl: ["Jakie jachty macie?", "Czy macie katamarany?", "Czy można wynająć jacht motorowy?", "Jacht żaglowy czy katamaran?", "Jaki jacht wybrać?"],
      en: ["Which yachts do you have?", "Do you have catamarans?", "Can I charter a motor yacht?", "Sailing yacht or catamaran?", "Which yacht should I choose?"],
    },
    answer: {
      pl: "Dobieramy jachty żaglowe, katamarany i jachty motorowe. Katamaran mniej się kołysze, a jacht motorowy dobrze sprawdza się na Wybrzeżu Amalfi. Konkretne jachty broker pokazuje w ofercie przygotowanej pod Twoją załogę.",
      en: "We find sailing yachts, catamarans and motor yachts. A catamaran rocks less, and a motor yacht works well on the Amalfi Coast. Your broker shows specific yachts in an offer prepared for your crew.",
    },
    link: inquiryLink,
  },
  {
    id: "w-trakcie-rejsu",
    questions: {
      pl: ["Z kim się kontaktować w trakcie rejsu?", "Co jeśli coś pójdzie nie tak podczas rejsu?", "Co jeśli się spóźnię na odbiór jachtu?", "Czy można zmienić coś w trakcie rejsu?"],
      en: ["Who do I contact during the cruise?", "What if something goes wrong during the cruise?", "What if I am late for check-in?", "Can we change something during the cruise?"],
    },
    answer: {
      pl: "Każdą sprawę przed wypłynięciem i w trakcie rejsu zgłaszasz swojemu brokerowi. Rozmawiasz z nim od pierwszej wiadomości do ostatniego dnia rejsu, a on ustala szczegóły z armatorem i skipperem.",
      en: "You raise any matter before departure and during the cruise with your broker. You talk to them from the first message to the last day of the cruise, and they settle the details with the owner and the skipper.",
    },
    link: mailLink,
  },
  {
    id: "zasady-na-pokladzie",
    questions: {
      pl: ["Czy mogę palić na pokładzie?", "Czy można łowić ryby z jachtu?", "Czy wolno pić alkohol na jachcie?", "Czy można głośno puszczać muzykę wieczorem?", "Jakie są zasady na pokładzie?"],
      en: ["Can I smoke on board?", "Can we fish from the yacht?", "Is alcohol allowed on the yacht?", "Can we play loud music in the evening?", "What are the rules on board?"],
    },
    answer: {
      pl: "Zasady na pokładzie, np. palenie, łowienie ryb czy cisza nocna w porcie, ustala armator i skipper, a na wodzie decyduje skipper. Napisz w zapytaniu, na czym Ci zależy, a broker sprawdzi to przed rezerwacją.",
      en: "Rules on board, such as smoking, fishing or quiet hours in port, are set by the owner and the skipper, and on the water the skipper decides. Mention what matters to you in the enquiry and your broker will check it before booking.",
    },
    link: inquiryLink,
  },
  {
    id: "wyposazenie",
    questions: {
      pl: ["Czy jacht ma klimatyzację?", "Czy na jachcie jest wifi?", "Czy będzie dostęp do internetu na łodzi?", "Ile kabin i łazienek ma jacht?", "Czy na jachcie jest prysznic i ciepła woda?", "Jakie wyposażenie ma jacht?"],
      en: ["Does the yacht have air conditioning?", "Is there wifi on the yacht?", "Will we have internet on the boat?", "How many cabins and bathrooms does the yacht have?", "Is there a shower and hot water on board?", "What equipment does the yacht have?"],
    },
    answer: {
      pl: "Wyposażenie zależy od konkretnego jachtu: liczba kabin i łazienek, klimatyzacja, internet czy generator. Napisz w zapytaniu, co jest dla Ciebie ważne, a broker pokaże w ofercie tylko jachty, które to mają.",
      en: "Equipment depends on the specific yacht: the number of cabins and bathrooms, air conditioning, internet or a generator. Tell us in the enquiry what matters to you and your broker will only show yachts that have it.",
    },
    link: inquiryLink,
  },
  {
    id: "zaloga",
    questions: {
      pl: ["Kto jest w załodze jachtu?", "Co robi hostessa na jachcie?", "Czy na jachcie jest kucharz?", "Czy kucharz ugotuje dania wegetariańskie?", "Czy ktoś będzie dla nas gotował?", "Kto sprząta kabiny na jachcie?", "Co robi skipper?"],
      en: ["Who is in the yacht's crew?", "What does a host do on a yacht?", "Is there a chef on the yacht?", "Can the chef cook vegetarian meals?", "Will someone cook for us?", "Who cleans the cabins?", "What does the skipper do?"],
    },
    answer: Object.fromEntries(
      locales.map((locale) => [locale, crewRoles[locale].map((member) => templates[locale].crewAnswer(member.role, member.text)).join(" ")]),
    ) as Localized<string>,
    link: (locale) => ({ href: sectionHref(locale, "zaloga"), label: linkLabels.crew[locale] }),
  },
  {
    id: "dodatki",
    questions: {
      pl: ["Jakie dodatki można zamówić?", "Czy mogę wypożyczyć deskę SUP?", "Czy jest sprzęt do snorkelingu?", "Czy zorganizujecie transfer z lotniska?", "Czy jacht ma ponton?", "Czy zrobicie zakupy przed rejsem?"],
      en: ["What extras can I order?", "Can I rent a SUP board?", "Is there snorkelling gear?", "Can you arrange an airport transfer?", "Does the yacht have a dinghy?", "Can you do the shopping before the cruise?"],
    },
    answer: Object.fromEntries(
      locales.map((locale) => [locale, templates[locale].extrasAnswer(extraItems[locale].map((extra) => lowerFirst(extra.name)).join(", "))]),
    ) as Localized<string>,
    link: inquiryLink,
  },
  {
    id: "rezerwacja",
    questions: {
      pl: ["Jak zarezerwować jacht?", "Jak wygląda współpraca z brokerem?", "Co się dzieje po wysłaniu zapytania?", "Kiedy podpisuję umowę?", "Jak przebiega rezerwacja rejsu?"],
      en: ["How do I book a yacht?", "How does working with a broker look?", "What happens after I send an enquiry?", "When do I sign the contract?", "How does booking a cruise work?"],
    },
    answer: Object.fromEntries(
      locales.map((locale) => [locale, processSteps[locale].map((step, index) => `${index + 1}. ${step.title}: ${step.text}`).join(" ")]),
    ) as Localized<string>,
    link: (locale) => ({ href: sectionHref(locale, "jak-to-dziala"), label: linkLabels.process[locale] }),
  },
  {
    id: "zapytanie",
    questions: {
      pl: ["Czy wysłanie zapytania coś kosztuje?", "Czy zapytanie jest rezerwacją?", "Jak wysłać zapytanie?", "Czy zapytanie mnie do czegoś zobowiązuje?"],
      en: ["Does sending an enquiry cost anything?", "Is an enquiry a booking?", "How do I send an enquiry?", "Does an enquiry commit me to anything?"],
    },
    answer: {
      pl: "Zapytanie nic nie kosztuje i nie jest rezerwacją. Wypełniasz krótki formularz z akwenem, terminem, liczbą osób i rodzajem rejsu, a broker odzywa się z propozycją. Rezerwacja następuje dopiero po podpisaniu umowy.",
      en: "An enquiry costs nothing and is not a booking. You fill in a short form with the area, dates, number of people and type of cruise, and your broker replies with a proposal. The booking only happens once the contract is signed.",
    },
    link: inquiryLink,
  },
  {
    id: "cena",
    questions: {
      pl: ["Ile kosztuje czarter jachtu?", "Jaka jest cena tygodnia na katamaranie?", "Ile kosztuje rejs z załogą?", "Macie cennik?", "Czy są rabaty dla grup?", "Ile zapłacę za jacht w lipcu?"],
      en: ["How much does a yacht charter cost?", "What is the price of a week on a catamaran?", "How much is a crewed cruise?", "Do you have a price list?", "Are there group discounts?", "How much will a yacht cost in July?"],
    },
    answer: {
      pl: "Cena zależy od jachtu, akwenu, terminu, długości rejsu i załogi, dlatego podajemy ją w ofercie przygotowanej pod Twój plan. Wyślij zapytanie, a broker odpowie z propozycjami jachtów i ceną.",
      en: "The price depends on the yacht, area, dates, length of the cruise and crew, so we give it in an offer prepared for your plan. Send an enquiry and your broker will reply with yachts and a price.",
    },
    link: inquiryLink,
  },
  {
    id: "dostepnosc",
    questions: {
      pl: ["Czy macie wolny jacht w lipcu?", "Czy termin w sierpniu jest dostępny?", "Sprawdźcie dostępność jachtu", "Czy są jeszcze wolne jachty na wakacje?"],
      en: ["Do you have a yacht available in July?", "Is there availability in August?", "Check the yacht's availability", "Are there still free yachts for the summer?"],
    },
    answer: {
      pl: "Dostępność jachtów zmienia się z dnia na dzień, dlatego sprawdza ją broker przy przygotowaniu oferty. Wyślij zapytanie z terminem i liczbą osób.",
      en: "Yacht availability changes from day to day, so your broker checks it when preparing the offer. Send an enquiry with your dates and number of people.",
    },
    link: inquiryLink,
  },
  {
    id: "liczba-osob",
    questions: {
      pl: ["Ile osób zmieści się na jachcie?", "Czy 8 osób zmieści się na jednym jachcie?", "Jaka jest maksymalna liczba osób na pokładzie?", "Płyniemy dużą grupą, co wtedy?"],
      en: ["How many people fit on a yacht?", "Can 8 people fit on one yacht?", "What is the maximum number of people on board?", "We are a large group, what then?"],
    },
    answer: { pl: templates.pl.guestsAnswer, en: templates.en.guestsAnswer },
    link: inquiryLink,
  },
  {
    id: "kontakt",
    questions: {
      pl: ["Jak się z wami skontaktować?", "Podajcie numer telefonu", "Jaki jest wasz adres e-mail?", "Gdzie jest wasze biuro?", "Dane firmy Kilwater"],
      en: ["How can I contact you?", "What is your phone number?", "What is your email address?", "Where is your office?", "Kilwater company details"],
    },
    answer: { pl: templates.pl.contactAnswer, en: templates.en.contactAnswer },
    link: mailLink,
  },
];

const guideEntries: AssistantEntry[] = [
  {
    id: "poradnik-pierwszy-czarter-krok-po-kroku",
    questions: [
      "Jak wygląda pierwszy czarter jachtu krok po kroku?",
      "Pierwszy raz czarteruję jacht, od czego zacząć?",
      "Jak przygotować się do pierwszego rejsu?",
      "Jak wygląda odbiór i zdanie jachtu?",
    ],
    answer:
      "Najpierw decydujesz, kto prowadzi jacht, gdzie i kiedy płyniecie i ile osób płynie. Potem wysyłasz zapytanie, broker oddzwania i przygotowuje ofertę, a po podpisaniu umowy odbierasz jacht w marinie. Cały proces opisaliśmy w poradniku.",
    link: { href: "/poradnik/pierwszy-czarter-krok-po-kroku", label: "Przeczytaj: pierwszy czarter krok po kroku" },
  },
  {
    id: "poradnik-jak-wybrac-akwen",
    questions: [
      "Jak wybrać akwen na rejs?",
      "Chorwacja czy Grecja na pierwszy rejs?",
      "Który akwen jest najlepszy dla początkujących?",
      "Porównanie Chorwacji, Grecji, Włoch i Mazur",
    ],
    answer:
      "Na pierwszy rejs dobrze sprawdzają się Chorwacja z krótkimi przelotami i Mazury bez fali. Cyklady w Grecji są dla tych, którzy lubią wiatr, a Włochy dla miłośników widoków i kuchni. Porównanie wszystkich akwenów jest w poradniku.",
    link: { href: "/poradnik/jak-wybrac-akwen", label: "Przeczytaj: jak wybrać akwen" },
  },
  {
    id: "poradnik-typ-jachtu",
    questions: [
      "Czym różni się jacht żaglowy od katamaranu?",
      "Katamaran czy jacht motorowy?",
      "Jaki typ jachtu wybrać dla rodziny?",
      "Czy katamaran mniej buja niż jacht żaglowy?",
    ],
    answer:
      "Jacht żaglowy daje prawdziwe żeglowanie, katamaran stabilność i dużo miejsca, a jacht motorowy tempo i swobodę planowania. Z dziećmi i przy skłonności do choroby morskiej zwykle najwygodniejszy jest katamaran. Szczegóły w poradniku.",
    link: { href: "/poradnik/jacht-zaglowy-katamaran-czy-motorowy", label: "Przeczytaj: jacht żaglowy, katamaran czy motorowy" },
  },
  {
    id: "poradnik-pakowanie",
    questions: [
      "Pełna lista rzeczy do spakowania na rejs",
      "Czego nie zabierać na jacht?",
      "Jaką apteczkę zabrać na rejs?",
      "Co spakować dla dzieci na jacht?",
    ],
    answer:
      "Zabierz miękką torbę zamiast walizki, buty z jasną podeszwą, kurtkę od wiatru, ochronę przed słońcem, własne leki i dokumenty wszystkich osób. Pełną listę, także dla dzieci, i rzeczy, których lepiej nie brać, znajdziesz w poradniku.",
    link: { href: "/poradnik/co-spakowac-na-rejs", label: "Przeczytaj: co spakować na rejs" },
  },
  {
    id: "poradnik-rejs-bez-patentu",
    questions: [
      "Jak popłynąć w rejs bez patentu?",
      "Czy skipper śpi na jachcie?",
      "Rejs ze skipperem czy z pełną załogą, co wybrać?",
      "Czy mogę nauczyć się żeglować na rejsie ze skipperem?",
    ],
    answer:
      "Bez patentu płyniesz ze skipperem albo z pełną załogą, a jacht prowadzi skipper. Skipper płynie z Wami cały czas, więc zwykle potrzebuje własnej koi albo kabiny. Na rejsie ze skipperem możesz też uczyć się żeglowania. Więcej w poradniku.",
    link: { href: "/poradnik/rejs-bez-patentu", label: "Przeczytaj: rejs bez patentu" },
  },
];

const buildEntries = (locale: Locale): AssistantEntry[] => {
  const text = templates[locale];
  const areaNames = destinationTexts[locale];

  const faqEntries = faqItems[locale].map((item, index) => ({
    id: `faq-${index + 1}`,
    questions: [item.question, ...item.alsoAsked],
    answer: item.answer,
  }));

  const aboutEntry: AssistantEntry = {
    id: "kilwater",
    questions:
      locale === "pl"
        ? ["Czym jest Kilwater?", "Czym się zajmujecie?", "Kim jesteście?", "Czy jesteście armatorem czy pośrednikiem?"]
        : ["What is Kilwater?", "What do you do?", "Who are you?", "Are you a yacht owner or a broker?"],
    answer: text.aboutAnswer(joinList(seasons.map((season) => season.inName[locale]), locale)),
  };

  const areasEntry: AssistantEntry = {
    id: "akweny",
    questions:
      locale === "pl"
        ? ["Gdzie można popłynąć?", "Gdzie pływacie?", "Jakie akweny obsługujecie?", "Gdzie najlepiej na pierwszy rejs?", "Czy pływacie po Bałtyku albo Karaibach?", "Jakie kraje są w ofercie?"]
        : ["Where can I sail?", "Where do you sail?", "Which sailing areas do you cover?", "Where is best for a first cruise?", "Do you sail in the Baltic or the Caribbean?", "Which countries do you offer?"],
    answer: text.areasAnswer(joinList(areaNames.map((area) => `${area.name} (${area.region})`), locale)),
    link: { href: sectionHref(locale, "akweny"), label: linkLabels.areas[locale] },
  };

  const cruiseTypeEntries = cruiseTypeTexts[locale].map((cruiseType, index) => ({
    id: `rejs-${index + 1}`,
    questions: cruiseTypeQuestions[locale][index],
    answer: text.cruiseAnswer(cruiseType.name, cruiseType.audience, cruiseType.text, cruiseType.included.join(", ").toLowerCase()),
    link: { href: sectionHref(locale, "rejsy"), label: linkLabels.cruises[locale] },
  }));

  const destinationEntries = areaNames.map((area) => {
    const inName = seasonOf(area.slug).inName[locale];
    return {
      id: `akwen-${area.slug}`,
      questions: text.area(area.name, inName, area.region),
      answer: text.areaAnswer(area.name, area.region, area.text),
      link: { href: sectionHref(locale, "zapytanie", { akwen: area.slug }), label: linkLabels.askArea[locale](inName) },
    };
  });

  const seasonEntries = seasons.map((season) => ({
    id: `sezon-${season.destination}`,
    questions: [...seasonQuestions[locale][season.destination], ...text.season(season.inName[locale])],
    answer: text.seasonAnswer(
      season.inName[locale],
      monthsWith(season.levels, "best", locale),
      monthsWith(season.levels, "peak", locale),
      season.wind[locale],
      season.water[locale],
    ),
    link: { href: sectionHref(locale, "kiedy-plynac"), label: linkLabels.season[locale] },
  }));

  const routeEntries = sampleRoutes.map((route) => {
    const inName = seasonOf(route.destination).inName[locale];
    const ports = [...route.legs.map((leg) => leg.from), route.legs.at(-1)!.to];
    const region = areaNames.find((area) => area.slug === route.destination)!.region;
    return {
      id: `trasa-${route.slug}`,
      questions: [...text.route(inName, [...new Set(ports)].join(", "), region), route.title[locale]],
      answer: text.routeAnswer(route.title[locale], route.nights, ports.join(" → ")),
      link: { href: sectionHref(locale, "trasy"), label: linkLabels.route[locale] },
    };
  });

  return [
    ...faqEntries,
    aboutEntry,
    areasEntry,
    ...manualEntries.map((entry) => ({
      id: entry.id,
      questions: entry.questions[locale],
      answer: entry.answer[locale],
      link: entry.link?.(locale),
    })),
    ...cruiseTypeEntries,
    ...destinationEntries,
    ...seasonEntries,
    ...routeEntries,
    ...(locale === "pl" ? guideEntries : []),
  ];
};

export const assistantEntries: Localized<AssistantEntry[]> = { pl: buildEntries("pl"), en: buildEntries("en") };

export const assistantFallback: Localized<Record<"unknown" | "unsure" | "link" | "contact", string>> = {
  pl: {
    unknown: `Nie znam odpowiedzi na to pytanie. Napisz do nas na ${company.email}, a broker odpowie osobiście.`,
    unsure: `Nie mam pewnej odpowiedzi. Sprawdź podobne pytania poniżej albo napisz na ${company.email}.`,
    link: "Nie otwieram linków. Opisz pytanie własnymi słowami.",
    contact: "Nie wpisuj tu danych kontaktowych. Jeśli broker ma się do Ciebie odezwać, wyślij formularz zapytania niżej na stronie.",
  },
  en: {
    unknown: `I do not know the answer to this question. Write to us at ${company.email} and a broker will reply personally.`,
    unsure: `I do not have a confident answer. Check the similar questions below or write to ${company.email}.`,
    link: "I do not open links. Please describe your question in your own words.",
    contact: "Please do not type contact details here. If you want a broker to get in touch, send the enquiry form further down the page.",
  },
};

