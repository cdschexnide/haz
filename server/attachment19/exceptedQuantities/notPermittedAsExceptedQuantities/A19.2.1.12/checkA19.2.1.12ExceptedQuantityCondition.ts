import { HazardousMaterialItem } from "../../../../../types";

export interface Check_A19_2_1_12_ExceptedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface Check_A19_2_1_12_ExceptedQuantityConditionOutput {
  isExcepted: boolean;
  reason: string;
  applicableRule: string;
}

export const check_A19_2_1_12_ExceptedQuantityCondition = (
  input: Check_A19_2_1_12_ExceptedQuantityConditionInput
): Check_A19_2_1_12_ExceptedQuantityConditionOutput | undefined => {
  const specialProvisionCodeForCargoAircraftOnly = /P1/; // Regex to match "P1" anywhere in the string

  const A19_2_1_12Condition = specialProvisionCodeForCargoAircraftOnly.test(
    input.material.specialProvision
  );

  if (A19_2_1_12Condition) {
    return {
      isExcepted: false,
      reason:
        "Material marked as 'Cargo Aircraft Only' cannot qualify as excepted quantities.",
      applicableRule: "A19.2.1.12",
    };
  }
};
