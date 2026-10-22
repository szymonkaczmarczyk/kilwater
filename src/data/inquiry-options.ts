export const destinationOptions = [
  { value: "chorwacja", label: "Chorwacja" },
  { value: "grecja", label: "Grecja" },
  { value: "wlochy", label: "Włochy" },
  { value: "mazury", label: "Mazury" },
  { value: "nie-wiem", label: "Jeszcze nie wiem" },
] as const;

export const nightOptions = [
  { value: "3", label: "3 noce" },
  { value: "5", label: "5 nocy" },
  { value: "7", label: "7 nocy" },
  { value: "10", label: "10 nocy" },
  { value: "14", label: "14 nocy" },
  { value: "inna", label: "Inna długość" },
] as const;

export const cruiseOptions = [
  { value: "pelna-zaloga", label: "Z pełną załogą", hint: "Skipper, hostessa, kucharz", icon: "chef" },
  { value: "ze-skipperem", label: "Ze skipperem", hint: "Prowadzi jacht za Was", icon: "helm" },
  { value: "bez-zalogi", label: "Bez załogi", hint: "Na własne uprawnienia", icon: "compass" },
] as const;

export const extraOptions = [
  { value: "sup", label: "Deski SUP" },
  { value: "snorkeling", label: "Snorkeling" },
  { value: "ponton", label: "Ponton z silnikiem" },
  { value: "transfer", label: "Transfer z lotniska" },
  { value: "zaopatrzenie", label: "Zaopatrzenie jachtu" },
  { value: "posciel", label: "Pościel i ręczniki" },
] as const;

export const guestLimits = { min: 1, max: 12 } as const;
export const messageMaxLength = 1000;
