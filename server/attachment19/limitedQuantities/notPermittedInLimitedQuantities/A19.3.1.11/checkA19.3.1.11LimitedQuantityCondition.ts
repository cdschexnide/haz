import { HazardousMaterialItem } from "../../../../../types";

export interface Check_A19_3_1_11_LimitedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface Check_A19_3_1_11_LimitedQuantityConditioOutput {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

export const check_A19_3_1_11_LimitedQuantityCondition = (
  input: Check_A19_3_1_11_LimitedQuantityConditionInput
): Check_A19_3_1_11_LimitedQuantityConditioOutput | undefined => {
  const specialProvisionCodeForCargoAircraftOnly = /P1/; // Regex to match "P1" anywhere in the string

  const A19_3_1_11Condition = specialProvisionCodeForCargoAircraftOnly.test(
    input.material.specialProvision
  );

  if (A19_3_1_11Condition) {
    return {
      isApplicable: true,
      isLimited: false,
      reason:
        "Materials identified as 'Cargo Aircraft Only' in Table A4.1 are not permitted for limited quantities as per A19.3.1.11.",
      applicableRule: "A19.3.1.11.",
    };
  }
};
