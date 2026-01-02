import { HazardousMaterialItem } from "../../../../../types";
import { PackagingQuantityParameters } from "../../isHazardousMaterialLimitedQuantity";
import { table_A19_2_LimitedQuantityLimitsForHazardClass3 } from "../../../../../server/attachment19/tables/tableA19.2LimitedQuantityLimitsForHazardClasses2Through9";

interface CheckA19_3_2_4QuantityLimitsForLimitedConditionsInput {
  material: HazardousMaterialItem;
  packagingQuantities: PackagingQuantityParameters;
}

interface CheckA19_3_2_4QuantityLimitsForLimitedConditionsOutput {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

export const checkA19_3_2_4QuantityLimitsForLimitedConditions = (
  input: CheckA19_3_2_4QuantityLimitsForLimitedConditionsInput
): CheckA19_3_2_4QuantityLimitsForLimitedConditionsOutput | undefined => {
  const { material } = input;

  const {
    innerPackagingVolumeIn_mL,
    innerPackagingVolumeIn_L,
    quantityPerPackageIn_mL,
    quantityPerPackageIn_L,
  } = input.packagingQuantities;

  // **Ensure Packing Group I is Excluded**
  if (material.packingGroup === "I") {
    return {
      isApplicable: false,
      reason:
        "Per A19.3.2.4, Class 3 Packing Group I materials are NOT eligible for limited quantities.",
      applicableRule: "A19.3.2.4",
    };
  }

  // **Only Packing Groups II and III are allowed**
  const packingGroupIIOrIII =
    material.packingGroup === "II" || material.packingGroup === "III";

  // **Ensure Material is Class 3 and PG II or III**
  const A19_3_2_4Condition =
    material.hazclassDiv === "3" && packingGroupIIOrIII;

  if (A19_3_2_4Condition) {
    // Normalize inner packaging volume to mL
    const normalizedInnerPackagingVolumeIn_mL =
      innerPackagingVolumeIn_mL ??
      (innerPackagingVolumeIn_L ? innerPackagingVolumeIn_L * 1000 : undefined);

    // Normalize per package volume to mL
    const normalizedVolumePerPackageIn_mL =
      quantityPerPackageIn_mL ??
      (quantityPerPackageIn_L ? quantityPerPackageIn_L * 1000 : undefined);

    // **Ensure At Least One Volume Value is Provided**
    if (
      typeof normalizedInnerPackagingVolumeIn_mL === "undefined" &&
      typeof normalizedVolumePerPackageIn_mL === "undefined"
    ) {
      return {
        isApplicable: true,
        isLimited: false,
        reason:
          "Error: Either an inner packaging volume or a per package volume is required to determine limited quantities.",
        applicableRule: "Table A19.2",
      };
    }

    // **Check Packing Group II Limits (Per Table A19.2)**
    if (material.packingGroup === "II") {
      const innerPackagingLimit =
        table_A19_2_LimitedQuantityLimitsForHazardClass3[3].II.liquid
          .innerPackagingVolumeLimit.mL;
      const perPackageLimit =
        table_A19_2_LimitedQuantityLimitsForHazardClass3[3].II.liquid
          .volumeLimitPerPackage.mL;

      if (
        normalizedInnerPackagingVolumeIn_mL !== undefined &&
        normalizedInnerPackagingVolumeIn_mL > innerPackagingLimit
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason: `Per Table A19.2, the hazardous material exceeds volume limits for inner packagings (${innerPackagingLimit} mL) for Hazard Class 3, Packing Group II.`,
          applicableRule: "Table A19.2",
        };
      }

      if (
        normalizedVolumePerPackageIn_mL !== undefined &&
        normalizedVolumePerPackageIn_mL > perPackageLimit
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason: `Per Table A19.2, the hazardous material exceeds volume limits per package (${perPackageLimit} mL) for Hazard Class 3, Packing Group II.`,
          applicableRule: "Table A19.2",
        };
      }
    }

    // **Check Packing Group III Limits (Per Table A19.2)**
    if (material.packingGroup === "III") {
      const innerPackagingLimit =
        table_A19_2_LimitedQuantityLimitsForHazardClass3[3].III.liquid
          .innerPackagingVolumeLimit.mL;
      const perPackageLimit =
        table_A19_2_LimitedQuantityLimitsForHazardClass3[3].III.liquid
          .volumeLimitPerPackage.mL;

      if (
        normalizedInnerPackagingVolumeIn_mL !== undefined &&
        normalizedInnerPackagingVolumeIn_mL > innerPackagingLimit
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason: `Per Table A19.2, the hazardous material exceeds volume limits for inner packagings (${innerPackagingLimit} mL) for Hazard Class 3, Packing Group III.`,
          applicableRule: "Table A19.2",
        };
      }

      if (
        normalizedVolumePerPackageIn_mL !== undefined &&
        normalizedVolumePerPackageIn_mL > perPackageLimit
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason: `Per Table A19.2, the hazardous material exceeds volume limits per package (${perPackageLimit} mL) for Hazard Class 3, Packing Group III.`,
          applicableRule: "Table A19.2",
        };
      }
    }

    // **If All Checks Passed, Material is Limited Quantity**
    return {
      isApplicable: true,
      isLimited: true,
      reason:
        "Material meets limited quantity requirements for Class 3 (excluding PG I) per Table A19.2.",
      applicableRule: "A19.3.2.4",
    };
  }

  return undefined; // Not applicable for limited quantities
};
