import { check_A19_3_1_3_LimitedQuantityCondition } from "./notPermittedInLimitedQuantities/A19.3.1.3/checkA19.3.1.3LimitedQuantityCondition";
import { checkA19_3_2_10QuantityLimitsForLimitedConditions } from "./permittedInLimitedQuantities/A19.3.2.10/checkA19.3.2.10LimitedQuantityCondition";
import { checkA19_3_2_11QuantityLimitsForLimitedConditions } from "./permittedInLimitedQuantities/A19.3.2.11/checkA19.3.2.11LimitedQuantityCondition";
import { checkA19_3_2_3QuantityLimitsForLimitedConditions } from "./permittedInLimitedQuantities/A19.3.2.3/checkA19.3.2.3LimitedQuantityCondition";
import { checkA19_3_2_4QuantityLimitsForLimitedConditions } from "./permittedInLimitedQuantities/A19.3.2.4/checkA19.3.2.4LimitedQuantityCondition";
import { checkA19_3_2_5QuantityLimitsForLimitedConditions } from "./permittedInLimitedQuantities/A19.3.2.5/checkA19.3.2.5LimitedQuantityCondition";
import { checkA19_3_2_6QuantityLimitsForLimitedConditions } from "./permittedInLimitedQuantities/A19.3.2.6/checkA19.3.2.6LimitedQuantityCondition";
import { checkA19_3_2_7QuantityLimitsForLimitedConditions } from "./permittedInLimitedQuantities/A19.3.2.7/checkA19.3.2.7LimitedQuantityCondition";
import { checkA19_3_2_8QuantityLimitsForLimitedConditions } from "./permittedInLimitedQuantities/A19.3.2.8/checkA19.3.2.8LimitedQuantityCondition";
import { checkA19_3_2_9QuantityLimitsForLimitedConditions } from "./permittedInLimitedQuantities/A19.3.2.9/checkA19.3.2.9LimitedQuantityCondition";
// import {
//   checkA19_3_3_1,
//   CheckA19_3_3_1Input,
// } from "./differentHazardousMaterialsInOnePackage/A19.3.3.1/A19.3.3.1";
// import {
//   checkA19_3_3_2,
//   CheckA19_3_3_2Input,
// } from "./differentHazardousMaterialsInOnePackage/A19.3.3.2/A19.3.3.2";
// import {
//   checkA19_3_3_3,
//   CheckA19_3_3_3Input,
// } from "./differentHazardousMaterialsInOnePackage/A19.3.3.3/A19.3.3.3";
import { check_A19_3_1_1_LimitedQuantityCondition } from "./notPermittedInLimitedQuantities/A19.3.1.1/checkA19.3.1.1LimitedQuantityCondition";
import { check_A19_3_1_2_LimitedQuantityCondition } from "./notPermittedInLimitedQuantities/A19.3.1.2/checkA19.3.1.2LimitedQuantityCondition";
import { check_A19_3_1_4_LimitedQuantityCondition } from "./notPermittedInLimitedQuantities/A19.3.1.4/checkA19.3.1.4LimitedQuantityCondition";
import { check_A19_3_1_5_LimitedQuantityCondition } from "./notPermittedInLimitedQuantities/A19.3.1.5/checkA19.3.1.5LimitedQuantityCondition";
import { check_A19_3_1_6_LimitedQuantityCondition } from "./notPermittedInLimitedQuantities/A19.3.1.6/checkA19.3.1.6LimitedQuantityCondition";
import { check_A19_3_1_7_LimitedQuantityCondition } from "./notPermittedInLimitedQuantities/A19.3.1.7/checkA19.3.1.7LimitedQuantityCondition";
import { check_A19_3_1_8_LimitedQuantityCondition } from "./notPermittedInLimitedQuantities/A19.3.1.8/checkA19.3.1.8LimitedQuantityCondition";
import { check_A19_3_1_9_LimitedQuantityCondition } from "./notPermittedInLimitedQuantities/A19.3.1.9/checkA19.3.1.9LimitedQuantityCondition";
import { check_A19_3_1_10_LimitedQuantityCondition } from "./notPermittedInLimitedQuantities/A19.3.1.10/checkA19.3.1.10LimitedQuantityCondition";
import { check_A19_3_1_11_LimitedQuantityCondition } from "./notPermittedInLimitedQuantities/A19.3.1.11/checkA19.3.1.11LimitedQuantityCondition";
import { PhysicalState, HazardousMaterialItem } from "../../../types";
import { checkA19_3_2_2QuantityLimitsForLimitedConditions } from "./permittedInLimitedQuantities/A19.3.2.2/checkA19.3.2.2LimitedQuantityCondition";

export interface PackagingQuantityParameters {
  physicalState?: PhysicalState;
  packagingType?: string;
  containedInPolyesterResinKitOrChemicalKitOrFirstAidKit?: boolean;
  innerPackagingVolumeIn_mL?: number;
  innerPackagingVolumeIn_L?: number;
  innerPackagingQuantityIn_g?: number;
  innerPackagingQuantityIn_kg?: number;
  grossQuantityPerPackageIn_g?: number;
  grossQuantityPerPackageIn_kg?: number;
  quantityPerPackageIn_mL?: number;
  quantityPerPackageIn_L?: number;
  quantityPerPackageIn_g?: number;
  quantityPerPackageIn_kg?: number;
}

interface HazardousMaterialItemLimitedQuantityParameters {
  material: HazardousMaterialItem;
  packagingQuantities: PackagingQuantityParameters;
}

export interface IsHazardousMaterialLimitedQuantityInput {
  materials: HazardousMaterialItemLimitedQuantityParameters[];
}

export interface IsHazardousMaterialLimitedQuantityOutput {
  isApplicable: boolean;
  isLimited: boolean | undefined;
  reason: string | undefined;
  applicableRule: string;
}

/**
 * Function to determine if a hazardous material qualifies as a limited quantity.
 * @param material - The hazardous material to check.
 * @returns An object indicating whether the material is a limited quantity, the reason, and the applicable rule.
 */
export function isHazardousMaterialLimitedQuantity(
  input: IsHazardousMaterialLimitedQuantityInput
): IsHazardousMaterialLimitedQuantityOutput | undefined {
  try {
    // A19.3.1. Dangerous Goods not Permitted in Limited Quantities
    const notPermittedAsLimitedQuantitiesConditions = [
      check_A19_3_1_1_LimitedQuantityCondition,
      check_A19_3_1_2_LimitedQuantityCondition,
      check_A19_3_1_3_LimitedQuantityCondition,
      check_A19_3_1_4_LimitedQuantityCondition,
      check_A19_3_1_5_LimitedQuantityCondition,
      check_A19_3_1_6_LimitedQuantityCondition,
      check_A19_3_1_7_LimitedQuantityCondition,
      check_A19_3_1_8_LimitedQuantityCondition,
      check_A19_3_1_9_LimitedQuantityCondition,
      check_A19_3_1_10_LimitedQuantityCondition,
      check_A19_3_1_11_LimitedQuantityCondition,
    ];

    for (const condition of notPermittedAsLimitedQuantitiesConditions) {
      for (const { material } of input.materials) {
        const result = condition({ material });
        if (
          typeof result !== "undefined" &&
          result.isApplicable &&
          !result.isLimited
        ) {
          return {
            isApplicable: result.isApplicable,
            isLimited: result.isLimited,
            reason: result.reason,
            applicableRule: result.applicableRule,
          };
        }
      }
    }

    // A19.3.2. Dangerous Goods Permitted in Limited Quantities
    const permittedAsLimitedQuantitiesConditions = [
      checkA19_3_2_2QuantityLimitsForLimitedConditions,
      checkA19_3_2_3QuantityLimitsForLimitedConditions,
      checkA19_3_2_4QuantityLimitsForLimitedConditions,
      checkA19_3_2_5QuantityLimitsForLimitedConditions,
      checkA19_3_2_6QuantityLimitsForLimitedConditions,
      checkA19_3_2_7QuantityLimitsForLimitedConditions,
      checkA19_3_2_8QuantityLimitsForLimitedConditions,
      checkA19_3_2_9QuantityLimitsForLimitedConditions,
      checkA19_3_2_10QuantityLimitsForLimitedConditions,
      checkA19_3_2_11QuantityLimitsForLimitedConditions,
    ];

    for (const condition of permittedAsLimitedQuantitiesConditions) {
      for (const materialAndQuantity of input.materials) {
        const result = condition(materialAndQuantity);
        // console.log("result: ", JSON.stringify(result, null, 2));
        if (typeof result !== "undefined" && result.isApplicable) {
          return {
            isApplicable: result.isApplicable,
            isLimited: result.isLimited,
            reason: result.reason,
            applicableRule: result.applicableRule,
          };
        }
      }
    }

    // // A19.3.3. Different Dangerous Goods in Limited Quantities in one Package

    // // A19.3.3.1
    // const checkA19_3_3_1Result = checkA19_3_3_1({
    //   materials: input.materials,
    // } as CheckA19_3_3_1Input);
    // if (
    //   typeof checkA19_3_3_1Result !== "undefined" &&
    //   checkA19_3_3_1Result.isApplicable &&
    //   !checkA19_3_3_1Result.isLimited
    // ) {
    //   return {
    //     isApplicable: checkA19_3_3_1Result.isApplicable,
    //     isLimited: checkA19_3_3_1Result.isLimited,
    //     reason: checkA19_3_3_1Result.reason,
    //     applicableRule: checkA19_3_3_1Result.applicableRule,
    //   };
    // }

    // // A19.3.3.2
    // const checkA19_3_3_2Result = checkA19_3_3_2({
    //   materials: input.materials,
    // } as CheckA19_3_3_2Input);
    // if (
    //   typeof checkA19_3_3_2Result !== "undefined" &&
    //   checkA19_3_3_2Result.isApplicable &&
    //   !checkA19_3_3_2Result.isLimited
    // ) {
    //   return {
    //     isApplicable: checkA19_3_3_2Result.isApplicable,
    //     isLimited: checkA19_3_3_2Result.isLimited,
    //     reason: checkA19_3_3_2Result.reason,
    //     applicableRule: checkA19_3_3_2Result.applicableRule,
    //   };
    // }

    // // A19.3.3.3
    // const checkA19_3_3_3Result = checkA19_3_3_3({
    //   materials: input.materials,
    // } as CheckA19_3_3_3Input);
    // if (
    //   typeof checkA19_3_3_3Result !== "undefined" &&
    //   checkA19_3_3_3Result.isApplicable &&
    //   !checkA19_3_3_3Result.isLimited
    // ) {
    //   return {
    //     isApplicable: checkA19_3_3_3Result.isApplicable,
    //     isLimited: checkA19_3_3_3Result.isLimited,
    //     reason: checkA19_3_3_3Result.reason,
    //     applicableRule: checkA19_3_3_3Result.applicableRule,
    //   };
    // }

    return {
      isApplicable: false,
      isLimited: false,
      reason:
        "The hazardous material being prepped does not meet the criteria for a limited quantity.",
      applicableRule: "Attachment 19 - Limited Quantities",
    };
  } catch (error) {
    console.error("Error checking hazardous material limited quantity:", error);
    throw new Error(
      "An error occurred while checking the hazardous material limited quantity conditions."
    );
  }
}
