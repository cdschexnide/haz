import { HazardousMaterialItem } from "../../../../../types";
import { PackagingQuantityParameters } from "../../isHazardousMaterialLimitedQuantity";
import { table_A19_2_LimitedQuantityLimitsForHazardClass2 } from "../../../../../server/attachment19/tables/tableA19.2LimitedQuantityLimitsForHazardClasses2Through9";

interface CheckA19_3_2_3QuantityLimitsForLimitedConditionsInput {
  material: HazardousMaterialItem;
  packagingQuantities: PackagingQuantityParameters;
}

interface CheckA19_3_2_3QuantityLimitsForLimitedConditionsOutput {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

export const checkA19_3_2_3QuantityLimitsForLimitedConditions = (
  input: CheckA19_3_2_3QuantityLimitsForLimitedConditionsInput
): CheckA19_3_2_3QuantityLimitsForLimitedConditionsOutput | undefined => {
  const { material } = input;

  const {
    innerPackagingVolumeIn_mL,
    innerPackagingVolumeIn_L,
    grossQuantityPerPackageIn_g,
    grossQuantityPerPackageIn_kg,
  } = input.packagingQuantities;

  const cryogenicLiquid = /cryogenic liquid/i;

  // Condition: Class 2.2 gases without subsidiary hazards (excluding refrigerated liquefied gases)
  const A19_3_2_3Condition =
    material.hazclassDiv === "2.2" &&
    material.subsidiaryRisk === "" &&
    !cryogenicLiquid.test(material.properShippingName);

  if (A19_3_2_3Condition) {
    // Normalize inner packaging volume to mL
    const normalizedInnerPackagingVolumeIn_mL =
      innerPackagingVolumeIn_mL ??
      (innerPackagingVolumeIn_L ? innerPackagingVolumeIn_L * 1000 : undefined);

    // Normalize gross quantity to grams
    const normalizedGrossQuantityPerPackageIn_grams =
      grossQuantityPerPackageIn_g ??
      (grossQuantityPerPackageIn_kg
        ? grossQuantityPerPackageIn_kg * 1000
        : undefined);

    if (
      typeof normalizedInnerPackagingVolumeIn_mL === "undefined" &&
      typeof normalizedGrossQuantityPerPackageIn_grams === "undefined"
    ) {
      return {
        isApplicable: true,
        isLimited: false,
        reason:
          "Error checking limited quantities condition A19.3.2.3: Either an inner packaging volume or a per package quantity is required to determine limited quantity eligibility.",
        applicableRule: "Table A19.2",
      };
    }

    // Retrieve the limits from Table A19.2
    const innerPackagingLimit_mL =
      table_A19_2_LimitedQuantityLimitsForHazardClass2["2"]?.gas
        ?.innerPackagingVolumeLimit?.mL ?? 120;

    const grossQuantityLimit_g =
      table_A19_2_LimitedQuantityLimitsForHazardClass2["2"]?.gas
        ?.grossQuantityLimitPerPackage?.g ?? 30000; // Default to 30kg (converted to grams)

    if (
      typeof normalizedInnerPackagingVolumeIn_mL !== "undefined" &&
      normalizedInnerPackagingVolumeIn_mL > innerPackagingLimit_mL
    ) {
      return {
        isApplicable: true,
        isLimited: false,
        reason: `Per Table A19.2, the hazardous material exceeds the volume limits for inner packagings (${innerPackagingLimit_mL} mL) for Hazard Class 2.2.`,
        applicableRule: "Table A19.2",
      };
    }

    if (
      typeof normalizedGrossQuantityPerPackageIn_grams !== "undefined" &&
      normalizedGrossQuantityPerPackageIn_grams > grossQuantityLimit_g
    ) {
      return {
        isApplicable: true,
        isLimited: false,
        reason: `Per Table A19.2, the hazardous material exceeds the gross quantity limits per package (${
          grossQuantityLimit_g / 1000
        } kg) for Hazard Class 2.2.`,
        applicableRule: "Table A19.2",
      };
    }

    return {
      isApplicable: true,
      isLimited: true,
      reason: `Material meets limited quantity requirements for Class 2.2 gases per Table A19.2.`,
      applicableRule: "Table A19.2",
    };
  }

  return undefined; // Not applicable for limited quantities
};
