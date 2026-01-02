/* A19.3.3.2. Class 2 and 9, when packed without any other dangerous goods, the gross weight
of the package may not exceed 30 Kg (66 pounds). */
import { InnerPackageHazardousMaterialItem } from "../A19.3.3.1/A19.3.3.1";

export interface CheckA19_3_3_2Input {
  materials: InnerPackageHazardousMaterialItem[];
}

export interface CheckA19_3_3_2Output {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

/**
 * Function to check the conditions of A19.3.3.2.
 * @param input - The materials and their packaging quantities.
 * @returns An object indicating whether the condition is met, the reason, and the applicable rule.
 */
export function checkA19_3_3_2(
  input: CheckA19_3_3_2Input
): CheckA19_3_3_2Output | undefined {
  try {
    if (!input.materials || input.materials.length === 0) {
      return undefined;
    }

    const maxGrossWeightKg = 30;
    let totalGrossWeightKg = 0;

    // Ensure only Class 2 and 9 materials are present
    const allowedClasses = ["2", "9"];
    for (const { material, packagingQuantities } of input.materials) {
      const { hazclassDiv } = material;

      if (!allowedClasses.includes(hazclassDiv)) {
        return undefined;
      }

      const { grossQuantityPerPackageIn_g, grossQuantityPerPackageIn_kg } =
        packagingQuantities;

      // Normalize gross weight to kilograms
      const normalizedGrossWeightKg =
        grossQuantityPerPackageIn_kg ??
        (grossQuantityPerPackageIn_g ? grossQuantityPerPackageIn_g / 1000 : 0);

      totalGrossWeightKg += normalizedGrossWeightKg;
    }

    if (totalGrossWeightKg > maxGrossWeightKg) {
      return {
        isApplicable: true,
        isLimited: false,
        reason: `The combined gross weight of the package (${totalGrossWeightKg.toFixed(
          2
        )} kg) exceeds the maximum allowed weight of 30 kg for Class 2 and Class 9 materials.`,
        applicableRule: "A19.3.3.2",
      };
    }

    return {
      isApplicable: true,
      isLimited: true,
      reason: `The combined gross weight of the package (${totalGrossWeightKg.toFixed(
        2
      )} kg) is within the allowable limit of 30 kg for Class 2 and Class 9 materials.`,
      applicableRule: "A19.3.3.2",
    };
  } catch (error) {
    console.error("Error checking A19.3.3.2 conditions:", error);
    throw new Error("An error occurred while validating A19.3.3.2 conditions.");
  }
}
