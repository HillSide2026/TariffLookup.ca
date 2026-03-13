import type {
  LookupClassification,
  LookupInputMode,
} from "../contracts/lookup.js";

const seedClassificationProfiles = [
  {
    probableHsCode: "8208.30",
    label: "Industrial blades and knives",
    keywords: ["knife", "knives", "blade", "blades", "stainless", "steel"],
  },
  {
    probableHsCode: "0901.21",
    label: "Roasted coffee",
    keywords: ["coffee", "beans", "roasted", "ground"],
  },
  {
    probableHsCode: "0811.90",
    label: "Frozen fruit",
    keywords: ["frozen", "blueberry", "blueberries", "berry", "berries"],
  },
  {
    probableHsCode: "6109.10",
    label: "Cotton T-shirts",
    keywords: ["t-shirt", "shirt", "tee", "cotton", "apparel"],
  },
  {
    probableHsCode: "8501.52",
    label: "Electric motors",
    keywords: ["electric motor", "motor", "industrial motor", "rotor"],
  },
  {
    probableHsCode: "9403.60",
    label: "Wooden furniture",
    keywords: ["wood", "chair", "table", "furniture", "desk"],
  },
] as const;

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

function resolveClassificationFromDescription(
  productDescription: string,
): LookupClassification {
  const normalizedDescription = productDescription.toLowerCase();
  let bestMatch:
    | {
        probableHsCode: string;
        label: string;
        keywords: readonly string[];
      }
    | undefined;
  let bestScore = 0;
  let matchedKeywords: string[] = [];

  for (const profile of seedClassificationProfiles) {
    const profileMatches = profile.keywords.filter((keyword) =>
      normalizedDescription.includes(keyword),
    );

    if (profileMatches.length > bestScore) {
      bestMatch = profile;
      bestScore = profileMatches.length;
      matchedKeywords = profileMatches;
    }
  }

  if (!bestMatch) {
    return {
      probableHsCode: "8479.89",
      confidence: "low",
      method: "fallback-seed-classification",
      rationale:
        "No direct keyword match was found, so the app returned a low-confidence seed classification.",
    };
  }

  const confidence =
    bestScore >= 3 ? "high" : bestScore === 2 ? "medium" : "low";

  return {
    probableHsCode: bestMatch.probableHsCode,
    confidence,
    method: "keyword-match",
    rationale: `Matched ${bestMatch.label.toLowerCase()} keywords: ${matchedKeywords.join(
      ", ",
    )}.`,
  };
}

export function resolveLookupClassification(input: {
  hsCode: string | null;
  productDescription: string | null;
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
  );

  return {
    normalizedHsCode: classification.probableHsCode,
    normalizedProductDescription,
    submittedHsCode: null,
    inputMode: "description",
    classification,
  };
}
