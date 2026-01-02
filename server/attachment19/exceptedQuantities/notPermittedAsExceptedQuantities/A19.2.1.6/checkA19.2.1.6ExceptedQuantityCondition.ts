import { HazardousMaterialItem } from "../../../../../types";

// Special Provisions regarding Inhalation Hazards:
// 1 = This material is poisonous by inhalation in Hazard Zone A, describe as an inhalation hazard.
// 2 = This material is poisonous by inhalation in Hazard Zone B, describe as an inhalation hazard.
// 3 = This material is poisonous by inhalation in Hazard Zone C, describe as an inhalation hazard.
// 4 = This material is poisonous by inhalation in Hazard Zone D, describe as an inhalation hazard.
// 5 = If this material meets the defining criteria for a material poisonous by inhalation (49 CFR Paragraphs
//     173.116(a) or 173.133(a)) use an appropriate Class 2.3 or Class 6.1 generic PSN that identifies the
//     inhalation hazard.
// 6 = This material is poisonous by inhalation and must be described as an inhalation hazard. (T-0).

export interface Check_A19_2_1_6_ExceptedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface Check_A19_2_1_6_ExceptedQuantityConditionOutput {
  isExcepted: boolean;
  reason: string;
  applicableRule: string;
}

export const check_A19_2_1_6_ExceptedQuantityCondition = (
  input: Check_A19_2_1_6_ExceptedQuantityConditionInput
): Check_A19_2_1_6_ExceptedQuantityConditionOutput | undefined => {
  const specialProvisionRegexForInhalationToxicity = /\b[1-6]\b/; // Matches "1", "2", "3", "5", or "6"

  const A19_2_1_6ConditionA =
    input.material.hazclassDiv.includes("6.1") &&
    input.material.packingGroup === "I" &&
    specialProvisionRegexForInhalationToxicity.test(
      input.material.specialProvision
    );

  const A19_2_1_6ConditionB =
    input.material.subsidiaryRisk
      .split(", ")
      .some(subsidiaryRisk => subsidiaryRisk.includes("6.1")) &&
    input.material.packingGroup === "I" &&
    specialProvisionRegexForInhalationToxicity.test(
      input.material.specialProvision
    );

  if (A19_2_1_6ConditionA || A19_2_1_6ConditionB) {
    return {
      isExcepted: false,
      reason:
        "Material with a primary or subsidiary hazard of Class 6.1 in packing group I cannot qualify as excepted quantities.",
      applicableRule: "A19.2.1.6",
    };
  }
};
