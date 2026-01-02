import { HazardousMaterialItem } from "../../../../../types";

export interface Check_A19_3_1_7_LimitedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface Check_A19_3_1_7_LimitedQuantityConditionOutput {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

export const check_A19_3_1_7_LimitedQuantityCondition = (
  input: Check_A19_3_1_7_LimitedQuantityConditionInput
): Check_A19_3_1_7_LimitedQuantityConditionOutput | undefined => {
  const selfReactiveRegex = /\bself[- ]?reactive\b/i;

  const A19_3_1_7Condition =
    input.material.hazclassDiv.includes("4.1") &&
    selfReactiveRegex.test(input.material.properShippingName);

  if (A19_3_1_7Condition) {
    return {
      isApplicable: true,
      isLimited: false,
      reason:
        "Class 4.1 self-reactive substances are not permitted for limited quantities as per A19.3.1.7.",
      applicableRule: "A19.3.1.7.",
    };
  }
};
