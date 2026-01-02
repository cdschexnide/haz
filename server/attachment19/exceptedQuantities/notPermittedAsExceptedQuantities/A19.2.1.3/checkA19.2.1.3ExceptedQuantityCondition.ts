import { HazardousMaterialItem } from "../../../../../types";

export interface Check_A19_2_1_3_ExceptedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface Check_A19_2_1_3_ExceptedQuantityConditionOutput {
  isExcepted: boolean;
  reason: string;
  applicableRule: string;
}

export const check_A19_2_1_3_ExceptedQuantityCondition = (
  input: Check_A19_2_1_3_ExceptedQuantityConditionInput
): Check_A19_2_1_3_ExceptedQuantityConditionOutput | undefined => {
  const A19_2_1_3ConditionA =
    input.material.hazclassDiv.startsWith("4") &&
    input.material.packingGroup === "I";

  const A19_2_1_3ConditionB =
    input.material.subsidiaryRisk
      .split(", ")
      .some(subsidiaryRisk => subsidiaryRisk.startsWith("4")) &&
    input.material.packingGroup === "I";

  if (A19_2_1_3ConditionA || A19_2_1_3ConditionB) {
    return {
      isExcepted: false,
      reason:
        "Material with a primary or subsidiary hazard of Class 4 in packing group I cannot qualify as excepted quantities.",
      applicableRule: "A19.2.1.3",
    };
  }
};
