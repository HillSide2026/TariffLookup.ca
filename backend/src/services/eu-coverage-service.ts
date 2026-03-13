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
};

export function getEuAmbiguityGuidance(hsCode: string) {
  return euAmbiguityGuidanceByHsCode[canonicalizeHsCode(hsCode)] || null;
}
