import { HazardousMaterialItem } from "../../../../../types";
import { PackagingQuantityParameters } from "../../isHazardousMaterialLimitedQuantity";

interface CheckA19_3_2_2QuantityLimitsForLimitedConditionsInput {
  material: HazardousMaterialItem;
  packagingQuantities: PackagingQuantityParameters;
}

interface CheckA19_3_2_2QuantityLimitsForLimitedConditionsOutput {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

export const checkA19_3_2_2QuantityLimitsForLimitedConditions = (
  input: CheckA19_3_2_2QuantityLimitsForLimitedConditionsInput
): CheckA19_3_2_2QuantityLimitsForLimitedConditionsOutput | undefined => {
  const { material } = input;

  const {
    innerPackagingVolumeIn_mL,
    innerPackagingVolumeIn_L,
    grossQuantityPerPackageIn_g,
    grossQuantityPerPackageIn_kg,
  } = input.packagingQuantities;

  const aerosolsRegex = /aerosols/i;

  const isClass2_1_or_2_2 =
    material.hazclassDiv === "2.1" || material.hazclassDiv === "2.2";

  const isAerosol = aerosolsRegex.test(material.properShippingName);
  const hasNoSubsidiaryRisk = material.subsidiaryRisk === "";

  const isConditionA =
    material.unid === "UN1950" &&
    isAerosol &&
    isClass2_1_or_2_2 &&
    hasNoSubsidiaryRisk;

  const isConditionB =
    material.unid === "UN2037" && isClass2_1_or_2_2 && hasNoSubsidiaryRisk;

  const isConditionC = material.unid === "UN3478";
  const isConditionD = material.unid === "UN3479";

  if (isConditionA || isConditionB || isConditionC || isConditionD) {
    // Normalize inner packaging volume to mL
    const normalizedInnerPackagingVolumeIn_mL =
      innerPackagingVolumeIn_mL ??
      (innerPackagingVolumeIn_L ? innerPackagingVolumeIn_L * 1000 : undefined);

    // Normalize gross quantity to g
    const normalizedGrossQuantityPerPackageIn_g =
      grossQuantityPerPackageIn_g ??
      (grossQuantityPerPackageIn_kg
        ? grossQuantityPerPackageIn_kg * 1000
        : undefined);

    // Error handling: At least one quantity must be provided
    if (
      typeof normalizedInnerPackagingVolumeIn_mL === "undefined" &&
      typeof normalizedGrossQuantityPerPackageIn_g === "undefined"
    ) {
      return {
        isApplicable: true,
        isLimited: false,
        reason:
          "Error: Either an inner packaging volume or a per package quantity is required to determine limited quantities.",
        applicableRule: "A19.3.2.2",
      };
    }

    // **Check Inner Packaging Limits** (Based on Table A19.2 Notes)
    if (
      typeof normalizedInnerPackagingVolumeIn_mL !== "undefined" &&
      normalizedInnerPackagingVolumeIn_mL > 1000 // **Aerosols cannot exceed 1000mL per Note 3**
    ) {
      return {
        isApplicable: true,
        isLimited: false,
        reason: `Per Table A19.2, the hazardous material exceeds inner packaging volume limits (1000mL) for aerosols.`,
        applicableRule: "Table A19.2",
      };
    }

    // **Check Gross Quantity Limits per Package** (30kg G)
    if (
      typeof normalizedGrossQuantityPerPackageIn_g !== "undefined" &&
      normalizedGrossQuantityPerPackageIn_g > 30000 // **30kg limit per Table A19.2**
    ) {
      return {
        isApplicable: true,
        isLimited: false,
        reason: `Per Table A19.2, the hazardous material exceeds gross quantity limits per package (30kg) for Class 2.`,
        applicableRule: "Table A19.2",
      };
    }

    return {
      isApplicable: true,
      isLimited: true,
      reason: `The hazardous material meets the limited quantity conditions for aerosols and fuel cell cartridges under A19.3.2.2.`,
      applicableRule: "A19.3.2.2",
    };
  }

  return undefined;
};
