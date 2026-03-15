export const activeDestinationMarkets = [
  "United States",
  "European Union",
  "United Kingdom",
  "Japan",
  "Brazil",
  "China",
] as const;

export type ActiveDestinationMarket = (typeof activeDestinationMarkets)[number];
