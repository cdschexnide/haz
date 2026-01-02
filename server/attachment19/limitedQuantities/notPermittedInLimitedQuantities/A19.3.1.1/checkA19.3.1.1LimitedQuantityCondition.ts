import { HazardousMaterialItem } from "../../../../../types";

export interface Check_A19_3_1_1_LimitedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface Check_A19_3_1_1_LimitedQuantityConditionOutput {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

export const check_A19_3_1_1_LimitedQuantityCondition = (
  input: Check_A19_3_1_1_LimitedQuantityConditionInput
): Check_A19_3_1_1_LimitedQuantityConditionOutput | undefined => {
  const forbiddenRegex = /forbidden/i;
  const A19_3_1_1Condition = forbiddenRegex.test(
    input.material.packagingParagraph
  );

  if (A19_3_1_1Condition) {
    return {
      isApplicable: true,
      isLimited: false,
      reason:
        "This material is forbidden for limited quantities as per Table A4.1.",
      applicableRule: "A19.3.1.1",
    };
  }
};
