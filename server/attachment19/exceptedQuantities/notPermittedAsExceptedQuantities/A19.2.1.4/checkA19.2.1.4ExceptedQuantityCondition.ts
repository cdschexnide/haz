import { HazardousMaterialItem } from "../../../../../types";

export interface Check_A19_2_1_4_ExceptedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface Check_A19_2_1_4_ExceptedQuantityConditionOutput {
  isExcepted: boolean;
  reason: string;
  applicableRule: string;
}

export const check_A19_2_1_4_ExceptedQuantityCondition = (
  input: Check_A19_2_1_4_ExceptedQuantityConditionInput
): Check_A19_2_1_4_ExceptedQuantityConditionOutput | undefined => {
  const selfReactiveRegex = /\bself[- ]?reactive\b/i;

  const A19_2_1_4Condition =
    input.material.hazclassDiv.includes("4.1") &&
    selfReactiveRegex.test(input.material.properShippingName);

  if (A19_2_1_4Condition) {
    return {
      isExcepted: false,
      reason:
        "Class 4.1 self-reactive materials cannot qualify as excepted quantities.",
      applicableRule: "A19.2.1.4",
    };
  }
};
