import { table_A19_2_LimitedQuantityLimitsForHazardClass4 } from "../../../../../server/attachment19/tables/tableA19.2LimitedQuantityLimitsForHazardClasses2Through9";
import { HazardousMaterialItem } from "../../../../../types";
import { PackagingQuantityParameters } from "../../isHazardousMaterialLimitedQuantity";

interface CheckA19_3_2_5QuantityLimitsForLimitedConditionsInput {
  material: HazardousMaterialItem;
  packagingQuantities: PackagingQuantityParameters;
}

interface CheckA19_3_2_5QuantityLimitsForLimitedConditionsOutput {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

// 4.1 ==> PG II Solid 500g 5kg
// 4.1 ==> PG III Solid 1kg 10kg

export const checkA19_3_2_5QuantityLimitsForLimitedConditions = (
  input: CheckA19_3_2_5QuantityLimitsForLimitedConditionsInput
): CheckA19_3_2_5QuantityLimitsForLimitedConditionsOutput | undefined => {
  const { material } = input;

  const {
    innerPackagingQuantityIn_g,
    innerPackagingQuantityIn_kg,
    quantityPerPackageIn_g,
    quantityPerPackageIn_kg,
  } = input.packagingQuantities;

  const packingGroupIIOrIII =
    material.packingGroup === "II" || material.packingGroup === "III";

  const selfReactiveRegex = /\bself[- ]?reactive\b/i;

  const A19_3_2_5Condition =
    material.hazclassDiv === "4.1" &&
    packingGroupIIOrIII &&
    !selfReactiveRegex.test(input.material.properShippingName);

  if (!A19_3_2_5Condition) {
    return undefined;
  }

  const normalizedInnerPackagingQuantityIn_grams =
    innerPackagingQuantityIn_g ??
    (innerPackagingQuantityIn_kg ? innerPackagingQuantityIn_kg * 1000 : undefined);

  const normalizedQuantityPerPackageIn_grams =
    quantityPerPackageIn_g ??
    (quantityPerPackageIn_kg ? quantityPerPackageIn_kg * 1000 : undefined);

  if (
    typeof normalizedInnerPackagingQuantityIn_grams === "undefined" &&
    typeof normalizedQuantityPerPackageIn_grams === "undefined"
  ) {
    return {
      isApplicable: true,
      isLimited: false,
      reason:
        "Error checking limited quantities condition A19.3.2.5: Either an inner packaging quantity or a quantity per package are required to make a determination for limited quantities.",
      applicableRule: "Table A19.2",
    };
  }

  const limits =
    material.packingGroup === "II"
      ? table_A19_2_LimitedQuantityLimitsForHazardClass4["4.1"].II.solid
      : table_A19_2_LimitedQuantityLimitsForHazardClass4["4.1"].III.solid;

  if (
    typeof normalizedInnerPackagingQuantityIn_grams !== "undefined" &&
    normalizedInnerPackagingQuantityIn_grams > limits.innerPackagingQuantityLimit.g
  ) {
    return {
      isApplicable: true,
      isLimited: false,
      reason: `Per Table A19.2, the hazardous material exceeds quantity limits for inner packagings (${limits.innerPackagingQuantityLimit.g}g) for Hazard Class/Division 4.1, Packing Group ${material.packingGroup}.`,
      applicableRule: "Table A19.2",
    };
  }

  if (
    typeof normalizedQuantityPerPackageIn_grams !== "undefined" &&
    normalizedQuantityPerPackageIn_grams > limits.quantityLimitPerPackage.g
  ) {
    return {
      isApplicable: true,
      isLimited: false,
      reason: `Per Table A19.2, the hazardous material exceeds quantity limits per package (${limits.quantityLimitPerPackage.g}g) for Hazard Class/Division 4.1, Packing Group ${material.packingGroup}.`,
      applicableRule: "Table A19.2",
    };
  }

  return {
    isApplicable: true,
    isLimited: true,
    reason:
      "Material meets limited quantity requirements for Class 4.1 (excluding PG I and self-reactive substances) per Table A19.2.",
    applicableRule: "A19.3.2.5",
  };
};
