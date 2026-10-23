import type { Localized } from "../i18n/locales";

type FaqItem = { question: string; alsoAsked: readonly string[]; answer: string };

const faqItemsPl: FaqItem[] = [
  {
    question: "Czy potrzebuję patentu żeglarskiego?",
    alsoAsked: [
      "Czy muszę mieć uprawnienia, żeby wypłynąć?",
      "Czy bez patentu mogę wynająć jacht?",
      "Jakie uprawnienia są potrzebne na rejs bez załogi?",
      "Czy skipper musi mieć patent, jeśli płyniemy ze skipperem?",
      "Czy potrzebne jest świadectwo radiooperatora?",
    ],
    answer:
      "Nie, jeśli płyniesz z pełną załogą albo ze skipperem. Jacht prowadzi wtedy skipper. Przy rejsie bez załogi jedna osoba musi mieć uprawnienia wymagane w kraju czarteru, a często też świadectwo operatora radiowego. Dokładne wymagania sprawdzamy przy przygotowaniu oferty.",
  },
  {
    question: "Czym jest kaucja i kiedy wraca?",
    alsoAsked: [
      "Ile wynosi depozyt za jacht?",
      "Kiedy oddajecie kaucję?",
      "Czy można ubezpieczyć kaucję?",
      "Co jeśli coś zepsujemy na jachcie?",
      "Blokada na karcie przy odbiorze jachtu",
    ],
    answer:
      "Kaucja to zabezpieczenie na wypadek szkód. Armator blokuje ją na karcie przy odbiorze jachtu i zwalnia po jego zdaniu bez uszkodzeń. Można wykupić ubezpieczenie kaucji, które pokrywa szkody do jej wysokości. Kwotę podajemy w każdej ofercie.",
  },
  {
    question: "Co jest w cenie czarteru, a za co płaci się osobno?",
    alsoAsked: [
      "Co nie jest wliczone w cenę?",
      "Czy paliwo jest w cenie?",
      "Za co trzeba dopłacić na miejscu?",
      "Czy opłaty portowe i za marinę są wliczone?",
      "Czym jest zaliczka na wyżywienie przy pełnej załodze?",
    ],
    answer:
      "Cena czarteru obejmuje jacht z wyposażeniem. Osobno zwykle płaci się za paliwo, opłaty w marinach i portach, sprzątanie końcowe oraz dodatki. Przy jachtach z pełną załogą dochodzi zaliczka na wyżywienie i bieżące koszty, rozliczana po rejsie. W ofercie rozpisujemy każdą pozycję.",
  },
  {
    question: "Co z chorobą morską?",
    alsoAsked: [
      "Boję się, że będzie mną bujać",
      "Czy na jachcie jest niedobrze?",
      "Jak uniknąć mdłości na łodzi?",
      "Mam chorobę lokomocyjną, czy rejs to dobry pomysł?",
      "Gdzie najmniej buja?",
    ],
    answer:
      "Pomagają krótkie przeloty, osłonięte zatoki i katamaran, który mniej się kołysze. Najspokojniej jest na Mazurach, gdzie nie ma fali. Przed rejsem warto zapytać w aptece o środki na chorobę lokomocyjną, a skipper ułoży trasę pod najmniej odporną osobę na pokładzie.",
  },
  {
    question: "Czy można płynąć z dziećmi?",
    alsoAsked: [
      "Czy rejs jest bezpieczny dla małego dziecka?",
      "Płyniemy z małą córką, czy to bezpieczne?",
      "Czy rejs nadaje się dla niemowlaka?",
      "Czy macie kamizelki dla dzieci?",
      "Płyniemy z trzyletnim synem, co polecacie?",
      "Czy katamaran jest dobry dla rodziny z dziećmi?",
      "Siatki na relingach dla dzieci",
    ],
    answer:
      "Tak. Podaj wiek dzieci w zapytaniu, a przygotujemy kamizelki w odpowiednich rozmiarach i zapytamy armatora o siatki na relingach. Z małymi dziećmi najwygodniejszy jest katamaran i trasa z krótkimi odcinkami.",
  },
  {
    question: "Czy mogę zabrać psa?",
    alsoAsked: [
      "Czy na jacht można wejść z psem?",
      "Czy zwierzęta są dozwolone na pokładzie?",
      "Chcę zabrać kota na rejs",
      "Czy pies może płynąć z nami?",
    ],
    answer:
      "To zależy od armatora. Część jachtów przyjmuje zwierzęta, zwykle za dodatkową opłatą za sprzątanie. Napisz o tym w zapytaniu, a pokażemy tylko jachty, na których pies jest mile widziany.",
  },
  {
    question: "Jak wygląda dzień na jachcie?",
    alsoAsked: [
      "Jak wygląda typowy dzień rejsu?",
      "Ile godzin dziennie się płynie?",
      "Co się robi na jachcie przez cały dzień?",
      "Czy jest czas na zwiedzanie i kąpiele?",
    ],
    answer:
      "Śniadanie na kotwicy i kąpiel, potem przelot do kolejnej zatoki albo portu, zwykle kilka godzin. Popołudnie na kąpiele i zwiedzanie, wieczór w miasteczku albo na kotwicy pod gwiazdami. Tempo ustalasz Ty, a skipper pilnuje pogody.",
  },
  {
    question: "Co jeśli pogoda się zepsuje?",
    alsoAsked: [
      "Co jeśli będzie sztorm?",
      "Co robimy przy silnym wietrze?",
      "Czy rejs się odbędzie, gdy pada deszcz?",
      "Czy trzeba trzymać się trasy przy złej pogodzie?",
    ],
    answer:
      "Trasa jest planem, a nie obowiązkiem. Przy silnym wietrze skipper zmienia kolejność postojów albo zostaje dzień dłużej w osłoniętym porcie. Bezpieczeństwo załogi zawsze wygrywa z planem.",
  },
  {
    question: "Co spakować na rejs?",
    alsoAsked: [
      "Jakie rzeczy zabrać na tydzień na jachcie?",
      "Walizka czy torba na rejs?",
      "Jakie buty na jacht?",
      "Lista rzeczy do zabrania na rejs",
      "Jakie dokumenty zabrać?",
    ],
    answer:
      "Miękką torbę zamiast walizki, buty z jasną podeszwą, kurtkę od wiatru, nakrycie głowy i krem z filtrem. Do tego dokumenty wszystkich osób, a przy rejsie bez załogi uprawnienia skippera.",
  },
  {
    question: "Z jakim wyprzedzeniem rezerwować?",
    alsoAsked: [
      "Kiedy najlepiej zarezerwować rejs?",
      "Czy na lipiec jest już za późno?",
      "Ile wcześniej trzeba rezerwować jacht?",
      "Czy da się zarezerwować rejs w ostatniej chwili?",
    ],
    answer:
      "Na lipiec i sierpień najlepiej kilka miesięcy wcześniej, bo najpopularniejsze jachty znikają najszybciej. W czerwcu i wrześniu zwykle wystarczy krótszy czas. Zapytanie nic nie kosztuje, więc warto wysłać je od razu, gdy znasz przybliżony termin.",
  },
];

const faqItemsEn: FaqItem[] = [
  {
    question: "Do I need a sailing licence?",
    alsoAsked: [
      "Do I need any qualifications to go sailing?",
      "Can I charter a yacht without a licence?",
      "What licence do I need for a bareboat charter?",
      "Does anyone need a licence if we sail with a skipper?",
      "Do I need a VHF radio certificate?",
    ],
    answer:
      "Not if you sail fully crewed or with a skipper, because the skipper sails the yacht. For a bareboat charter one person needs the licence required in the charter country, and often a VHF radio certificate too. We check the exact requirements when we prepare the offer.",
  },
  {
    question: "What is the security deposit and when do I get it back?",
    alsoAsked: [
      "How much is the deposit for the yacht?",
      "When is the deposit returned?",
      "Can I insure the deposit?",
      "What if we damage something on the yacht?",
      "Card hold when picking up the yacht",
    ],
    answer:
      "The deposit covers possible damage. The owner holds it on your card at check-in and releases it when the yacht is returned undamaged. You can buy deposit insurance, which covers damage up to the deposit amount. We state the amount in every offer.",
  },
  {
    question: "What is included in the charter price and what is paid separately?",
    alsoAsked: [
      "What is not included in the price?",
      "Is fuel included?",
      "What do I pay on site?",
      "Are marina and harbour fees included?",
      "What is the advance provisioning allowance for a crewed yacht?",
    ],
    answer:
      "The charter price covers the yacht with its equipment. Fuel, marina and harbour fees, final cleaning and extras are usually paid separately. Crewed yachts add an advance for food and running costs, settled after the cruise. The offer lists every item.",
  },
  {
    question: "What about seasickness?",
    alsoAsked: [
      "I am afraid the boat will rock too much",
      "Will I feel sick on a yacht?",
      "How to avoid nausea on a boat?",
      "I get motion sickness, is a cruise a good idea?",
      "Where is the sea the calmest?",
    ],
    answer:
      "Short passages, sheltered bays and a catamaran, which rocks less, all help. Masuria is the calmest, because there is no swell. Ask a pharmacist about motion sickness remedies before the cruise, and the skipper will plan the route around the least seaworthy person on board.",
  },
  {
    question: "Can we sail with children?",
    alsoAsked: [
      "Is a cruise safe for a small child?",
      "We are sailing with a little daughter, is it safe?",
      "Is a cruise suitable for a baby?",
      "Do you have life jackets for children?",
      "We are travelling with a three year old, what do you recommend?",
      "Is a catamaran good for a family with children?",
      "Safety netting on the guardrails for children",
    ],
    answer:
      "Yes. Tell us the children's ages in the enquiry and we will prepare life jackets in the right sizes and ask the owner about guardrail netting. With small children a catamaran and a route with short legs are the most comfortable.",
  },
  {
    question: "Can I bring my dog?",
    alsoAsked: [
      "Are dogs allowed on board?",
      "Are pets allowed on the yacht?",
      "I want to take my cat on the cruise",
      "Can our dog sail with us?",
    ],
    answer:
      "It depends on the owner. Some yachts accept pets, usually for an extra cleaning fee. Mention it in the enquiry and we will only show yachts where your dog is welcome.",
  },
  {
    question: "What does a day on the yacht look like?",
    alsoAsked: [
      "What is a typical day on a cruise like?",
      "How many hours a day do we sail?",
      "What do you do on a yacht all day?",
      "Is there time for sightseeing and swimming?",
    ],
    answer:
      "Breakfast at anchor and a swim, then a passage to the next bay or harbour, usually a few hours. The afternoon is for swimming and sightseeing, the evening in a small town or at anchor under the stars. You set the pace and the skipper watches the weather.",
  },
  {
    question: "What if the weather turns bad?",
    alsoAsked: [
      "What if there is a storm?",
      "What do we do in strong wind?",
      "Does the cruise go ahead when it rains?",
      "Do we have to stick to the route in bad weather?",
    ],
    answer:
      "The route is a plan, not an obligation. In strong wind the skipper changes the order of stops or stays an extra day in a sheltered harbour. The crew's safety always comes before the plan.",
  },
  {
    question: "What should I pack for the cruise?",
    alsoAsked: [
      "What to take for a week on a yacht?",
      "Suitcase or bag for a cruise?",
      "What shoes to wear on a yacht?",
      "Packing list for a sailing trip",
      "Which documents should I bring?",
    ],
    answer:
      "A soft bag instead of a suitcase, shoes with light soles, a windproof jacket, a hat and sunscreen. Plus documents for everyone, and the skipper's licence for a bareboat charter.",
  },
  {
    question: "How far in advance should I book?",
    alsoAsked: [
      "When is the best time to book a cruise?",
      "Is it too late to book for July?",
      "How early do I need to book a yacht?",
      "Can I book a cruise at the last minute?",
    ],
    answer:
      "For July and August ideally a few months ahead, because the most popular yachts go first. For June and September a shorter time is usually enough. An enquiry costs nothing, so it is worth sending as soon as you know your rough dates.",
  },
];

export const faqItems: Localized<FaqItem[]> = { pl: faqItemsPl, en: faqItemsEn };
