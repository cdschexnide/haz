import { HazardousMaterialItem } from "../../../../../types";

export interface Check_A19_3_1_6_LimitedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface Check_A19_3_1_6_LimitedQuantityConditionOutput {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

export const check_A19_3_1_6_LimitedQuantityCondition = (
  input: Check_A19_3_1_6_LimitedQuantityConditionInput
): Check_A19_3_1_6_LimitedQuantityConditionOutput | undefined => {
  const refrigeratedLiquefiedGasRegex = /cryogenic liquid/i;
  const A19_3_1_6Condition = refrigeratedLiquefiedGasRegex.test(
    input.material.properShippingName
  );

  if (A19_3_1_6Condition) {
    return {
      isApplicable: true,
      isLimited: false,
      reason:
        "Refrigerated liquefied gases are not permitted for limited quantities as per A19.3.1.6.",
      applicableRule: "A19.3.1.6.",
    };
  }
};
