// import {
//   table_A3_5_PackageLimitsForExceptedLithiumIonBatteries,
//   table_A3_5_PackageLimitsForExceptedLithiumMetalBatteries,
// } from "../tables/tableA3.5PackageLimitsForLithiumBatteries";
import { HazardousMaterialItem } from "../../../types";
import { isLithiumBatteryExceptedQuantity } from "./lithiumBatteriesExceptedQuantities/isLithiumBatteryExceptedQuantity";
import { check_A19_2_1_1_ExceptedQuantityCondition } from "./notPermittedAsExceptedQuantities/A19.2.1.1/checkA19.2.1.1ExceptedQuantityCondition";
import { check_A19_2_1_10_ExceptedQuantityCondition } from "./notPermittedAsExceptedQuantities/A19.2.1.10/checkA19.2.1.10ExceptedQuantityCondition";
import { check_A19_2_1_12_ExceptedQuantityCondition } from "./notPermittedAsExceptedQuantities/A19.2.1.12/checkA19.2.1.12ExceptedQuantityCondition";
import { check_A19_2_1_2_ExceptedQuantityCondition } from "./notPermittedAsExceptedQuantities/A19.2.1.2/checkA19.2.1.2ExceptedQuantityCondition";
import { check_A19_2_1_3_ExceptedQuantityCondition } from "./notPermittedAsExceptedQuantities/A19.2.1.3/checkA19.2.1.3ExceptedQuantityCondition";
import { check_A19_2_1_4_ExceptedQuantityCondition } from "./notPermittedAsExceptedQuantities/A19.2.1.4/checkA19.2.1.4ExceptedQuantityCondition";
import { check_A19_2_1_5_ExceptedQuantityCondition } from "./notPermittedAsExceptedQuantities/A19.2.1.5/checkA19.2.1.5ExceptedQuantityCondition";
import { check_A19_2_1_6_ExceptedQuantityCondition } from "./notPermittedAsExceptedQuantities/A19.2.1.6/checkA19.2.1.6ExceptedQuantityCondition";
import { check_A19_2_1_7_ExceptedQuantityCondition } from "./notPermittedAsExceptedQuantities/A19.2.1.7/checkA19.2.1.7ExceptedQuantityCondition";
import { check_A19_2_1_8_ExceptedQuantityCondition } from "./notPermittedAsExceptedQuantities/A19.2.1.8/checkA19.2.1.8ExceptedQuantityCondition";
import { check_A19_2_1_9_ExceptedQuantityCondition } from "./notPermittedAsExceptedQuantities/A19.2.1.9/checkA19.2.1.9ExceptedQuantityCondition";
import { checkPackagingQuantityLimitsForExceptedQuantities } from "./exceptedQuantityPackagingLimits/checkPackagingQuantityLimitsForExceptedQuantities";
import {
  table_A3_5_PackageLimitsForExceptedLithiumIonBatteries,
  table_A3_5_PackageLimitsForExceptedLithiumMetalBatteries,
} from "../tables/tableA3.5PackageLimitsForLithiumBatteries";

export type LithiumBatteryExceptionParameters = {
  wattHourRating: number;
  quantityIn_Kgs: number;
  lithiumContentInGrams: number;
  numberOfLithiumBatteries: number;
};

export interface IsHazardousMaterialExceptedQuantityInput {
  material: HazardousMaterialItem;
  containedInChemicalKitOrFirstAidKit?: boolean;
  innerPackagingQuantityIn_grams?: number;
  outerPackagingQuantityIn_grams?: number;
  innerPackagingQuantityIn_mLs?: number;
  outerPackagingQuantityIn_mLs?: number;
  lithiumBatteryInput?: LithiumBatteryExceptionParameters;
}

export interface IsHazardousMaterialExceptedQuantityOutput {
  isExcepted: boolean;
  reason: string;
  applicableRule: string;
}

export function isHazardousMaterialExceptedQuantity(
  input: IsHazardousMaterialExceptedQuantityInput
): IsHazardousMaterialExceptedQuantityOutput {
  // A19.2.1 - Check for materials that are not permitted as an excepted quantity
  const conditions = [
    check_A19_2_1_1_ExceptedQuantityCondition,
    check_A19_2_1_2_ExceptedQuantityCondition,
    check_A19_2_1_3_ExceptedQuantityCondition,
    check_A19_2_1_4_ExceptedQuantityCondition,
    check_A19_2_1_6_ExceptedQuantityCondition,
    check_A19_2_1_7_ExceptedQuantityCondition,
    check_A19_2_1_8_ExceptedQuantityCondition,
    check_A19_2_1_9_ExceptedQuantityCondition,
    check_A19_2_1_10_ExceptedQuantityCondition,
    check_A19_2_1_12_ExceptedQuantityCondition,
  ];

  for (const check of conditions) {
    const result = check({
      material: input.material,
    });

    if (typeof result !== "undefined" && !result.isExcepted) {
      return {
        isExcepted: result.isExcepted,
        reason: result.reason,
        applicableRule: result.applicableRule,
      };
    }
  }

  // A19.2.1.5 - Class 5 PG I disqualification (except chemical/first aid kits)
  const resultCheckA19_2_1_5ExceptedQuantityCondition =
    check_A19_2_1_5_ExceptedQuantityCondition({
      material: input.material,
      containedInChemicalKitOrFirstAidKit:
        input.containedInChemicalKitOrFirstAidKit === true,
    });

  if (
    typeof resultCheckA19_2_1_5ExceptedQuantityCondition !== "undefined" &&
    !resultCheckA19_2_1_5ExceptedQuantityCondition.isExcepted
  ) {
    return {
      isExcepted: false,
      reason: resultCheckA19_2_1_5ExceptedQuantityCondition.reason,
      applicableRule:
        resultCheckA19_2_1_5ExceptedQuantityCondition.applicableRule,
    };
  }

  // // A3.3.9.2.3 - Check lithium battery excepted quantity conditions
  const lithiumBatteriesUNIDs: string[] = [
    "UN3480",
    "UN3481",
    "UN3090",
    "UN3091",
  ];
  if (lithiumBatteriesUNIDs.includes(input.material.unid)) {
    const lithiumBatteryExceptionCheckResult = isLithiumBatteryExceptedQuantity(
      {
        materialUnid: input.material.unid,
        lithiumBatteryInput: input.lithiumBatteryInput,
        table_A3_5_PackageLimitsForExceptedLithiumIonBatteries,
        table_A3_5_PackageLimitsForExceptedLithiumMetalBatteries,
      }
    );

    if (
      typeof lithiumBatteryExceptionCheckResult !== "undefined" &&
      !lithiumBatteryExceptionCheckResult.isExcepted
    ) {
      return {
        isExcepted: false,
        reason: lithiumBatteryExceptionCheckResult.reason,
        applicableRule: lithiumBatteryExceptionCheckResult.applicableRule,
      };
    }
  }

  // // Table A19.1 - Check excepted quantity packaging limits
  const packagingLimitsForExceptedQuantityCheckResult =
    checkPackagingQuantityLimitsForExceptedQuantities({
      material: input.material,
      innerPackagingQuantityIn_grams: input.innerPackagingQuantityIn_grams,
      outerPackagingQuantityIn_grams: input.outerPackagingQuantityIn_grams,
      innerPackagingQuantityIn_mLs: input.innerPackagingQuantityIn_mLs,
      outerPackagingQuantityIn_mLs: input.outerPackagingQuantityIn_mLs,
    });

  if (!packagingLimitsForExceptedQuantityCheckResult.isExcepted) {
    return {
      isExcepted: false,
      reason: packagingLimitsForExceptedQuantityCheckResult.reason,
      applicableRule:
        packagingLimitsForExceptedQuantityCheckResult.applicableRule,
    };
  }

  return {
    isExcepted: true,
    reason:
      "Material satisfies A19.2 excepted-quantity disqualifier and packaging quantity checks.",
    applicableRule: "A19.2",
  };
}
