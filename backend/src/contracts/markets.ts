export const activeSupportedDestinations = [
  "United States",
  "European Union",
  "United Kingdom",
  "Japan",
  "Brazil",
  "China",
] as const;

export type ActiveSupportedDestination =
  (typeof activeSupportedDestinations)[number];
