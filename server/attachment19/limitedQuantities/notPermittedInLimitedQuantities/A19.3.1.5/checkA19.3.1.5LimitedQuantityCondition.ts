import { HazardousMaterialItem } from "../../../../../types";

export interface Check_A19_3_1_5_LimitedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface Check_A19_3_1_5_LimitedQuantityConditionOutput {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

export const check_A19_3_1_5_LimitedQuantityCondition = (
  input: Check_A19_3_1_5_LimitedQuantityConditionInput
): Check_A19_3_1_5_LimitedQuantityConditionOutput | undefined => {
  const permittedExceptions = new Set(["UN1950", "UN2037", "UN3478", "UN3479"]);

  const A19_3_1_5ConditionA = !permittedExceptions.has(input.material.unid);
  const A19_3_1_5ConditionB = input.material.hazclassDiv === "2.1";
  const A19_3_1_5ConditionC = input.material.hazclassDiv === "2.2";

  if (A19_3_1_5ConditionA && (A19_3_1_5ConditionB || A19_3_1_5ConditionC)) {
    return {
      isApplicable: true,
      isLimited: false,
      reason:
        "Class 2.1 and 2.2 materials are not permitted for limited quantities except for specific exceptions as per A19.3.1.5.",
      applicableRule: "A19.3.1.5.",
    };
  }
};
