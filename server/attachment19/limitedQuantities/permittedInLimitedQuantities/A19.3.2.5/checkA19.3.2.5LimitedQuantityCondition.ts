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

  if (A19_3_2_5Condition) {
    // Normalize inner packaging quantity to g
    const normalizedInnerPackagingQuantityIn_grams =
      innerPackagingQuantityIn_g ??
      (innerPackagingQuantityIn_kg
        ? innerPackagingQuantityIn_kg * 1000
        : undefined);

    // Normalize quantity per package to grams
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

    if (material.packingGroup === "II") {
      if (
        typeof normalizedQuantityPerPackageIn_grams === "undefined" &&
        typeof normalizedInnerPackagingQuantityIn_grams !== "undefined" &&
        normalizedInnerPackagingQuantityIn_grams >
          table_A19_2_LimitedQuantityLimitsForHazardClass4["4.1"].II.solid
            .innerPackagingQuantityLimit.g
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason:
            "Per Table A19.2, the hazardous material exceeds quantity limits for inner packagings (500g) for Hazard Class/Division 4.1, Packing Group II.",
          applicableRule: "Table A19.2",
        };
      }

      if (
        typeof normalizedInnerPackagingQuantityIn_grams === "undefined" &&
        typeof normalizedQuantityPerPackageIn_grams !== "undefined" &&
        normalizedQuantityPerPackageIn_grams >
          table_A19_2_LimitedQuantityLimitsForHazardClass4["4.1"].II.solid
            .quantityLimitPerPackage.g
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason:
            "Per Table A19.2, the hazardous material exceeds quantity limits per package (5kg) for Hazard Class/Division 4.1, Packing Group II.",
          applicableRule: "Table A19.2",
        };
      }
    } else if (material.packingGroup === "III") {
      if (
        typeof normalizedQuantityPerPackageIn_grams === "undefined" &&
        typeof normalizedInnerPackagingQuantityIn_grams !== "undefined" &&
        normalizedInnerPackagingQuantityIn_grams >
          table_A19_2_LimitedQuantityLimitsForHazardClass4["4.1"].III.solid
            .innerPackagingQuantityLimit.g
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason:
            "Per Table A19.2, the hazardous material exceeds quantity limits for inner packagings (1kg) for Hazard Class/Division 4.1, Packing Group III.",
          applicableRule: "Table A19.2",
        };
      }

      if (
        typeof normalizedInnerPackagingQuantityIn_grams === "undefined" &&
        typeof normalizedQuantityPerPackageIn_grams !== "undefined" &&
        normalizedQuantityPerPackageIn_grams >
          table_A19_2_LimitedQuantityLimitsForHazardClass4["4.1"].III.solid
            .quantityLimitPerPackage.g
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason:
            "Per Table A19.2, the hazardous material exceeds quantity limits per package (10kg) for Hazard Class/Division 4.1, Packing Group III.",
          applicableRule: "Table A19.2",
        };
      }
    }
  }
};
