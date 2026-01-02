import { HazardousMaterialItem } from "../../../../../types";

export interface Check_A19_2_1_10_ExceptedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface Check_A19_2_1_10_ExceptedQuantityConditionOutput {
  isExcepted: boolean;
  reason: string;
  applicableRule: string;
}

export const check_A19_2_1_10_ExceptedQuantityCondition = (
  input: Check_A19_2_1_10_ExceptedQuantityConditionInput
): Check_A19_2_1_10_ExceptedQuantityConditionOutput | undefined => {
  const magnetizedMaterialRegex = /\bMAGNETIZED MATERIAL\b/i;
  const carbonDioxideRegex = /\b(CARBON DIOXIDE, SOLID|DRY ICE)\b/i;

  const A19_2_1_10ConditionA = magnetizedMaterialRegex.test(
    input.material.properShippingName
  );
  const A19_2_1_10ConditionB = carbonDioxideRegex.test(
    input.material.properShippingName
  );

  if (A19_2_1_10ConditionA || A19_2_1_10ConditionB) {
    return {
      isExcepted: false,
      reason:
        "Magnetized Material (Class 9) and Carbon Dioxide Solid cannot qualify as excepted quantities.",
      applicableRule: "A19.2.1.10",
    };
  }
};
