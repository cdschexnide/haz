import { table_A19_2_LimitedQuantityLimitsForHazardClass6 } from "../../../../../server/attachment19/tables/tableA19.2LimitedQuantityLimitsForHazardClasses2Through9";
import { HazardousMaterialItem, PhysicalState } from "../../../../../types";
import { PackagingQuantityParameters } from "../../isHazardousMaterialLimitedQuantity";

interface CheckA19_3_2_9QuantityLimitsForLimitedConditionsInput {
  material: HazardousMaterialItem;
  packagingQuantities: PackagingQuantityParameters;
}

interface CheckA19_3_2_9QuantityLimitsForLimitedConditionsOutput {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

/*
  6.1
    - PG II Liquid 
        - Inner Packaging Limited Quantity Limit = 100mL 
        - Per Package Limited Quantity Limit = 1L
    - PG II Solid
        - Inner Packaging Limited Quantity Limit = 500g
        - Per Package Limited Quantity Limit = 1kg
    - PG III Liquid
        - Inner Packaging Limited Quantity Limit = 500mL
        - Per Package Limited Quantity Limit = 2L
    - PG III Solid
        - Inner Packaging Limited Quantity Limit = 1kg
        - Per Package Limited Quantity Limit = 10kg
*/

export const checkA19_3_2_9QuantityLimitsForLimitedConditions = (
  input: CheckA19_3_2_9QuantityLimitsForLimitedConditionsInput
): CheckA19_3_2_9QuantityLimitsForLimitedConditionsOutput | undefined => {
  const { material } = input;

  const {
    physicalState,
    innerPackagingVolumeIn_mL,
    innerPackagingVolumeIn_L,
    innerPackagingQuantityIn_g,
    innerPackagingQuantityIn_kg,
    quantityPerPackageIn_mL,
    quantityPerPackageIn_L,
    quantityPerPackageIn_g,
    quantityPerPackageIn_kg,
  } = input.packagingQuantities;

  const packingGroupIIOrIII =
    material.packingGroup === "II" || material.packingGroup === "III";

  const A19_3_2_9Condition =
    material.hazclassDiv === "6.1" && packingGroupIIOrIII;

  if (A19_3_2_9Condition) {
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

    const normalizedQuantityPerPackageIn_mL =
      quantityPerPackageIn_mL ??
      (quantityPerPackageIn_L ? quantityPerPackageIn_L * 1000 : undefined);

    if (
      (physicalState === PhysicalState.SOLID &&
        typeof normalizedInnerPackagingQuantityIn_grams === "undefined" &&
        typeof normalizedQuantityPerPackageIn_grams === "undefined") ||
      (physicalState === PhysicalState.LIQUID &&
        typeof normalizedInnerPackagingQuantityIn_mL === "undefined" &&
        typeof normalizedQuantityPerPackageIn_mL === "undefined")
    ) {
      return {
        isApplicable: true,
        isLimited: false,
        reason:
          "Error checking limited quantities condition A19.3.2.9: Either an inner packaging quantity or a quantity per package are required to make a determination for limited quantities.",
        applicableRule: "Table A19.2",
      };
    }

    if (
      physicalState === PhysicalState.SOLID &&
      material.packingGroup === "II"
    ) {
      if (
        typeof normalizedInnerPackagingQuantityIn_grams !== "undefined" &&
        normalizedInnerPackagingQuantityIn_grams >
          table_A19_2_LimitedQuantityLimitsForHazardClass6["6.1"].II.solid
            .innerPackagingQuantityLimit.g
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason:
            "Per Table A19.2, the hazardous material exceeds quantity limits for inner packagings (500g) for Hazard Class/Division 6.1, Packing Group II.",
          applicableRule: "Table A19.2",
        };
      }

      if (
        typeof normalizedInnerPackagingQuantityIn_grams !== "undefined" &&
        normalizedInnerPackagingQuantityIn_grams <=
          table_A19_2_LimitedQuantityLimitsForHazardClass6["6.1"].II.solid
            .innerPackagingQuantityLimit.g
      ) {
        return {
          isApplicable: true,
          isLimited: true,
          reason:
            "Per Table A19.2, the hazardous material satisfies the quantity limits for inner packagings (500g) for Hazard Class/Division 6.1, Packing Group II.",
          applicableRule: "Table A19.2",
        };
      }

      if (
        typeof normalizedQuantityPerPackageIn_grams !== "undefined" &&
        normalizedQuantityPerPackageIn_grams >
          table_A19_2_LimitedQuantityLimitsForHazardClass6["6.1"].II.solid
            .quantityLimitPerPackage.g
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason:
            "Per Table A19.2, the hazardous material exceeds quantity limits per package (1kg) for Hazard Class/Division 6.1, Packing Group II.",
          applicableRule: "Table A19.2",
        };
      }
      if (
        typeof normalizedQuantityPerPackageIn_grams !== "undefined" &&
        normalizedQuantityPerPackageIn_grams <=
          table_A19_2_LimitedQuantityLimitsForHazardClass6["6.1"].II.solid
            .quantityLimitPerPackage.g
      ) {
        return {
          isApplicable: true,
          isLimited: true,
          reason:
            "Per Table A19.2, the hazardous material satisfies the quantity limits per package (1kg) for Hazard Class/Division 6.1, Packing Group II.",
          applicableRule: "Table A19.2",
        };
      }
    } else if (
      physicalState === PhysicalState.LIQUID &&
      material.packingGroup === "II"
    ) {
      if (
        typeof normalizedInnerPackagingQuantityIn_mL !== "undefined" &&
        normalizedInnerPackagingQuantityIn_mL >
          table_A19_2_LimitedQuantityLimitsForHazardClass6["6.1"].II.liquid
            .innerPackagingVolumeLimit.mL
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason:
            "Per Table A19.2, the hazardous material exceeds quantity limits for inner packagings (100mL) for Hazard Class/Division 6.1, Packing Group II.",
          applicableRule: "Table A19.2",
        };
      }
      if (
        typeof normalizedInnerPackagingQuantityIn_mL !== "undefined" &&
        normalizedInnerPackagingQuantityIn_mL <=
          table_A19_2_LimitedQuantityLimitsForHazardClass6["6.1"].II.liquid
            .innerPackagingVolumeLimit.mL
      ) {
        return {
          isApplicable: true,
          isLimited: true,
          reason:
            "Per Table A19.2, the hazardous material satisfies the quantity limits for inner packagings (100mL) for Hazard Class/Division 6.1, Packing Group II.",
          applicableRule: "Table A19.2",
        };
      }

      if (
        typeof normalizedQuantityPerPackageIn_mL !== "undefined" &&
        normalizedQuantityPerPackageIn_mL >
          table_A19_2_LimitedQuantityLimitsForHazardClass6["6.1"].II.liquid
            .volumeLimitPerPackage.mL
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason:
            "Per Table A19.2, the hazardous material exceeds quantity limits per package (1L) for Hazard Class/Division 6.1, Packing Group II.",
          applicableRule: "Table A19.2",
        };
      }
      if (
        typeof normalizedQuantityPerPackageIn_mL !== "undefined" &&
        normalizedQuantityPerPackageIn_mL <=
          table_A19_2_LimitedQuantityLimitsForHazardClass6["6.1"].II.liquid
            .volumeLimitPerPackage.mL
      ) {
        return {
          isApplicable: true,
          isLimited: true,
          reason:
            "Per Table A19.2, the hazardous material satisfies the quantity limits per package (1L) for Hazard Class/Division 6.1, Packing Group II.",
          applicableRule: "Table A19.2",
        };
      }
    } else if (
      physicalState === PhysicalState.SOLID &&
      material.packingGroup === "III"
    ) {
      if (
        typeof normalizedInnerPackagingQuantityIn_grams !== "undefined" &&
        normalizedInnerPackagingQuantityIn_grams >
          table_A19_2_LimitedQuantityLimitsForHazardClass6["6.1"].III.solid
            .innerPackagingQuantityLimit.g
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason:
            "Per Table A19.2, the hazardous material exceeds quantity limits for inner packagings (1kg) for Hazard Class/Division 6.1, Packing Group III.",
          applicableRule: "Table A19.2",
        };
      }
      if (
        typeof normalizedInnerPackagingQuantityIn_grams !== "undefined" &&
        normalizedInnerPackagingQuantityIn_grams <=
          table_A19_2_LimitedQuantityLimitsForHazardClass6["6.1"].III.solid
            .innerPackagingQuantityLimit.g
      ) {
        return {
          isApplicable: true,
          isLimited: true,
          reason:
            "Per Table A19.2, the hazardous material satisfies the quantity limits for inner packagings (1kg) for Hazard Class/Division 6.1, Packing Group III.",
          applicableRule: "Table A19.2",
        };
      }

      if (
        typeof normalizedQuantityPerPackageIn_grams !== "undefined" &&
        normalizedQuantityPerPackageIn_grams >
          table_A19_2_LimitedQuantityLimitsForHazardClass6["6.1"].III.solid
            .quantityLimitPerPackage.g
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason:
            "Per Table A19.2, the hazardous material exceeds quantity limits per package (10kg) for Hazard Class/Division 6.1, Packing Group III.",
          applicableRule: "Table A19.2",
        };
      }
      if (
        typeof normalizedQuantityPerPackageIn_grams !== "undefined" &&
        normalizedQuantityPerPackageIn_grams <=
          table_A19_2_LimitedQuantityLimitsForHazardClass6["6.1"].III.solid
            .quantityLimitPerPackage.g
      ) {
        return {
          isApplicable: true,
          isLimited: true,
          reason:
            "Per Table A19.2, the hazardous material satisfies the quantity limits per package (10kg) for Hazard Class/Division 6.1, Packing Group III.",
          applicableRule: "Table A19.2",
        };
      }
    } else if (
      physicalState === PhysicalState.LIQUID &&
      material.packingGroup === "III"
    ) {
      if (
        typeof normalizedInnerPackagingQuantityIn_mL !== "undefined" &&
        normalizedInnerPackagingQuantityIn_mL >
          table_A19_2_LimitedQuantityLimitsForHazardClass6["6.1"].III.liquid
            .innerPackagingVolumeLimit.mL
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason:
            "Per Table A19.2, the hazardous material exceeds quantity limits for inner packagings (500mL) for Hazard Class/Division 6.1, Packing Group III.",
          applicableRule: "Table A19.2",
        };
      }
      if (
        typeof normalizedInnerPackagingQuantityIn_mL !== "undefined" &&
        normalizedInnerPackagingQuantityIn_mL <=
          table_A19_2_LimitedQuantityLimitsForHazardClass6["6.1"].III.liquid
            .innerPackagingVolumeLimit.mL
      ) {
        return {
          isApplicable: true,
          isLimited: true,
          reason:
            "Per Table A19.2, the hazardous material satsifies the quantity limits for inner packagings (500mL) for Hazard Class/Division 6.1, Packing Group III.",
          applicableRule: "Table A19.2",
        };
      }

      if (
        typeof normalizedQuantityPerPackageIn_mL !== "undefined" &&
        normalizedQuantityPerPackageIn_mL >
          table_A19_2_LimitedQuantityLimitsForHazardClass6["6.1"].III.liquid
            .volumeLimitPerPackage.mL
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason:
            "Per Table A19.2, the hazardous material exceeds quantity limits per package (2L) for Hazard Class/Division 6.1, Packing Group III.",
          applicableRule: "Table A19.2",
        };
      }
      if (
        typeof normalizedQuantityPerPackageIn_mL !== "undefined" &&
        normalizedQuantityPerPackageIn_mL <=
          table_A19_2_LimitedQuantityLimitsForHazardClass6["6.1"].III.liquid
            .volumeLimitPerPackage.mL
      ) {
        return {
          isApplicable: true,
          isLimited: true,
          reason:
            "Per Table A19.2, the hazardous material satisfies the quantity limits per package (2L) for Hazard Class/Division 6.1, Packing Group III.",
          applicableRule: "Table A19.2",
        };
      }
    }
  }
};
