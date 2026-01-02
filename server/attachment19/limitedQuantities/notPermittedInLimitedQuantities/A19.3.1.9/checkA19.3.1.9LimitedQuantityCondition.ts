import { HazardousMaterialItem } from "../../../../../types";

export interface Check_A19_3_1_9_LimitedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface Check_A19_3_1_9_LimitedQuantityConditionOutput {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

export const check_A19_3_1_9_LimitedQuantityCondition = (
  input: Check_A19_3_1_9_LimitedQuantityConditionInput
): Check_A19_3_1_9_LimitedQuantityConditionOutput | undefined => {
  const unidsNotPermittedForLimitedQuantities = new Set([
    "UN2794",
    "UN2795",
    "UN2803",
    "UN2809",
    "UN3028",
  ]);

  const A19_3_1_9Condition = unidsNotPermittedForLimitedQuantities.has(
    input.material.unid
  );

  if (A19_3_1_9Condition) {
    return {
      isApplicable: true,
      isLimited: false,
      reason:
        "Class 8 materials with UN numbers of 2794, 2795, 2803, 2809, or 3028 are not permitted for limited quantities as per A19.3.1.9.",
      applicableRule: "A19.3.1.9.",
    };
  }
};
