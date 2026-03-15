import type {
  LookupClassification,
  LookupInputMode,
} from "../contracts/lookup.js";

type ClassificationProfile = {
  probableHsCode: string;
  label: string;
  keywords: string[];
  phrases: string[];
  excludedKeywords?: string[];
  excludedPhrases?: string[];
  euPriority: "normalized" | "ambiguous" | "seed-fallback";
};

const seedClassificationProfiles: ClassificationProfile[] = [
  {
    probableHsCode: "8208.30",
    label: "Industrial blades and knives",
    keywords: ["knife", "knives", "blade", "blades", "stainless", "steel"],
    phrases: ["knife blade", "kitchen knife", "cutting blade"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "0901.21",
    label: "Roasted coffee",
    keywords: ["coffee", "beans", "roasted", "ground"],
    phrases: ["roasted coffee", "coffee beans", "ground coffee"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "0811.90",
    label: "Frozen fruit",
    keywords: ["frozen", "blueberry", "blueberries", "berry", "berries"],
    phrases: ["frozen fruit", "frozen berries", "frozen blueberries"],
    euPriority: "ambiguous",
  },
  {
    probableHsCode: "6109.10",
    label: "Cotton T-shirts",
    keywords: ["t-shirt", "shirt", "tee", "cotton", "apparel", "garment"],
    phrases: ["cotton t-shirt", "cotton tee", "t shirt"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "3923.21",
    label: "Plastic sacks and bags",
    keywords: [
      "plastic",
      "polyethylene",
      "bag",
      "bags",
      "sack",
      "sacks",
      "packaging",
      "shipping",
      "pouch",
    ],
    phrases: ["plastic bag", "plastic bags", "polyethylene bag", "shipping bag"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "3924.10",
    label: "Plastic tableware and kitchenware",
    keywords: [
      "plastic",
      "kitchen",
      "tableware",
      "kitchenware",
      "plate",
      "plates",
      "bowl",
      "bowls",
      "utensil",
      "utensils",
    ],
    phrases: ["plastic kitchenware", "plastic tableware", "plastic bowl"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "3924.90",
    label: "Plastic household articles",
    keywords: [
      "plastic",
      "household",
      "organizer",
      "laundry",
      "basket",
      "caddy",
      "bathroom",
      "storage",
    ],
    phrases: ["plastic laundry basket", "plastic organizer", "plastic storage caddy"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "6911.10",
    label: "Porcelain and china tableware",
    keywords: [
      "porcelain",
      "china",
      "dinnerware",
      "plate",
      "plates",
      "saucer",
      "teacup",
      "tableware",
    ],
    phrases: ["porcelain plate", "china bowl", "porcelain dinnerware"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "4419.90",
    label: "Wooden tableware and kitchenware",
    keywords: [
      "wood",
      "wooden",
      "tableware",
      "kitchenware",
      "serving",
      "tray",
      "bowl",
      "utensil",
      "salad",
      "cutting",
      "board",
    ],
    phrases: [
      "wooden serving tray",
      "wooden salad bowl",
      "wooden kitchenware",
      "wooden tableware",
      "wooden cutting board",
    ],
    excludedKeywords: ["chair", "stool", "seat", "cabinet", "furniture", "ornament"],
    excludedPhrases: ["wooden dining table", "wooden chair", "wooden cabinet"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "7013.49",
    label: "Glass drinkware and table glassware",
    keywords: [
      "glass",
      "glasses",
      "tumbler",
      "tumblers",
      "drinkware",
      "drinking",
      "goblet",
      "glassware",
    ],
    phrases: ["glass tumbler", "drinking glasses", "glassware set"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "7615.10",
    label: "Aluminium household and kitchen articles",
    keywords: [
      "aluminium",
      "aluminum",
      "kitchen",
      "household",
      "tray",
      "basket",
      "dish",
      "serving",
      "cookware",
      "pan",
    ],
    phrases: [
      "aluminum serving tray",
      "aluminium serving tray",
      "aluminum kitchen basket",
      "aluminium kitchen tray",
    ],
    excludedKeywords: [
      "radiator",
      "radiators",
      "foil",
      "foils",
      "section",
      "sections",
      "bathroom",
      "shower",
      "soap",
      "sanitary",
    ],
    excludedPhrases: ["aluminum radiator", "aluminium radiator", "foil manufacture"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "7615.20",
    label: "Aluminium sanitary ware",
    keywords: [
      "aluminium",
      "aluminum",
      "sanitary",
      "bathroom",
      "shower",
      "soap",
      "towel",
      "fixture",
    ],
    phrases: ["aluminium shower caddy", "aluminum bathroom fixture", "aluminium soap dish"],
    excludedKeywords: [
      "radiator",
      "radiators",
      "foil",
      "foils",
      "tray",
      "pan",
      "cookware",
      "basket",
      "dish",
    ],
    euPriority: "normalized",
  },
  {
    probableHsCode: "8302.50",
    label: "Metal hooks and brackets",
    keywords: [
      "hook",
      "hooks",
      "bracket",
      "brackets",
      "peg",
      "pegs",
      "wall",
      "hanger",
    ],
    phrases: ["wall hook", "coat hook", "metal bracket"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "8306.29",
    label: "Metal ornaments and decorative articles",
    keywords: [
      "metal",
      "brass",
      "decorative",
      "ornament",
      "figurine",
      "statuette",
      "candle",
      "holder",
      "decor",
    ],
    phrases: [
      "metal candle holder",
      "brass candle holder",
      "decorative metal figurine",
    ],
    excludedKeywords: ["hook", "hooks", "bracket", "brackets", "fixture", "furniture"],
    excludedPhrases: ["metal wall hook", "metal bracket"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "4819.10",
    label: "Corrugated cartons and boxes",
    keywords: [
      "corrugated",
      "carton",
      "cartons",
      "box",
      "boxes",
      "paperboard",
      "shipping",
      "packaging",
    ],
    phrases: ["corrugated box", "corrugated boxes", "shipping carton"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "6302.60",
    label: "Terry towels and kitchen linen",
    keywords: [
      "towel",
      "towels",
      "terry",
      "bath",
      "bathroom",
      "washcloth",
      "washcloths",
      "linen",
    ],
    phrases: ["bath towel", "terry towel", "bath towel set"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "6302.91",
    label: "Cotton table linen and kitchen linen",
    keywords: [
      "cotton",
      "tablecloth",
      "tablecloths",
      "napkin",
      "napkins",
      "table",
      "linen",
      "tea towel",
    ],
    phrases: ["cotton tablecloth", "cotton napkins", "table linen"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "7323.93",
    label: "Stainless steel household articles",
    keywords: [
      "stainless",
      "steel",
      "cookware",
      "saucepan",
      "pot",
      "pan",
      "stockpot",
      "household",
    ],
    phrases: [
      "stainless steel cookware",
      "stainless steel pot",
      "stainless steel pan",
    ],
    euPriority: "normalized",
  },
  {
    probableHsCode: "8501.52",
    label: "Electric motors",
    keywords: [
      "motor",
      "rotor",
      "industrial",
      "electric",
      "conveyor",
      "three-phase",
    ],
    phrases: ["electric motor", "industrial motor", "ac motor"],
    euPriority: "ambiguous",
  },
  {
    probableHsCode: "9403.30",
    label: "Wooden office furniture",
    keywords: [
      "office",
      "desk",
      "filing",
      "cabinet",
      "cupboard",
      "wood",
      "wooden",
    ],
    phrases: ["office desk", "wooden office desk", "filing cabinet", "office cabinet"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "9403.20",
    label: "Metal furniture",
    keywords: [
      "metal",
      "steel",
      "shelving",
      "shelf",
      "locker",
      "cabinet",
      "storage",
      "furniture",
    ],
    phrases: ["metal shelving unit", "steel shelving", "metal storage cabinet"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "9403.40",
    label: "Wooden kitchen furniture",
    keywords: [
      "kitchen",
      "cabinet",
      "pantry",
      "cupboard",
      "wood",
      "wooden",
      "furniture",
    ],
    phrases: ["kitchen cabinet", "wooden kitchen cabinet", "pantry cabinet"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "9401.61",
    label: "Upholstered seats",
    keywords: [
      "upholstered",
      "chair",
      "armchair",
      "seat",
      "seating",
      "lounge",
      "sofa",
    ],
    phrases: ["upholstered chair", "upholstered armchair", "lounge chair"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "9401.69",
    label: "Non-upholstered seats",
    keywords: [
      "chair",
      "chairs",
      "stool",
      "stools",
      "seat",
      "seating",
      "folding",
      "wooden",
      "rattan",
      "cane",
    ],
    phrases: ["wooden stool", "folding chair", "wooden dining chair"],
    excludedKeywords: ["upholstered", "armchair", "sofa", "lounge", "cushion", "cushioned"],
    excludedPhrases: ["upholstered chair", "lounge chair"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "9403.50",
    label: "Wooden bedroom furniture",
    keywords: [
      "bedroom",
      "dresser",
      "wardrobe",
      "nightstand",
      "bedside",
      "wood",
      "wooden",
      "furniture",
    ],
    phrases: ["bedroom dresser", "wooden dresser", "bedroom furniture"],
    euPriority: "normalized",
  },
  {
    probableHsCode: "9403.60",
    label: "Wooden furniture",
    keywords: [
      "wood",
      "wooden",
      "chair",
      "table",
      "furniture",
      "shop",
      "dining",
      "living",
    ],
    phrases: ["wooden furniture", "wooden table", "dining room table"],
    euPriority: "normalized",
  },
];

export type ResolvedLookupClassification = {
  classification: LookupClassification;
  inputMode: LookupInputMode;
  normalizedHsCode: string;
  normalizedProductDescription: string | null;
  submittedHsCode: string | null;
};

export function normalizeHsCode(value: string) {
  return value.replace(/\s+/g, "").replace(/[^\d.]/g, "");
}

export function canonicalizeHsCode(value: string) {
  return value.replace(/[^\d]/g, "");
}

export function normalizeDescription(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function normalizeSearchTerm(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function matchesNormalizedKeyword(
  searchableDescription: string,
  searchableTokens: Set<string>,
  keyword: string,
) {
  const normalizedKeyword = normalizeSearchTerm(keyword);

  if (normalizedKeyword.includes(" ")) {
    return searchableDescription.includes(normalizedKeyword);
  }

  return searchableTokens.has(normalizedKeyword);
}

function getEuPriorityBoost(priority: ClassificationProfile["euPriority"]) {
  if (priority === "normalized") {
    return 1;
  }

  if (priority === "ambiguous") {
    return 0.5;
  }

  return 0;
}

function resolveClassificationFromDescription(
  productDescription: string,
  destinationCountry: string,
): LookupClassification {
  const normalizedDescription = productDescription.toLowerCase();
  const searchableDescription = normalizeSearchTerm(normalizedDescription);
  const searchableTokens = new Set(
    searchableDescription.split(" ").filter(Boolean),
  );
  let bestMatch:
    | {
        profile: ClassificationProfile;
        matchedKeywords: string[];
        matchedPhrases: string[];
        score: number;
      }
    | undefined;

  for (const profile of seedClassificationProfiles) {
    const matchedExcludedKeywords = (profile.excludedKeywords || []).filter((keyword) =>
      matchesNormalizedKeyword(searchableDescription, searchableTokens, keyword),
    );
    const matchedExcludedPhrases = (profile.excludedPhrases || []).filter((phrase) =>
      searchableDescription.includes(normalizeSearchTerm(phrase)),
    );

    if (matchedExcludedKeywords.length > 0 || matchedExcludedPhrases.length > 0) {
      continue;
    }

    const matchedKeywords = profile.keywords.filter((keyword) =>
      matchesNormalizedKeyword(searchableDescription, searchableTokens, keyword),
    );
    const matchedPhrases = profile.phrases.filter((phrase) =>
      searchableDescription.includes(normalizeSearchTerm(phrase)),
    );
    const euPriorityBoost =
      destinationCountry === "European Union"
        ? getEuPriorityBoost(profile.euPriority)
        : 0;
    const baseScore = matchedKeywords.length + matchedPhrases.length * 2;
    const score =
      baseScore > 0 ? baseScore + euPriorityBoost : 0;

    if (!bestMatch || score > bestMatch.score) {
      bestMatch = {
        profile,
        matchedKeywords,
        matchedPhrases,
        score,
      };
      continue;
    }

    if (score === bestMatch.score) {
      const currentPriorityBoost = getEuPriorityBoost(profile.euPriority);
      const bestPriorityBoost = getEuPriorityBoost(bestMatch.profile.euPriority);

      if (currentPriorityBoost > bestPriorityBoost) {
        bestMatch = {
          profile,
          matchedKeywords,
          matchedPhrases,
          score,
        };
      }
    }
  }

  if (!bestMatch || bestMatch.score <= 0) {
    return {
      probableHsCode: "8479.89",
      confidence: "low",
      method: "fallback-seed-classification",
      rationale:
        "No direct keyword match was found, so the app returned a low-confidence seed classification.",
    };
  }

  const bestScore = bestMatch.score;
  const confidence =
    bestScore >= 3 ? "high" : bestScore === 2 ? "medium" : "low";
  const matchedTerms = [
    ...bestMatch.matchedPhrases,
    ...bestMatch.matchedKeywords.filter(
      (keyword) => !bestMatch.matchedPhrases.includes(keyword),
    ),
  ];
  const euCoverageNote =
    destinationCountry === "European Union" &&
    bestMatch.profile.euPriority === "ambiguous"
      ? " Additional product detail will still be required before a verified EU tariff row can be returned."
      : "";

  return {
    probableHsCode: bestMatch.profile.probableHsCode,
    confidence,
    method: "keyword-match",
    rationale: `Matched ${bestMatch.profile.label.toLowerCase()} terms: ${matchedTerms.join(
      ", ",
    )}.${euCoverageNote}`,
  };
}

export function resolveLookupClassification(input: {
  hsCode: string | null;
  productDescription: string | null;
  destinationCountry: string;
}): ResolvedLookupClassification {
  const normalizedProductDescription = input.productDescription
    ? normalizeDescription(input.productDescription)
    : null;

  if (input.hsCode) {
    const normalizedHsCode = normalizeHsCode(input.hsCode);

    return {
      normalizedHsCode,
      normalizedProductDescription,
      submittedHsCode: input.hsCode,
      inputMode: normalizedProductDescription ? "hsCode+description" : "hsCode",
      classification: {
        probableHsCode: normalizedHsCode,
        confidence: "provided",
        method: normalizedProductDescription
          ? "user-supplied-hs-code-with-description"
          : "user-supplied-hs-code",
        rationale: normalizedProductDescription
          ? "Using the supplied HS code and retaining the product description as supporting context."
          : "Using the supplied HS code directly.",
      },
    };
  }

  const classification = resolveClassificationFromDescription(
    normalizedProductDescription || "",
    input.destinationCountry,
  );

  return {
    normalizedHsCode: classification.probableHsCode,
    normalizedProductDescription,
    submittedHsCode: null,
    inputMode: "description",
    classification,
  };
}
