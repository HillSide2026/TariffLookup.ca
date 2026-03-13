import type {
  LookupClassification,
  LookupInputMode,
} from "../contracts/lookup.js";

type ClassificationProfile = {
  probableHsCode: string;
  label: string;
  keywords: string[];
  phrases: string[];
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
  let bestMatch:
    | {
        profile: ClassificationProfile;
        matchedKeywords: string[];
        matchedPhrases: string[];
        score: number;
      }
    | undefined;

  for (const profile of seedClassificationProfiles) {
    const matchedKeywords = profile.keywords.filter((keyword) =>
      searchableDescription.includes(normalizeSearchTerm(keyword)),
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
