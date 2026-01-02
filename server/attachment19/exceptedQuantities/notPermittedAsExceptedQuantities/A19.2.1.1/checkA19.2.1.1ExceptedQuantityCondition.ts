import { HazardousMaterialItem } from "../../../../../types";

export interface Check_A19_2_1_1_ExceptedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface Check_A19_2_1_1_ExceptedQuantityConditionOutput {
  isExcepted: boolean;
  reason: string;
  applicableRule: string;
}

export const check_A19_2_1_1_ExceptedQuantityCondition = (
  input: Check_A19_2_1_1_ExceptedQuantityConditionInput
): Check_A19_2_1_1_ExceptedQuantityConditionOutput | undefined => {
  const A19_2_1_1Condition = input.material.hazclassDiv.startsWith("1");

  if (A19_2_1_1Condition) {
    return {
      isExcepted: false,
      reason: "Class 1 materials cannot qualify as excepted quantities.",
      applicableRule: "A19.2.1.1",
    };
  }
};
