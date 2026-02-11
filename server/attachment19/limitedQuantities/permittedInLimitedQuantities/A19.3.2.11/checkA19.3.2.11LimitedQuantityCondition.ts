import { table_A19_2_LimitedQuantityLimitsForHazardClass9 } from "../../../../../server/attachment19/tables/tableA19.2LimitedQuantityLimitsForHazardClasses2Through9";
import { HazardousMaterialItem } from "../../../../../types";
import { PackagingQuantityParameters } from "../../isHazardousMaterialLimitedQuantity";

export interface CheckA19_3_2_11QuantityLimitsForLimitedConditionsInput {
  material: HazardousMaterialItem;
  packagingQuantities: PackagingQuantityParameters;
}

interface CheckA19_3_2_11QuantityLimitsForLimitedConditionsOutput {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

export const checkA19_3_2_11QuantityLimitsForLimitedConditions = (
  input: CheckA19_3_2_11QuantityLimitsForLimitedConditionsInput
): CheckA19_3_2_11QuantityLimitsForLimitedConditionsOutput | undefined => {
  const { material } = input;

  const {
    innerPackagingVolumeIn_mL,
    innerPackagingVolumeIn_L,
    grossQuantityPerPackageIn_g,
    grossQuantityPerPackageIn_kg,
  } = input.packagingQuantities;

  const class9UnidsPermittedForLimitedQuantities = new Set([
    "UN2071",
    "UN1990",
    "UN3077",
    "UN3082",
    "UN3316",
    "UN1941",
    "UN3334",
    "UN3335",
  ]);

  const A19_3_1_11Condition = class9UnidsPermittedForLimitedQuantities.has(
    material.unid
  );
  if (!A19_3_1_11Condition) {
    return undefined;
  }

  const normalizedInnerPackagingVolumeIn_mL =
    innerPackagingVolumeIn_mL ??
    (innerPackagingVolumeIn_L ? innerPackagingVolumeIn_L * 1000 : undefined);

  const normalizedGrossQuantityPerPackageIn_g =
    grossQuantityPerPackageIn_g ??
    (grossQuantityPerPackageIn_kg ? grossQuantityPerPackageIn_kg * 1000 : undefined);

  if (
    typeof normalizedInnerPackagingVolumeIn_mL === "undefined" &&
    typeof normalizedGrossQuantityPerPackageIn_g === "undefined"
  ) {
    return {
      isApplicable: true,
      isLimited: false,
      reason:
        "Error checking limited quantities condition A19.3.2.11: Either an inner packaging volume or a per package quantity are required to make a determination for limited quantities.",
      applicableRule: "A19.3.2.11",
    };
  }

  if (
    typeof normalizedInnerPackagingVolumeIn_mL !== "undefined" &&
    normalizedInnerPackagingVolumeIn_mL >
      table_A19_2_LimitedQuantityLimitsForHazardClass9[9].III
        .innerPackagingVolumeLimit.mL
  ) {
    return {
      isApplicable: true,
      isLimited: false,
      reason:
        "Per Table A19.2, the hazardous material exceeds volume limits for inner packagings (5L) for Hazard Class 9.",
      applicableRule: "A19.3.2.11",
    };
  }

  if (
    typeof normalizedGrossQuantityPerPackageIn_g !== "undefined" &&
    normalizedGrossQuantityPerPackageIn_g >
      table_A19_2_LimitedQuantityLimitsForHazardClass9[9].III
        .grossQuantityLimitPerPackage.g
  ) {
    return {
      isApplicable: true,
      isLimited: false,
      reason:
        "Per Table A19.2, the hazardous material exceeds gross quantity limits per package (30kg G) for Hazard Class 9.",
      applicableRule: "A19.3.2.11",
    };
  }

  return {
    isApplicable: true,
    isLimited: true,
    reason:
      "Material meets limited quantity requirements for the Class 9 UNIDs authorized under A19.3.2.11.",
    applicableRule: "A19.3.2.11",
  };
};
