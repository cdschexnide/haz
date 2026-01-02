import { HazardousMaterialItem } from "../../../../../types";

export interface Check_A19_2_1_7_ExceptedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface Check_A19_2_1_7_ExceptedQuantityConditionOutput {
  isExcepted: boolean;
  reason: string;
  applicableRule: string;
}

export const check_A19_2_1_7_ExceptedQuantityCondition = (
  input: Check_A19_2_1_7_ExceptedQuantityConditionInput
): Check_A19_2_1_7_ExceptedQuantityConditionOutput | undefined => {
  const A19_2_1_7Condition = input.material.hazclassDiv.includes("6.2");

  if (A19_2_1_7Condition) {
    return {
      isExcepted: false,
      reason:
        "Class 6.2 infectious substances cannot qualify as excepted quantities.",
      applicableRule: "A19.2.1.7",
    };
  }
};
