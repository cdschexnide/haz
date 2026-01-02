import { HazardousMaterialItem } from "../../../../../types";

export interface Check_A19_2_1_5_ExceptedQuantityConditionInput {
  material: HazardousMaterialItem;
  containedInChemicalKitOrFirstAidKit: boolean;
}

interface Check_A19_2_1_5_ExceptedQuantityConditionOutput {
  isExcepted: boolean;
  reason: string;
  applicableRule: string;
}

export const check_A19_2_1_5_ExceptedQuantityCondition = (
  input: Check_A19_2_1_5_ExceptedQuantityConditionInput
): Check_A19_2_1_5_ExceptedQuantityConditionOutput | undefined => {
  const A19_2_1_5ConditionA =
    input.material.hazclassDiv.startsWith("5") &&
    input.material.packingGroup === "I" &&
    !input.containedInChemicalKitOrFirstAidKit;

  const A19_2_1_5ConditionB =
    input.material.subsidiaryRisk
      .split(", ")
      .some(subsidiaryRisk => subsidiaryRisk.startsWith("5")) &&
    input.material.packingGroup === "I" &&
    !input.containedInChemicalKitOrFirstAidKit;

  if (A19_2_1_5ConditionA || A19_2_1_5ConditionB) {
    return {
      isExcepted: false,
      reason:
        "Material with a primary or subsidiary hazard of Class 5 in packing group I cannot qualify as excepted quantities.",
      applicableRule: "A19.2.1.5",
    };
  }
};
