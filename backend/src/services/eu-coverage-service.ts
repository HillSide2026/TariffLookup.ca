import { canonicalizeHsCode } from "./classification-service.js";

type EuAmbiguityGuidance = {
  reason: string;
  requestedDetails: string[];
  suggestedPrompt: string;
};

const euAmbiguityGuidanceByHsCode: Record<string, EuAmbiguityGuidance> = {
  "081190": {
    reason:
      "The official EU source returns multiple frozen-fruit branches under HS 0811.90 with materially different duty formulas, so the prototype cannot safely collapse them into one verified EU tariff row yet.",
    requestedDetails: [
      "the exact fruit or fruit mixture",
      "whether sugar, spirit, or other sweetening has been added",
      "whether the goods are whole fruit, pulp, or another prepared form",
      "any product specs that narrow the CN branch",
    ],
    suggestedPrompt:
      "Describe the exact frozen fruit, whether it contains added sugar or spirit, and how it is prepared.",
  },
  "850152": {
    reason:
      "The official EU source returns multiple motor branches and end-use contexts under HS 8501.52, so the prototype needs more product detail before it can return a verified EU tariff row.",
    requestedDetails: [
      "motor use or application, such as civil aircraft, conveyor equipment, or general industrial machinery",
      "power rating and current type",
      "whether the motor is imported on its own or as part of a larger machine",
      "any special end-use or certification program that applies",
    ],
    suggestedPrompt:
      "Describe the motor's application, power rating, and whether it is for a special end use such as civil aircraft.",
  },
  "691200": {
    reason:
      "The official EU source splits ceramic tableware and kitchenware under HS 6912.00 across material and quality branches with different duty outcomes, so the prototype cannot safely return one verified EU tariff row without more product detail.",
    requestedDetails: [
      "material type such as porcelain, china, stoneware, earthenware, or handmade ceramic",
      "whether the goods are tableware, kitchenware, ornamental ware, or another ceramic article",
      "whether the goods are a retail set or individual pieces",
      "any product specs that narrow the CN branch",
    ],
    suggestedPrompt:
      "Describe the ceramic article material, whether it is tableware or kitchenware, and whether it is sold as a set or as individual pieces.",
  },
  "821599": {
    reason:
      "The official EU source splits kitchen utensils under HS 8215.99 by stainless-steel versus other material branches, so the prototype needs more product detail before it can return a verified EU tariff row.",
    requestedDetails: [
      "utensil material and whether the goods are stainless steel or another base material",
      "the exact utensil type, such as tongs, ladle, spatula, whisk, or serving tool",
      "whether the goods are imported individually or in sets",
      "any product specs that narrow the CN branch",
    ],
    suggestedPrompt:
      "Describe the utensil material, the exact utensil type, and whether the goods are individual pieces or a set.",
  },
  "630710": {
    reason:
      "The official EU source splits cleaning-cloth goods under HS 6307.10 across knitted, nonwoven, hand-made, and other textile branches with materially different duty outcomes, so the prototype cannot safely return one verified EU tariff row yet.",
    requestedDetails: [
      "fabric construction, such as knitted, woven, or nonwoven",
      "material type, such as cotton, microfiber, or another textile",
      "whether the article is a cleaning cloth, polishing cloth, shop towel, or another textile form",
      "any product specs that narrow the CN branch",
    ],
    suggestedPrompt:
      "Describe the cloth construction, material, and whether it is a cleaning cloth, polishing cloth, or shop towel.",
  },
};

export function getEuAmbiguityGuidance(hsCode: string) {
  return euAmbiguityGuidanceByHsCode[canonicalizeHsCode(hsCode)] || null;
}
