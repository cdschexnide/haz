/* A19.3.3.3. Class 2 and 9, when packed with other dangerous goods, may not exceed 30 Kg
(66 pounds). In addition, the maximum net quantity of all the other dangerous goods (other
than class 2 and 9) may not exceed the requirements of A19.3.3.1. */
import {
  checkA19_3_3_1,
  InnerPackageHazardousMaterialItem,
} from "../A19.3.3.1/A19.3.3.1";

export interface CheckA19_3_3_3Input {
  materials: InnerPackageHazardousMaterialItem[];
}

export interface CheckA19_3_3_3Output {
  isApplicable: boolean;
  isLimited?: boolean;
  reason?: string;
  applicableRule: string;
}

/**
 * Function to check the conditions of A19.3.3.3.
 * @param input - The materials and their packaging quantities.
 * @returns An object indicating whether the condition is met, the reason, and the applicable rule.
 */
export function checkA19_3_3_3(
  input: CheckA19_3_3_3Input
): CheckA19_3_3_3Output | undefined {
  try {
    if (input.materials.length === 0) {
      return undefined; // No materials to check
    }

    const maxGrossWeightKg = 30; // 30 kg limit
    let totalGrossWeightKg = 0;

    const class2And9Materials: InnerPackageHazardousMaterialItem[] = [];
    const otherMaterials: InnerPackageHazardousMaterialItem[] = [];

    // Separate Class 2/9 materials and other materials
    for (const { material, packagingQuantities } of input.materials) {
      const { hazclassDiv } = material;
      const { grossQuantityPerPackageIn_g, grossQuantityPerPackageIn_kg } =
        packagingQuantities;

      // Normalize gross weight to kilograms
      const normalizedGrossWeightKg =
        grossQuantityPerPackageIn_kg ??
        (grossQuantityPerPackageIn_g ? grossQuantityPerPackageIn_g / 1000 : 0);

      if (["2", "9"].includes(hazclassDiv)) {
        class2And9Materials.push({ material, packagingQuantities });
      } else {
        otherMaterials.push({ material, packagingQuantities });
      }

      totalGrossWeightKg += normalizedGrossWeightKg;
    }

    // If there are no Class 2 or 9 materials, return undefined
    if (class2And9Materials.length === 0) {
      return undefined;
    }

    // Check total gross weight limit for Class 2 and 9
    if (totalGrossWeightKg > maxGrossWeightKg) {
      return {
        isApplicable: true,
        isLimited: false,
        reason: `The combined gross weight of the package (${totalGrossWeightKg.toFixed(
          2
        )} kg) exceeds the maximum allowed weight of 30 kg for Class 2 and Class 9 materials.`,
        applicableRule: "A19.3.3.3",
      };
    }

    // Check conditions for other dangerous goods (excluding Class 2 and 9)
    if (otherMaterials.length > 0) {
      const otherMaterialsCheckResult = checkA19_3_3_1({
        materials: otherMaterials,
      });

      if (
        !otherMaterialsCheckResult?.isLimited // Ensure result is not undefined
      ) {
        return {
          isApplicable: true,
          isLimited: false,
          reason: `The package does not comply with the maximum net quantity requirements for other dangerous goods as per A19.3.3.1. Reason: ${
            otherMaterialsCheckResult?.reason || "Unknown restriction."
          }`,
          applicableRule: "A19.3.3.3",
        };
      }
    }

    return {
      isApplicable: true,
      isLimited: true,
      reason: `The package complies with the gross weight limit of 30 kg and the maximum net quantity requirements for other dangerous goods.`,
      applicableRule: "A19.3.3.3",
    };
  } catch (error) {
    console.error("Error checking A19.3.3.3 conditions:", error);
    throw new Error("An error occurred while validating A19.3.3.3 conditions.");
  }
}
