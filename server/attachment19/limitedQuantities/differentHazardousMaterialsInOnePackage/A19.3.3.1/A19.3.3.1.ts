import { HazardousMaterialItem } from "../../../../../types";
import { PackagingQuantityParameters } from "../../isHazardousMaterialLimitedQuantity";
import {
  table_A19_2_LimitedQuantityLimitsForHazardClass3,
  table_A19_2_LimitedQuantityLimitsForHazardClass4,
  table_A19_2_LimitedQuantityLimitsForHazardClass5,
  table_A19_2_LimitedQuantityLimitsForHazardClass6,
  table_A19_2_LimitedQuantityLimitsForHazardClass8,
} from "../../../../../server/attachment19/tables/tableA19.2LimitedQuantityLimitsForHazardClasses2Through9";

type HazardClassTables = {
  [key: string]: any;
};

const quantityLimits: Record<string, HazardClassTables> = {
  "3": table_A19_2_LimitedQuantityLimitsForHazardClass3,
  "4.1": table_A19_2_LimitedQuantityLimitsForHazardClass4,
  "4.3": table_A19_2_LimitedQuantityLimitsForHazardClass4,
  "5.1": table_A19_2_LimitedQuantityLimitsForHazardClass5,
  "5.2": table_A19_2_LimitedQuantityLimitsForHazardClass5,
  "6.1": table_A19_2_LimitedQuantityLimitsForHazardClass6,
  "8": table_A19_2_LimitedQuantityLimitsForHazardClass8,
};

export interface InnerPackageHazardousMaterialItem {
  material: HazardousMaterialItem;
  packagingQuantities: PackagingQuantityParameters;
}

export interface CheckA19_3_3_1Input {
  materials: InnerPackageHazardousMaterialItem[];
}

export interface CheckA19_3_3_1Output {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

function isValidHazardClass(
  hazardClass: string
): hazardClass is keyof typeof quantityLimits {
  return Object.keys(quantityLimits).includes(hazardClass);
}

/**
 * Function to check if different dangerous goods in limited quantities meet A19.3.3.1 conditions.
 * @param input - The materials and their packaging quantities.
 * @returns An object indicating whether the condition is met, the reason, and the applicable rule.
 */
export function checkA19_3_3_1(
  input: CheckA19_3_3_1Input
): CheckA19_3_3_1Output {
  try {
    if (input.materials.length <= 1) {
      return {
        isApplicable: false,
        applicableRule: "A19.3.3.1",
      };
    }
    let lowestLimitInKg = Infinity;
    let reason = "";

    for (const { material, packagingQuantities } of input.materials) {
      const { hazclassDiv, packingGroup } = material;
      const { quantityPerPackageIn_g, quantityPerPackageIn_kg } =
        packagingQuantities;

      const normalizedQuantityInKg =
        quantityPerPackageIn_kg ?? (quantityPerPackageIn_g ?? 0) / 1000;

      if (!isValidHazardClass(hazclassDiv)) {
        return {
          isApplicable: false,
          applicableRule: "A19.3.3.1",
        };
      }

      const table = quantityLimits[hazclassDiv];
      const classLimits =
        table?.[packingGroup]?.solid?.quantityLimitPerPackage?.kg ??
        table?.[packingGroup]?.liquid?.volumeLimitPerPackage?.L;

      if (classLimits === undefined) {
        return {
          isApplicable: true,
          isLimited: false,
          reason: `No quantity limits defined for hazard class ${hazclassDiv} with packing group ${packingGroup}.`,
          applicableRule: "A19.3.3.1",
        };
      }

      if (classLimits < lowestLimitInKg) {
        lowestLimitInKg = classLimits;
        reason = `The most restrictive limit is ${lowestLimitInKg} kg, for hazard class ${hazclassDiv}.`;
      }

      if (normalizedQuantityInKg > classLimits) {
        return {
          isApplicable: true,
          isLimited: false,
          reason: `Material ${material.properShippingName} exceeds the permitted limit of ${classLimits} kg.`,
          applicableRule: "A19.3.3.1",
        };
      }
    }

    return {
      isApplicable: true,
      isLimited: true,
      reason,
      applicableRule: "A19.3.3.1",
    };
  } catch (error) {
    console.error("Error checking A19.3.3.1 conditions:", error);
    throw new Error("An error occurred while validating A19.3.3.1 conditions.");
  }
}
