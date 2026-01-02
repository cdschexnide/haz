import { HazardousMaterialItem } from "../../../../../types";

export interface Check_A19_3_1_4_LimitedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface Check_A19_3_1_4_LimitedQuantityConditionOutput {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

export const check_A19_3_1_4_LimitedQuantityCondition = (
  input: Check_A19_3_1_4_LimitedQuantityConditionInput
): Check_A19_3_1_4_LimitedQuantityConditionOutput | undefined => {
  const A19_3_1_4ConditionA = input.material.hazclassDiv === "2.3";

  const A19_3_1_4ConditionB = input.material.hazclassDiv === "6.2";

  if (A19_3_1_4ConditionA || A19_3_1_4ConditionB) {
    return {
      isApplicable: true,
      isLimited: false,
      reason:
        "Materials in Class 2.3 or Class 6.2 are not permitted for limited quantities as per A19.3.1.4.",
      applicableRule: "A19.3.1.4",
    };
  }
};
