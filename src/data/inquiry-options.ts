export const destinationOptions = [
  { value: "chorwacja", label: { pl: "Chorwacja", en: "Croatia" } },
  { value: "grecja", label: { pl: "Grecja", en: "Greece" } },
  { value: "wlochy", label: { pl: "Włochy", en: "Italy" } },
  { value: "mazury", label: { pl: "Mazury", en: "Masuria" } },
  { value: "nie-wiem", label: { pl: "Jeszcze nie wiem", en: "Not sure yet" } },
] as const;

export const nightOptions = [
  { value: "3", label: { pl: "3 noce", en: "3 nights" } },
  { value: "5", label: { pl: "5 nocy", en: "5 nights" } },
  { value: "7", label: { pl: "7 nocy", en: "7 nights" } },
  { value: "10", label: { pl: "10 nocy", en: "10 nights" } },
  { value: "14", label: { pl: "14 nocy", en: "14 nights" } },
  { value: "inna", label: { pl: "Inna długość", en: "Other length" } },
] as const;

export const cruiseOptions = [
  {
    value: "pelna-zaloga",
    label: { pl: "Z pełną załogą", en: "Fully crewed" },
    hint: { pl: "Skipper, hostessa, kucharz", en: "Skipper, host, chef" },
    icon: "chef",
  },
  {
    value: "ze-skipperem",
    label: { pl: "Ze skipperem", en: "With a skipper" },
    hint: { pl: "Prowadzi jacht za Was", en: "Sails the yacht for you" },
    icon: "helm",
  },
  {
    value: "bez-zalogi",
    label: { pl: "Bez załogi", en: "Bareboat" },
    hint: { pl: "Na własne uprawnienia", en: "On your own licence" },
    icon: "compass",
  },
] as const;

export const extraOptions = [
  { value: "sup", label: { pl: "Deski SUP", en: "SUP boards" } },
  { value: "snorkeling", label: { pl: "Snorkeling", en: "Snorkelling" } },
  { value: "ponton", label: { pl: "Ponton z silnikiem", en: "Dinghy with outboard" } },
  { value: "transfer", label: { pl: "Transfer z lotniska", en: "Airport transfer" } },
  { value: "zaopatrzenie", label: { pl: "Zaopatrzenie jachtu", en: "Provisioning" } },
  { value: "posciel", label: { pl: "Pościel i ręczniki", en: "Bed linen and towels" } },
] as const;

export const guestLimits = { min: 1, max: 12 } as const;
export const messageMaxLength = 1000;
