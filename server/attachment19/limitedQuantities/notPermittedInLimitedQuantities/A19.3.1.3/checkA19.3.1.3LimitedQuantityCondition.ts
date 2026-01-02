import { HazardousMaterialItem } from "../../../../../types";

export interface CheckA19_3_1_3LimitedQuantityConditionInput {
  material: HazardousMaterialItem;
}

interface CheckA19_3_1_3LimitedQuantityConditionOutput {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

export function check_A19_3_1_3_LimitedQuantityCondition(
  input: CheckA19_3_1_3LimitedQuantityConditionInput
): CheckA19_3_1_3LimitedQuantityConditionOutput | undefined {
  const A19_3_1_3ConditionA =
    input.material.unid === "UN0012" &&
    /cartridges, small arms/i.test(input.material.properShippingName);

  const A19_3_1_3ConditionB =
    input.material.unid === "UN0323" &&
    /cartridges, power device/i.test(input.material.properShippingName);

  const A19_3_1_3ConditionC =
    input.material.hazclassDiv.startsWith("1") ||
    input.material.hazclassDiv.startsWith("7");

  if (!A19_3_1_3ConditionA && !A19_3_1_3ConditionB && A19_3_1_3ConditionC) {
    return {
      isApplicable: true,
      isLimited: false,
      reason:
        "Class 1 and 7 materials (except as provided in 49 CFR Section 173.63.) are not permitted for limited quantities as per A19.3.1.3.",
      applicableRule: "A19.3.1.3.",
    };
  }
}
