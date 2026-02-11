import { HazardousMaterialItem } from "../../../../../types";

export interface Check_A19_3_1_10_LimitedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface Check_A19_3_1_10_LimitedQuantityConditionOutput {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

export const check_A19_3_1_10_LimitedQuantityCondition = (
  input: Check_A19_3_1_10_LimitedQuantityConditionInput
): Check_A19_3_1_10_LimitedQuantityConditionOutput | undefined => {
  const authorizedUNNumbers = new Set([
    "UN2071",
    "UN1990",
    "UN3077",
    "UN3082",
    "UN3316",
    "UN1941",
    "UN3334",
    "UN3335",
  ]);

  const A19_3_1_10ConditionA = input.material.hazclassDiv === "9";
  const A19_3_1_10ConditionB = !authorizedUNNumbers.has(input.material.unid);

  if (A19_3_1_10ConditionA && A19_3_1_10ConditionB) {
    return {
      isApplicable: true,
      isLimited: false,
      reason:
        "Class 9 materials, except those authorized in A19.3.2, are not permitted for limited quantities as per A19.3.1.10.",
      applicableRule: "A19.3.1.10.",
    };
  }
};
