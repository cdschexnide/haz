import { HazardousMaterialItem } from "../../../../../types";

export interface Check_A19_3_1_8_LimitedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface Check_A19_3_1_8_LimitedQuantityConditionOutput {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

export const check_A19_3_1_8_LimitedQuantityCondition = (
  input: Check_A19_3_1_8_LimitedQuantityConditionInput
): Check_A19_3_1_8_LimitedQuantityConditionOutput | undefined => {
  const A19_3_1_8ConditionA = input.material.hazclassDiv === "4.2";

  const A19_3_1_8ConditionB = input.material.subsidiaryRisk
    .split(", ")
    .some(subsidiaryRisk => subsidiaryRisk === "4.2");

  if (A19_3_1_8ConditionA || A19_3_1_8ConditionB) {
    return {
      isApplicable: true,
      isLimited: false,
      reason:
        "Class 4.2 materials or materials with a subsidiary hazard of 4.2 are not permitted for limited quantities as per A19.3.1.8.",
      applicableRule: "A19.3.1.8.",
    };
  }
};
