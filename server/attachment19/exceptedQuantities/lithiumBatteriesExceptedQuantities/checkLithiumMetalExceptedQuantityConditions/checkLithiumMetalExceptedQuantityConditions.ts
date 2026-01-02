import { PackageLimitsForExceptedLithiumBatteriesTable } from "../../../../../server/attachment19/tables/tableA3.5PackageLimitsForLithiumBatteries";
import { LithiumBatteryExceptionParameters } from "../../isHazardousMaterialExceptedQuantity";

interface CheckLithiumMetalExceptedQuantityConditionsInput {
  inputMaterialUnid: string;
  lithiumBatteryInput: LithiumBatteryExceptionParameters;
  table_A3_5_PackageLimitsForExceptedLithiumMetalBatteries: PackageLimitsForExceptedLithiumBatteriesTable;
}

export interface CheckLithiumMetalExceptedQuantityConditionsOutput {
  isExcepted: boolean;
  reason: string;
  applicableRule: string;
}

export const checkLithiumMetalExceptedQuantityConditions = (
  input: CheckLithiumMetalExceptedQuantityConditionsInput
): CheckLithiumMetalExceptedQuantityConditionsOutput | undefined => {
  if (!["UN3090", "UN3091"].includes(input.inputMaterialUnid)) {
    return {
      isExcepted: false,
      reason:
        "Material is not a Lithium Metal Battery (UN3090, UN3091), hence not eligible for excepted quantity determination.",
      applicableRule:
        "Table A3.5. - Package limits for Excepted Lithium Batteries",
    };
  }

  if (
    typeof input.lithiumBatteryInput?.quantityIn_Kgs === "undefined" ||
    typeof input.lithiumBatteryInput?.lithiumContentInGrams === "undefined"
  ) {
    return {
      isExcepted: false,
      reason:
        "Lithium content (in grams) and quantity (in kgs) must be provided for Lithium Metal Batteries (UN3090, UN3091).",
      applicableRule:
        "Table A3.5. - Package limits for Excepted Lithium Batteries",
    };
  }

  if (input.lithiumBatteryInput.lithiumContentInGrams > 2) {
    return {
      isExcepted: false,
      reason:
        "Lithium Metal Batteries (UN3090, UN3091) exceed the maximum allowed lithium content (2g).",
      applicableRule:
        "Table A3.5. - Package limits for Excepted Lithium Batteries",
    };
  }

  if (input.lithiumBatteryInput.lithiumContentInGrams <= 2) {
    return {
      isExcepted: true,
      reason:
        "Lithium Metal Batteries (UN3090, UN3091) comply with the lithium content limit (≤2g).",
      applicableRule:
        "Table A3.5. - Package limits for Excepted Lithium Batteries",
    };
  }

  if (
    input.lithiumBatteryInput.lithiumContentInGrams > 0 &&
    input.lithiumBatteryInput.lithiumContentInGrams <= 0.3
  ) {
    const maxNetQuantityLimitPerPackageInKgs =
      input.table_A3_5_PackageLimitsForExceptedLithiumMetalBatteries["0.3g"]
        .maximumNetQuantityPerPackage;
    if (
      typeof maxNetQuantityLimitPerPackageInKgs === "number" &&
      input.lithiumBatteryInput.quantityIn_Kgs >
        maxNetQuantityLimitPerPackageInKgs
    ) {
      return {
        isExcepted: false,
        reason:
          "Lithium Metal Batteries (UN3090, UN3091) exceed the maximum allowed net quantity per package (2.5kg).",
        applicableRule:
          "Table A3.5. - Package limits for Excepted Lithium Batteries",
      };
    }
  }

  if (
    input.lithiumBatteryInput.lithiumContentInGrams > 0.3 &&
    input.lithiumBatteryInput.lithiumContentInGrams <= 2
  ) {
    const maxNumberOfBatteriesPerPackage =
      input.table_A3_5_PackageLimitsForExceptedLithiumMetalBatteries["0.3g-2g"]
        .maximumNumberOfBatteriesPerPackage;
    if (
      input.lithiumBatteryInput.numberOfLithiumBatteries &&
      maxNumberOfBatteriesPerPackage &&
      input.lithiumBatteryInput.numberOfLithiumBatteries >
        maxNumberOfBatteriesPerPackage
    ) {
      return {
        isExcepted: false,
        reason:
          "Lithium Metal Batteries (UN3090, UN3091) exceed the maximum allowed number of batteries per package (2).",
        applicableRule:
          "Table A3.5. - Package limits for Excepted Lithium Batteries",
      };
    }
  }

  return {
    isExcepted: true,
    reason:
      "Lithium Metal Batteries (UN3090, UN3091) meet all excepted quantity requirements.",
    applicableRule:
      "Table A3.5. - Package limits for Excepted Lithium Batteries",
  };
};
