import { HazardousMaterialItem } from "../../../../../types";

export interface Check_A19_2_1_9_ExceptedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface Check_A19_2_1_9_ExceptedQuantityConditionOutput {
  isExcepted: boolean;
  reason: string;
  applicableRule: string;
}

export const check_A19_2_1_9_ExceptedQuantityCondition = (
  input: Check_A19_2_1_9_ExceptedQuantityConditionInput
): Check_A19_2_1_9_ExceptedQuantityConditionOutput | undefined => {
  const A19_2_1_9ApplicableUnids = ["UN2803", "UN2809"];

  const A19_2_1_9ConditionA =
    input.material.hazclassDiv.includes("8") &&
    input.material.packingGroup === "I";

  const A19_2_1_9ConditionB =
    input.material.subsidiaryRisk
      .split(", ")
      .some(subsidiaryRisk => subsidiaryRisk.includes("8")) &&
    input.material.packingGroup === "I";

  const A19_2_1_9ConditionC = A19_2_1_9ApplicableUnids.includes(
    input.material.unid
  );

  if (A19_2_1_9ConditionA || A19_2_1_9ConditionB || A19_2_1_9ConditionC) {
    return {
      isExcepted: false,
      reason:
        "Material with a primary or secondary risk of Class 8 in packing group I, UN2803, or UN2809 cannot qualify as excepted quantities.",
      applicableRule: "A19.2.1.9",
    };
  }
};
