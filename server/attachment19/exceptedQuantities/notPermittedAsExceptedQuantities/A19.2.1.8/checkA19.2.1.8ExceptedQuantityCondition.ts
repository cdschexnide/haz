import { HazardousMaterialItem } from "../../../../../types";

export interface Check_A19_2_1_8_ExceptedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface Check_A19_2_1_8_ExceptedQuantityConditionOutput {
  isExcepted: boolean;
  reason: string;
  applicableRule: string;
}

export const check_A19_2_1_8_ExceptedQuantityCondition = (
  input: Check_A19_2_1_8_ExceptedQuantityConditionInput
): Check_A19_2_1_8_ExceptedQuantityConditionOutput | undefined => {
  const A19_2_1_8ConditionA = input.material.hazclassDiv.startsWith("7");

  const A19_2_1_8ConditionB =
    input.material.subsidiaryRisk
      .split(", ")
      .some(subsidiaryRisk => subsidiaryRisk.includes("7")) &&
    input.material.unid !== "UN3507";

  if (A19_2_1_8ConditionA || A19_2_1_8ConditionB) {
    return {
      isExcepted: false,
      reason:
        "Class 7 Radioactive material cannot qualify as excepted quantities, other than when radioactive material is excepted packages with an associated risk of another class.",
      applicableRule: "A19.2.1.8",
    };
  }
};
