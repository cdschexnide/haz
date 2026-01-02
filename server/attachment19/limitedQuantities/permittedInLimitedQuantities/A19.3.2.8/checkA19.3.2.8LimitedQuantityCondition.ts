import { table_A19_2_LimitedQuantityLimitsForHazardClass5 } from "../../../../../server/attachment19/tables/tableA19.2LimitedQuantityLimitsForHazardClasses2Through9";
import { HazardousMaterialItem, PhysicalState } from "../../../../../types";
import { PackagingQuantityParameters } from "../../isHazardousMaterialLimitedQuantity";

interface CheckA19_3_2_8QuantityLimitsForLimitedConditionsInput {
  material: HazardousMaterialItem;
  packagingQuantities: PackagingQuantityParameters;
}

interface CheckA19_3_2_8QuantityLimitsForLimitedConditionsOutput {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

/*
  5.2
    - Liquid 
        - Inner Packaging Limited Quantity Limit = 30mL 
        - Per Package Limited Quantity Limit = 1kg
    - Solid
        - Inner Packaging Limited Quantity Limit = 100g
        - Per Package Limited Quantity Limit = 1kg
*/

export const checkA19_3_2_8QuantityLimitsForLimitedConditions = (
  input: CheckA19_3_2_8QuantityLimitsForLimitedConditionsInput
): CheckA19_3_2_8QuantityLimitsForLimitedConditionsOutput | undefined => {
  const { material } = input;

  const {
    physicalState,
    containedInPolyesterResinKitOrChemicalKitOrFirstAidKit,
    innerPackagingVolumeIn_mL,
    innerPackagingVolumeIn_L,
    innerPackagingQuantityIn_g,
    innerPackagingQuantityIn_kg,
    quantityPerPackageIn_g,
    quantityPerPackageIn_kg,
  } = input.packagingQuantities;

  const packingGroupIIOrIII =
    material.packingGroup === "II" || material.packingGroup === "III";

  const A19_3_2_8Condition =
    material.hazclassDiv === "5.2" &&
    containedInPolyesterResinKitOrChemicalKitOrFirstAidKit &&
    packingGroupIIOrIII;

  if (A19_3_2_8Condition) {
    const normalizedInnerPackagingQuantityIn_grams =
      innerPackagingQuantityIn_g ??
      (innerPackagingQuantityIn_kg
        ? innerPackagingQuantityIn_kg * 1000
        : undefined);

    const normalizedInnerPackagingQuantityIn_mL =
      innerPackagingVolumeIn_mL ??
      (innerPackagingVolumeIn_L ? innerPackagingVolumeIn_L * 1000 : undefined);

    const normalizedQuantityPerPackageIn_grams =
      quantityPerPackageIn_g ??
      (quantityPerPackageIn_kg ? quantityPerPackageIn_kg * 1000 : undefined);

    if (
      (physicalState === PhysicalState.SOLID &&
        typeof normalizedInnerPackagingQuantityIn_grams === "undefined" &&
        typeof normalizedQuantityPerPackageIn_grams === "undefined") ||
      (physicalState === PhysicalState.LIQUID &&
        typeof normalizedInnerPackagingQuantityIn_mL === "undefined" &&
        typeof normalizedQuantityPerPackageIn_grams === "undefined")
    ) {
      return {
        isApplicable: true,
        isLimited: false,
        reason:
          "Error checking limited quantities condition A19.3.2.8: Either an inner packaging quantity or a quantity per package are required to make a determination for limited quantities.",
        applicableRule: "Table A19.2",
      };
    }

    if (physicalState === PhysicalState.SOLID) {
      if (
        typeof normalizedQuantityPerPackageIn_grams === "undefined" &&
        typeof normalizedInnerPackagingQuantityIn_grams !== "undefined" &&
        normalizedInnerPackagingQuantityIn_grams >
          table_A19_2_LimitedQuantityLimitsForHazardClass5["5.2"].solid
            .innerPackagingQuantityLimit.g
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason:
            "Per Table A19.2, the hazardous material exceeds quantity limits for inner packagings (30mL) for Hazard Class/Division 5.2.",
          applicableRule: "Table A19.2",
        };
      }

      if (
        typeof normalizedInnerPackagingQuantityIn_grams === "undefined" &&
        typeof normalizedQuantityPerPackageIn_grams !== "undefined" &&
        normalizedQuantityPerPackageIn_grams >
          table_A19_2_LimitedQuantityLimitsForHazardClass5["5.2"].solid
            .quantityLimitPerPackage.g
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason:
            "Per Table A19.2, the hazardous material exceeds quantity limits per package (1kg) for Hazard Class/Division 5.2.",
          applicableRule: "Table A19.2",
        };
      }
    } else if (physicalState === PhysicalState.LIQUID) {
      if (
        typeof normalizedInnerPackagingQuantityIn_mL !== "undefined" &&
        normalizedInnerPackagingQuantityIn_mL >
          table_A19_2_LimitedQuantityLimitsForHazardClass5["5.2"].liquid
            .innerPackagingVolumeLimit.mL
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason:
            "Per Table A19.2, the hazardous material exceeds quantity limits for inner packagings (100g) for Hazard Class/Division 5.2.",
          applicableRule: "Table A19.2",
        };
      }
      if (
        typeof normalizedInnerPackagingQuantityIn_grams === "undefined" &&
        typeof normalizedQuantityPerPackageIn_grams !== "undefined" &&
        normalizedQuantityPerPackageIn_grams >
          table_A19_2_LimitedQuantityLimitsForHazardClass5["5.2"].solid
            .quantityLimitPerPackage.g
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason:
            "Per Table A19.2, the hazardous material exceeds quantity limits per package (1kg) for Hazard Class/Division 5.2.",
          applicableRule: "Table A19.2",
        };
      }
    }
  }
};
